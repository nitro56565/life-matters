import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();
  const goToPreviousPath = () => {
    navigate(-1);
  };

  return (
    <div className="flex justify-center items-center min-h-screen font-poppins">
      <div className="sm:bg-white p-8 rounded-lg shadow-lg">
        <div className="flex items-center mb-4">
          <h1 className="text-2xl items-center font-semibold ml-4">
            Forgot Password
          </h1>
        </div>
        <div className="mb-4">
          <input
            type="number"
            placeholder="Enter your phone number"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-[#7326F1]"
            required
          />
        </div>
        <button className="w-full bg-[#7326F1] text-white py-3 rounded-lg mb-6 ">
          Request OTP
        </button>
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
