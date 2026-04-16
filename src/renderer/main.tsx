import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// HashRouter so routes work under any base path:
// - GitHub Pages subpath (/Composer/#/daws)
// - Electron production file:// URLs (file:///.../dist/index.html#/daws)
// - Local dev servers without subpath-aware server rewrites

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
)
