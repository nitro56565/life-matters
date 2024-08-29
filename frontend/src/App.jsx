import './App.css'
import {Routes,Route} from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import HomePage from './pages/HomePage'
import Ambulance from './pages/Ambulance'
import TrafficPoliceSignUp from './pages/signUp/TrafficPoliceSignUp'
import AmbulanceSignIn from './pages/siginIn/AmbulanceSignIn'
import TrafficPoliceSignIn from './pages/siginIn/TrafficPoliceSignIn'
import AmbulanceSignUp from './pages/signUp/AmbulanceSignUp'
import TrafficPolice from './pages/TrafficPolice'
import AmbulanceMainPage from './pages/ambulance-main-page/AmbulanceMainPage'
function App() {
  return (
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/home' element={<HomePage/>}/>
        <Route path='/ambulancesignin' element={<AmbulanceSignIn/>}/>
        <Route path='/ambulancesignup' element={<AmbulanceSignUp/>}/>
        <Route path='/trafficpolicesignin' element={<TrafficPoliceSignIn/>}/>
        <Route path='/trafficpolicesignup' element={<TrafficPoliceSignUp/>}/>
        <Route path='/ambulance' element={<Ambulance/>}/>
        <Route path='/traffic-police' element={<TrafficPolice/>}/>
        <Route path='/ambulance-home' element={<AmbulanceMainPage/>}/>
      </Routes>
  )
}

export default App
