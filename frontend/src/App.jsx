import './App.css'
import {Routes,Route} from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import HomePage from './pages/HomePage'
import SignIn from './components/SignIn'
import { StrictMode } from 'react'
function App() {
  return (
    <StrictMode>
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/home' element={<HomePage/>}/>
        <Route path='/signin' element={<SignIn/>}/>
      </Routes>
    </StrictMode>
  )
}

export default App
