import React, { useState } from "react";

function SignUp() {
  const [formData, setFormData] = useState({
    Name: "",
    HospitalName: "",
    AmbulanceVehicleNo: "",
    Phone: "",
    Email: "",
    password: "",
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
      hospitalName: "",
      ambulanceVehicleNo: "",
      phone: "",
      email: "",
      password: "",
    });
  };
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <div className="flex items-center mb-6">
          <h1 className="text-2xl items-center font-semibold ml-4">Sign Up</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label>Name:</label>
            <input
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-[#7326F1]"
              type="text"
              name="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label>Hospital Name:</label>
            <input
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-[#7326F1]"
              type="text"
              name="HospitalName"
              value={formData.hospitalName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label>Ambulace Vehicle Number:</label>
            <input
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-[#7326F1]"
              type="text"
              name="HospitalName"
              value={formData.ambulanceVehicleNo}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label>Phone:</label>
            <input
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-[#7326F1]"
              type="number"
              name="Phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label>Email:</label>
            <input
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-[#7326F1]"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4 relative">
            <label>Password:</label>
            <input
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-[#7326F1]"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button className="w-full bg-[#7326F1] text-white py-3 rounded-lg mb-6 ">
          Sign Up
        </button> 
        <button className="w-full bg-[#7326F1] text-white py-3 rounded-lg mb-6 ">
          Sign In
        </button>         
        </form>
      </div>
    </div>
  );
}

export default SignUp;
