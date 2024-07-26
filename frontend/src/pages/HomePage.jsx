import React from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
	const navigate = useNavigate();
	return (
		<div className=" flex flex-col items-center h-screen">
			<div className="flex flex-col items-center">
				<img
					className="max-w-md"
					src="/images/life-matters-logo-t-nnm.png"
					alt="Logo"
				/>
			</div>
			<div className="w-3/5 flex flex-col items-center gap-4 mt-4">
				<button
					className="w-full bg-[#7326F1] text-white font-bold py-2 px-7 rounded-full"
					onClick={() => navigate("/ambulancesignin")}>Ambulance</button>
				<button
					className="w-full bg-[#7326F1] text-white font-bold py-2 px-6 rounded-full"
					onClick={() => navigate("/trafficpolicesignin")}>Traffic Police
				</button>
			</div>
		</div>
	);
}

export default HomePage;
