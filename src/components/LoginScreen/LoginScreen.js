import React, { useState } from "react";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(1); // 1: Enter phone, 2: Enter code, 3: Logged in

  // Initialize Firebase Auth
  const auth = getAuth();
  auth.settings.appVerificationDisabledForTesting = false; // Enable Recaptcha in production
  console.log("[Auth] Firebase Auth instance:", auth);

  const setupRecaptcha = () => {
	try {
	  if (!auth) {
		console.error("[Auth] Firebase Auth instance is not initialized.");
		return;
	  }

	  if (!window.recaptchaVerifier) {
		console.log("[Auth] Setting up Recaptcha...");
		window.recaptchaVerifier = new RecaptchaVerifier(
		  "recaptcha-container",
		  {
			size: "invisible",
			callback: () => {
			  console.log("[Auth] Recaptcha verified successfully.");
			},
			"expired-callback": () => {
			  console.warn("[Auth] Recaptcha expired. Please try again.");
			},
		  },
		  auth
		);

		window.recaptchaVerifier.render().then((widgetId) => {
		  console.log(`[Auth] Recaptcha widget rendered with ID: ${widgetId}`);
		});
	  } else {
		console.log("[Auth] RecaptchaVerifier already initialized.");
	  }
	} catch (error) {
	  console.error("[Auth] Error initializing Recaptcha:", error.message);
	}
  };

  const handleSendCode = async () => {
	console.log("[Auth] Sending verification code...");

	if (!auth) {
	  console.error("[Auth] Firebase Auth instance is not initialized.");
	  return;
	}

	setupRecaptcha();

	try {
	  const appVerifier = window.recaptchaVerifier;
	  if (!appVerifier) {
		throw new Error("RecaptchaVerifier instance not initialized.");
	  }

	  const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
	  window.confirmationResult = confirmationResult;
	  console.log("[Auth] Verification code sent successfully.");
	  setStep(2); // Proceed to the "Enter Code" step
	} catch (error) {
	  console.error("[Auth] Error during Recaptcha or signInWithPhoneNumber:", error.message);
	}
  };

  const handleVerifyCode = async () => {
	console.log("[Auth] Verifying code...");

	try {
	  const confirmationResult = window.confirmationResult;
	  if (!confirmationResult) {
		throw new Error("No confirmation result found. Did you request a code?");
	  }

	  const result = await confirmationResult.confirm(verificationCode);

	  console.log("[Auth] Successfully logged in:", result.user);
	  setUser(result.user); // Save logged-in user
	  setStep(3); // Proceed to the logged-in state
	} catch (error) {
	  console.error("[Auth] Error verifying code:", error.message);
	}
  };

  return (
	<div className="flex items-center justify-center min-h-screen bg-gray-100">
	  <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
		{/* Recaptcha */}
		<div id="recaptcha-container"></div>

		{step === 1 && (
		  <>
			<h2 className="text-xl font-bold mb-4 text-center">Login</h2>
			<input
			  type="tel"
			  placeholder="Enter your mobile number"
			  value={phoneNumber}
			  onChange={(e) => setPhoneNumber(e.target.value)}
			  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
			<button
			  onClick={handleSendCode}
			  className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
			>
			  Send Code
			</button>
		  </>
		)}

		{step === 2 && (
		  <>
			<h2 className="text-xl font-bold mb-4 text-center">Enter Verification Code</h2>
			<input
			  type="text"
			  placeholder="Enter the code"
			  value={verificationCode}
			  onChange={(e) => setVerificationCode(e.target.value)}
			  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
			<button
			  onClick={handleVerifyCode}
			  className="w-full mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
			>
			  Verify Code
			</button>
		  </>
		)}

		{step === 3 && user && (
		  <div className="text-center">
			<h2 className="text-xl font-bold mb-4">Welcome!</h2>
			<p className="mb-4">Logged in as: {user.phoneNumber}</p>
			<button
			  onClick={() => {
				auth.signOut();
				setUser(null);
				setStep(1); // Reset to login
			  }}
			  className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
			>
			  Log Out
			</button>
		  </div>
		)}
	  </div>
	</div>
  );
};

export default LoginScreen;
