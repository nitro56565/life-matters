import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignIn({ apiEndpoint, redirectUrl, signupLink }) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const attemptSignIn = async () => {
    const apiUrl = `${BACKEND_URL}${apiEndpoint}`;
    // console.log(`Attempting sign-in with URL: ${apiUrl}`);
    // console.log('Form data being sent:', formData);

    try {
      const response = await axios.post(apiUrl, formData);
      // console.log(`Response received from ${apiUrl}:`, response);

      if (response.status === 200) {
        setSuccessMessage("Sign-in successful! Redirecting...");
        setTimeout(() => {
          navigate(redirectUrl);
        }, 2000);
        return true;
      } else {
        setErrorMessage(response.data.message || "Sign-in failed. Please try again.");
        return false;
      }
    } catch (err) {
      console.error("Error during sign-in:", err);
      setErrorMessage("An error occurred during sign-in. Please try again.");
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Attempt sign-in
    const signInSuccessful = await attemptSignIn();

    if (!signInSuccessful) {
      setErrorMessage("Sign-in failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen font-poppins">
      <div className="sm:bg-white p-8 rounded-lg shadow-lg">
        <div className="flex items-center mb-4">
          <h1 className="text-2xl font-semibold ml-4">Sign In</h1>
        </div>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="number"
              name="phone"
              placeholder="Enter your phone number"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-[#7326F1]"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4 relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Enter your password"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-[#7326F1]"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="button" className="absolute top-4 right-2" onClick={togglePasswordVisibility}>
              {showPassword ? <FiEye /> : <FiEyeOff />}
            </button>
          </div>
          <div className="mb-6 text-right">
            <a href="#forgot-password" className="text-[#7326F1] hover:underline">
              Forgot password?
            </a>
          </div>
          <button type="submit" className="w-full bg-[#7326F1] text-white py-3 rounded-lg mb-6">
            Sign In
          </button>
          <p className="text-center mb-6">
            Don’t have an account?{' '}
            <a href={signupLink} className="text-[#7326F1] hover:underline">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignIn;