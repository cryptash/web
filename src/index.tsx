import React from 'react'
import { createRoot } from 'react-dom/client';
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './Pages/Login/Login'
import Home from './Pages/Home/Home'
import Register from './Pages/Register/Register'
import { ScreenProvider } from './Contexts/ScreenContext'

const container = document.getElementById('root');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(
  <React.StrictMode>
    <ScreenProvider>
      <BrowserRouter>
        <App>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path='/:id' element={<Home />} />
            <Route index element={<Home />} />
          </Routes>
        </App>
      </BrowserRouter>
    </ScreenProvider>
  </React.StrictMode>);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
