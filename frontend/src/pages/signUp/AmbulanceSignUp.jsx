import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AmbulanceSignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    hospitalName: "",
    vehicleNumber: "",
    phone: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

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
      const response = await axios.post(`${BACKEND_URL}/api/ambulance/signup`, formData); // Ensure this URL is correct

      if (response.status === 200) {
        setSuccessMessage("Sign-up successful! Redirecting...");
        setFormData({
          name: "",
          hospitalName: "",
          vehicleNumber: "",
          phone: "",
          password: "",
        });
        setTimeout(() => {
          navigateTo("/ambulancesignin");
        }, 2000); // Redirect to Sign In after 2 seconds
      } else {
        setErrorMessage(response.data.msg || "Sign-up failed. Please try again.");
      }
    } catch (err) {
      console.error("Error during sign-up:", err);
      setErrorMessage("An error occurred during sign-up. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const navigateTo = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-screen font-poppins">
      <div className="sm: bg-white p-8 rounded-lg shadow-lg">
        <div className="flex items-center mb-4">
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
            <label>Hospital Name:</label>
            <input
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#7326F1]"
              type="text"
              name="hospitalName"
              value={formData.hospitalName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label>Ambulance Vehicle Number:</label>
            <input
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#7326F1]"
              type="text"
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label>Phone:</label>
            <input
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#7326F1]"
              type="number"
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
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="button" className="absolute top-9 right-2" onClick={togglePasswordVisibility}>
              {showPassword ? <FiEye /> : <FiEyeOff />}
            </button>
          </div>
          <button type="submit" className="w-full bg-[#7326F1] text-white py-3 rounded-full mb-6">
            Sign Up
          </button>
        </form>
        <button
          className="w-full bg-[#7326F1] text-white py-3 rounded-full mb-6"
          onClick={() => navigateTo("/ambulancesignin")}
        >
          Sign In
        </button>
      </div>
    </div>
  );
}

export default AmbulanceSignUp;