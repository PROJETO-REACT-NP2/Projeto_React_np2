// main.jsx — Ponto de entrada da aplicação React.
// Monta o App dentro do BrowserRouter (rotas) e StrictMode (checagens extras no dev).
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)