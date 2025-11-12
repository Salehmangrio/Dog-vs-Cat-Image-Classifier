import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = "https://salehmangrio-dog-cat-prediction.hf.space/predict"; 

const ImageClassifier = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle file selection
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith("image/")) {
        setError("Please upload a valid image file.");
        return;
      }
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setPrediction(null);
      setError(null);
    } else {
      setFile(null);
      setPreviewUrl(null);
    }
  };

  // Handle upload and prediction
  const handleUpload = async (event) => {
    event.preventDefault();

    if (!file) {
      setError("Please select an image file first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setPrediction(data);
    } catch (err) {
      console.error("Prediction error:", err);
      setError(`Failed to get prediction. Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const buttonClasses = `
    w-full py-3 px-4 rounded-xl text-white font-semibold text-lg tracking-wide transition-all duration-300
    ${!file || isLoading
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg"}
  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-2xl bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-2 tracking-tight">
          🐕 Dog or Cat 🐈
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Upload an image (it will be resized to <b>60×60</b>) to get a prediction.
          <br />Please upload a photo of a <span className="font-semibold">cat</span> or <span className="font-semibold">dog</span>.
        </p>

        {/* Upload Form */}
        <form onSubmit={handleUpload} className="space-y-6">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-indigo-300 rounded-2xl cursor-pointer bg-indigo-50/50 hover:bg-indigo-100 transition duration-300">
              <div className="flex flex-col items-center justify-center py-6">
                <svg
                  className="w-10 h-10 mb-3 text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.884 1.768A3.987 3.987 0 013 16h18a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4h10a4 4 0 014 4v3"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11l-3-3m0 0L9 11m3-3v12"
                  ></path>
                </svg>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop
                </p>
                {file && <p className="mt-2 text-xs text-indigo-700">{file.name}</p>}
              </div>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isLoading}
              />
            </label>
          </div>

          {/* Submit Button */}
          <button type="submit" className={buttonClasses} disabled={!file || isLoading}>
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <svg
                  className="animate-spin h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4zm2 5.29A7.96 7.96 0 014 12H0c0 3.04 1.14 5.82 3 7.94l3-2.65z"
                  ></path>
                </svg>
                <span>Predicting...</span>
              </div>
            ) : (
              "Get Prediction"
            )}
          </button>
        </form>

        {/* Image Preview */}
        <AnimatePresence>
          {previewUrl && (
            <motion.div
              className="mt-10 text-center border-t border-gray-200 pt-6"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-xl font-semibold text-gray-700 mb-4">📸 Preview</h3>
              <motion.img
                src={previewUrl}
                alt="Preview"
                className="max-w-full h-auto max-h-72 mx-auto rounded-xl shadow-md border-2 border-indigo-200 p-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        {error && (
          <motion.div
            className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="font-bold text-lg">❌ Error!</p>
            <p className="text-sm">{error}</p>
          </motion.div>
        )}

        {/* Prediction Result */}
        <AnimatePresence>
          {prediction && (
            <motion.div
              className="mt-8 p-6 bg-green-100 border border-green-400 text-green-800 rounded-xl shadow-md text-center"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-3xl font-bold mb-3">✅ Result</h3>
              <p className="text-lg mb-2">The model predicts:</p>
              <p className="text-4xl font-extrabold">{prediction.predicted_class}</p>
              <p className="text-lg mt-2">
                Confidence:{" "}
                <span className="font-semibold text-green-900">
                  {(prediction.confidence * 100).toFixed(2)}%
                </span>
              </p>
              <p className="text-xs text-gray-500 mt-3">📁 File: {prediction.filename}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ImageClassifier;
