// src/components/CurrentTimeDisplay.js
import React, { useState, useEffect } from 'react';

const CurrentTimeDisplay = () => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
	const updateTime = () => {
	  const now = new Date();
	  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
	  const dateString = now.toLocaleString('en-US', {
		weekday: 'short',
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
		timeZoneName: 'short',
	  });
	  setCurrentTime(`${dateString} (${tz})`);
	};

	updateTime();
	const intervalId = setInterval(updateTime, 1000);
	return () => clearInterval(intervalId);
  }, []);

  return (
	<div className="text-center mb-4">
	  <h2 className="text-lg font-semibold">
		Current Time:{' '}
		<span className="font-normal text-gray-600">{currentTime}</span>
	  </h2>
	</div>
  );
};

export default CurrentTimeDisplay;
