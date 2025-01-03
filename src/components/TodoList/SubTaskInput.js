// src/components/TodoList/SubTaskInput.js
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // For unique IDs

const SubTaskInput = ({ addSubTask, setShowSubTaskInput }) => {
  const [subTaskInput, setSubTaskInput] = useState('');

  const handleAdd = () => {
	if (subTaskInput.trim() === '') return;
	addSubTask(subTaskInput);
	setSubTaskInput('');
	setShowSubTaskInput(false);
  };

  const handleKeyPress = (e) => {
	if (e.key === 'Enter') {
	  handleAdd();
	}
  };

  return (
	<>
	  <input
		type="text"
		placeholder="Enter sub task..."
		value={subTaskInput}
		onChange={(e) => setSubTaskInput(e.target.value)}
		onKeyPress={handleKeyPress}
		className="
		  flex-grow p-1 mr-2
		  border border-gray-300 
		  rounded-lg 
		  focus:outline-none 
		  focus:ring-2 focus:ring-blue-400
		"
	  />
	  <button
		onClick={handleAdd}
		className="
		  px-3 py-1 
		  bg-green-500 text-white 
		  rounded hover:bg-green-600
		"
	  >
		Add
	  </button>
	</>
  );
};

export default SubTaskInput;
