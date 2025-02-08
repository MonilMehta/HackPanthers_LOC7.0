import React from 'react'
import LandingPage from './pages/Landing/LandingPage'
import CrimeReport from './pages/main/anouser/CrimeReport'
import {Routes,BrowserRouter,Route} from 'react-router-dom'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
const App = () => {
  return (
    // <div>
    //   <LandingPage/>
    // </div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/report" element={<CrimeReport />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
