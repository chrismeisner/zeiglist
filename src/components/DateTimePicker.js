// src/components/DateTimePicker.js
import React from 'react';

const DateTimePicker = ({ eventDateTime, setEventDateTime, onUpdate }) => {
  return (
	<div
	  className="
		flex flex-col md:flex-row md:items-center 
		space-y-2 md:space-y-0 md:space-x-2
		justify-center
	  "
	>
	  <input
		type="datetime-local"
		value={eventDateTime}
		onChange={(e) => setEventDateTime(e.target.value)}
		className="
		  p-2
		  border border-gray-300
		  rounded-lg
		  focus:outline-none focus:ring-2 focus:ring-blue-400
		  w-full md:w-auto
		"
	  />
	  <button
		onClick={onUpdate}
		className="
		  px-4 py-2 
		  bg-blue-500 
		  text-white 
		  font-bold 
		  rounded-lg 
		  hover:bg-blue-600 
		  focus:outline-none 
		  focus:ring-2 focus:ring-blue-400
		"
	  >
		Update
	  </button>
	</div>
  );
};

export default DateTimePicker;
