import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";  // Import axios for API requests
import { useNavigate } from "react-router-dom";

const TrafficPoliceSignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigateTo = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    phone: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/trafficpolice/signup`, formData);
      if (response.status === 200) {
        setSuccessMessage("Sign-up successful! Redirecting to Sign-in...");
        setTimeout(() => {
          navigateTo("/trafficpolicesignin");
        }, 2000);
      }
    } catch (err) {
      console.error("Error during sign-up:", err);
      setErrorMessage(err.response?.data?.msg || "Sign-up failed. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex justify-center items-center min-h-screen font-poppins">
      <div className="sm:bg-white p-8 rounded-lg ">
        <div className="flex items-center mb-6">
          <h1 className="text-2xl items-center font-semibold ml-4">Sign Up</h1>
        </div>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label>Name:</label>
            <input
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#7326F1]"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label>Location:</label>
            <input
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#7326F1]"
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label>Contact Number:</label>
            <input
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#7326F1]"
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4 relative">
            <label>Password:</label>
            <input
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#7326F1]"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <div className='absolute top-9 right-2'>
              <button type="button" onClick={togglePasswordVisibility}>
                {showPassword ? <FiEye /> : <FiEyeOff />}
              </button>
            </div>
          </div>
          <button type="submit" className="w-full bg-[#7326F1] text-white py-3 rounded-full mb-6">
            Sign Up
          </button>
          <button
            type="button"
            className="w-full bg-[#7326F1] text-white py-3 rounded-full mb-6"
            onClick={() => navigateTo("/trafficpolicesignin")}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default TrafficPoliceSignUp;