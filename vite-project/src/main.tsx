import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import App from './App.tsx'
import { Home } from './components/Home.tsx'
import { AddOwner } from './components/AddOwner.tsx'
import { SignUp } from './components/SignUp.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/AddOwner" element={<AddOwner />} />
      <Route path="/SignUp" element={<SignUp />} />




    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
