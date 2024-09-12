import React from 'react';
import { useNavigate } from 'react-router-dom';

function TrafficPoliceMainPage() {
    const navigate = useNavigate(); // Use the hook to navigate

    const logout = (event) => {
        event.preventDefault(); // Prevent default behavior like page refresh
        localStorage.removeItem('authToken'); // Clear the correct token
        console.log("Logged out, token removed:", localStorage.getItem('authToken')); // Debugging line to ensure it's cleared
        navigate('/trafficpolicesignin'); // Redirect to login page
    };    

    return (
        <div className="container mx-auto px-2 py-4">
            <h1 className="text-xl font-bold text-center mb-6 font-poppins text-[#7326F1]">
                Traffic Police Portal
            </h1>

            {/* Logout Button */}
            <div className="text-right mb-4">
                <button onClick={logout} className="text-sm bg-red-500 text-white py-1 px-3 rounded">
                    Logout
                </button>
            </div>

            {/* Other content for the Traffic Police dashboard */}
            <div>TrafficPoliceMainPage content here</div>
        </div>
    );
}

export default TrafficPoliceMainPage;