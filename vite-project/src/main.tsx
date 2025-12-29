import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import App from './App.tsx'
import { Home } from './components/Home.tsx'
import { SignUp } from './components/SignUp.tsx'
import { Login } from './components/Login.tsx'
import { Dashboard } from './components/Dashboard.tsx'
import {About} from './components/About.tsx'
import {AddDriveway} from './components/AddDriveway.tsx'
import { DrivewayDetailed } from './components/DrivewayDetailed.tsx'
import { UserProvider } from './userContext.tsx'
import { AnimatedRoutes } from './components/AnimatedRoutes.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>

    <BrowserRouter>
     
    <AnimatedRoutes/>
   
    </BrowserRouter>
    </UserProvider>
  </StrictMode>,
)
