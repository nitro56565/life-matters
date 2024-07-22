import React, { useState } from 'react';

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <div className="flex items-center mb-6">
          <h1 className="text-2xl items-center font-semibold ml-4">Sign In</h1>
        </div>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-[#7326F1]"
          />
        </div>
        <div className="mb-4 relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-[#7326F1]"
          />
          
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
          <a href="#sign-up" className="text-[#7326F1] hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}

export default SignIn
