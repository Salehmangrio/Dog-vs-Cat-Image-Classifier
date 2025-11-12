import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ImageClassifier from './ImageClassifier'
import './index.css'

createRoot(document.getElementById('root')).render(
  <ImageClassifier />
)
