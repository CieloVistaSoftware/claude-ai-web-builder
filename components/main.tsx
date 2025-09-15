import React from 'react'
import ReactDOM from 'react-dom/client'
import EditorDashboard from './editors/editor-dashboard'
import './editors/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <EditorDashboard />
  </React.StrictMode>,
)