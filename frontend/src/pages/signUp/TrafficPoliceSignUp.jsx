import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TrafficPoliceSignUp = () => {
  const navigateTo = useNavigate();
  const [formData, setFormData] = useState({
    Name: "",
    Location: "",
    contact: "",
    Password: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    setFormData({
      name: "",
      location: "",
      contact: "",
      Password: "",
    });
  };
  // const history = useHistory();

  // const redirectToSignIn = () => {
  //   history.push('/signin');
  // };

  return (
    <div className="flex justify-center items-center min-h-screen font-poppins">
      <div className="sm:bg-white p-8 rounded-lg ">
        <div className="flex items-center mb-6">
          <h1 className="text-2xl items-center font-semibold ml-4">Sign Up</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label>Name:</label>
            <input
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#7326F1]"
              type="text"
              name="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label>Location:</label>
            <input
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#7326F1] font-poppins"
              type="text"
              name="HospitalName"
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
              name="HospitalName"
              value={formData.contact}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4 relative">
            <label>Password:</label>
            <input
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#7326F1]"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button className="w-full bg-[#7326F1] text-white py-3 rounded-full mb-6 ">
            Sign Up
          </button>
          <button
            className="w-full bg-[#7326F1] text-white py-3 rounded-full mb-6 "
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
