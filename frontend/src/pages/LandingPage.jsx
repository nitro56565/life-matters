import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function LandingPage() {
  const navigate = useNavigate()

  useEffect(() => {
    setTimeout(() => {
      navigate('/home')
    }, 2000)
  }, [])
  return (
    <div className="flex justify-center items-center h-screen animate-pulse">
      <img src="/images/life-matters-logo-t-nnm.png" alt="Logo" />
    </div>
  )
}

export default LandingPage
