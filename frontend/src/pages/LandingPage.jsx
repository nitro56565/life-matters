import React,{useEffect} from 'react'

function LandingPage() {
  // const history = useHistory();

  // useEffect(() => {
  //   // Example of navigating to a new route after 2 seconds
  //   const timeoutId = setTimeout(() => {
  //     history.push('/home'); // Replace '/dashboard' with your desired route
  //   }, 2000);

  //   return () => clearTimeout(timeoutId); // Cleanup the timeout
  // }, [history]);
  return (
    <div className="sm:flex justify-center items-center h-screen animate-pulse">
      <img src="../../public/images/life-matters-logo-t-nnm.png" alt="Logo" />
    </div>
  )
}

export default LandingPage
