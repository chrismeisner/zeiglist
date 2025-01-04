// src/components/Countdown.js
import React from 'react';

const Countdown = ({ countdownText }) => {
  return (
	<div>
	  <h1 className="text-2xl font-bold mt-4 text-center">
		Countdown
	  </h1>
	  <div
		id="countdown"
		className="text-4xl font-mono text-blue-600 text-center mt-2 mb-6"
	  >
		{countdownText}
	  </div>
	</div>
  );
};

export default Countdown;
