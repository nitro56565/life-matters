import { useState } from 'react';
import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";
function SignIn ({redirectUrl}){
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="flex justify-center items-center min-h-screen font-poppins">
      <div className="sm:bg-white p-8 rounded-lg shadow-lg">
        <div className="flex items-center mb-4">
          <h1 className="text-2xl items-center font-semibold ml-4">Sign In</h1>
        </div>
        <div className="mb-4">
          <input
            type="number"
            placeholder="Enter your phone number"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-[#7326F1]"
          />
        </div>
        <div className="mb-4 relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-[#7326F1]"
          />

         <div className='absolute top-4 right-2'>
         <button onClick={togglePasswordVisibility}>
            {showPassword ? <FiEye/> : <FiEyeOff />}

          </button>
         </div>

          
          
        </div>
        <div className="mb-6 text-right">
          <a href="#forgot-password" className="text-[#7326F1] hover:underline">
            Forgot password?
          </a>
        </div>
        <button className="w-full bg-[#7326F1] text-white py-3 rounded-lg mb-6 ">
          Sign In
        </button>
        <p className="text-center mb-6">
          Don’t have an account?{' '}
          <a href={redirectUrl} className="text-[#7326F1] hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}

export default SignIn
