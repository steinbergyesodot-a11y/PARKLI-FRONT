import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import App from './App.tsx'
import { Home } from './components/Home.tsx'
import { AddOwner } from './components/AddOwner.tsx'
import { SignUp } from './components/SignUp.tsx'
import { Login } from './components/Login.tsx'
import { Dashboard } from './components/Dashboard.tsx'
import {About} from './components/About.tsx'
import {AddDriveway} from './components/AddDriveway.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/AddDriveway" element={<AddDriveway />} />
      <Route path="/SignUp" element={<SignUp />} />
      <Route path="/Login" element={<Login/>} />
      <Route path="/Dashboard" element={<Dashboard/>} />
      <Route path="/About" element={<About/>} />







    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
