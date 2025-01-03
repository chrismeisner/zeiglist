// src/components/ProgressBar.js
import React from 'react';

const ProgressBar = ({ progress }) => {
  return (
	<div className="mb-2">
	  <div className="w-full bg-gray-200 rounded-full h-4">
		<div
		  id="progressBar"
		  className="bg-blue-500 h-4 rounded-full"
		  style={{ width: `${progress}%` }}
		></div>
	  </div>
	</div>
  );
};

export default ProgressBar;
