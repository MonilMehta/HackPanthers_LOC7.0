import React from 'react'
import LandingPage from './pages/Landing/LandingPage'
import CrimeReport from './pages/main/anouser/CrimeReport'
import {Routes,BrowserRouter,Route} from 'react-router-dom'
const App = () => {
  return (
    // <div>
    //   <LandingPage/>
    // </div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/report" element={<CrimeReport />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
