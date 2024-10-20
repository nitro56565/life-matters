import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

function ForgotPassword() {
  const navigate = useNavigate();
  const goToPreviousPath = () => {
    navigate(-1);
  };

  const [inputValue, setInputValue] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [otp, setOtp] = useState(new Array(6).fill(""));

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleClick = () => {
    setIsVisible(!isVisible);
  };

  const handleChange = (element, index) => {
    const value = element.value;

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
        <div className="text-center mb-4">
          <h1 className="text-2xl items-center font-semibold ml-4 ">
            Forgot Password
          </h1>
        </div>
        <div className="mb-4 flex justify-center">
          {isVisible && (
            <input
              type="number"
              placeholder="Enter your phone number"
              value={inputValue}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-[#7326F1]"
              required
            />
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
            >
              {!isVisible ? "Validate OTP" : "Request OTP"}
            </button>
          </div>
        </form>
        <div className="mb-6 text-right">
          Did't you receive any code?
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