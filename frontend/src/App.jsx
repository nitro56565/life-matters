import './App.css'
import {Routes,Route} from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import HomePage from './pages/HomePage'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Ambulance from './pages/Ambulance'
import TrafficPolice from './pages/TrafficPolice'
import { StrictMode } from 'react'
function App() {
  return (
    <StrictMode>
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/home' element={<HomePage/>}/>
        <Route path='/signin' element={<SignIn/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/ambulance' element={<Ambulance/>}/>
        <Route path='/traffic-police' element={<TrafficPolice/>}/>
      </Routes>
    </StrictMode>
  )
}

export default App
