import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function AmbulanceSignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    Name: "",
    HospitalName: "",
    AmbulanceVehicleNo: "",
    Phone: "",
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
      password: "",
    });
  };
  // const history = useHistory();

  // const redirectToSignIn = () => {
  //   history.push('/signin');
  // };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }
  const navigateTo = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-screen font-poppins">
      <div className="sm: bg-white p-8 rounded-lg shadow-lg  ">
        <div className="flex items-center mb-4">
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
            <label>Hospital Name:</label>
            <input
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#7326F1]"
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
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#7326F1]"
              type="text"
              name="AmbulanceVehicleNo"
              value={formData.ambulanceVehicleNo}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label>Phone:</label>
            <input
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#7326F1]"
              type="number"
              name="Phone"
              value={formData.Phone}
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

<button type="button" className='absolute top-9 right-2'>
         <span  onClick={togglePasswordVisibility}>
            {showPassword ? <FiEye/> : <FiEyeOff />}

          </span>
         </button>
          </div>
          <button type="submit" className="w-full bg-[#7326F1] text-white py-3 rounded-full mb-6 ">
            Sign Up
          </button>
        </form>
        <button
          className="w-full bg-[#7326F1] text-white py-3 rounded-full mb-6 "
          onClick={() => navigateTo("/ambulancesignin")}
        >
          Sign In
        </button>
      </div>
    </div>
  );
}

export default AmbulanceSignUp;
