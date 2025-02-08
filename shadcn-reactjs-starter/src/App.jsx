import React from 'react'
import { Routes, BrowserRouter, Route } from 'react-router-dom'
import LandingPage from './pages/Landing/LandingPage'
import CrimeReport from './pages/main/anouser/CrimeReport'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import Main from './pages/main/policeman/Main'
import ProtectedRoute from './components/ProtectedRoute'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected routes */}
        <Route path="/report" element={
          <ProtectedRoute>
            <CrimeReport />
          </ProtectedRoute>
        } />
        <Route path="/main/*" element={
          <ProtectedRoute>
            <Main />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
