import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

function ForgotPassword() {
  const navigate = useNavigate();
  const goToPreviousPath = () => {
    navigate(-1);
  };

  const [inputValue, setInputValue] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [error, setError] = useState('');
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  // Function to validate phone number and toggle button state
  const validatePhoneNumber = (value) => {
    if (/^\d{10}$/.test(value)) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    if (/^\d*$/.test(value) && value.length <= 10) {
      setInputValue(value);
      setError('');
      validatePhoneNumber(value);  
    } else if (value.length > 10) {
      setError('Phone number cannot exceed 10 digits.');
      setIsButtonDisabled(true);
    } else {
      setError('Phone number can only contain digits.');
      setIsButtonDisabled(true);
    }
  };

  const handleClick = () => {
      setIsVisible(!isVisible);
  };

  const handleChange = (element, index) => {
    const value = element.value;
    if (!/^\d?$/.test(value)) {
      setError('OTP can only contain digits.');
      return;
    }
    setError('');

    const otpArray = [...otp];
    otpArray[index] = value;
    setOtp(otpArray);

    if (value && index < otp.length - 1) {
      document.getElementById(`otpInput-${index + 1}`).focus();
    }
  };

  const handleBackspace = (event, index) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otpInput-${index - 1}`).focus();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const otpValue = otp.join("");
  };

  return (
    <div className="flex justify-center items-center min-h-screen font-poppins">
      <div className="sm:bg-white p-8 rounded-lg shadow-lg">
        <div className="flex items-center mb-4">
          <h1 className="text-2xl font-semibold ml-4">
            Forgot Password
          </h1>
        </div>
        <div className="mb-4 flex justify-center">
          {isVisible && (
            <div>
              <input
                type="text"
                placeholder="Enter your phone number"
                value={inputValue}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-[#7326F1]"
                maxLength={10}
                required
              />
              {error && <p className="text-red-500 text-sm mt-1 ">{error}</p>}
            </div>
          )}
          {!isVisible && <p>Enter the code from SMS we sent to {inputValue}</p>}
        </div>
        <form onSubmit={handleSubmit}>
          {!isVisible && (
            <div className="mb-4 flex justify-center">
              {otp.map((_, index) => (
                <input
                  key={index}
                  id={`otpInput-${index}`}
                  type="text"
                  maxLength="1"
                  value={otp[index]}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleBackspace(e, index)}
                  className="flex-1 w-10 p-3 border border-gray-300 rounded focus:outline-none focus:border-[#7326F1] ml-2"
                />
              ))}
            </div>
          )}
          <div>
            <button
              type="submit"
              className="w-full bg-[#7326F1] text-white py-3 rounded-full mb-6 "
              onClick={handleClick}
              disabled={isButtonDisabled}
            >
              {!isVisible ? "Validate OTP" : "Request OTP"}
            </button>
          </div>
        </form>
        <div className="mb-6 text-center text-sm">
          Didn't receive any code?
          <a href="/forgot-password" className="text-[#7326F1] hover:underline">
            Click here
          </a>
        </div>
        <button
          className="w-full bg-[#7326F1] text-white py-3 rounded-full mb-6 "
          onClick={goToPreviousPath}
        >
          Sign In
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;
