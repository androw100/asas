import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initRealProgressTracker } from './utils/realProgressTracker.js'

// Initialize real byte-accurate 3D download tracker
initRealProgressTracker();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
