// src/components/TodoList/TaskInput.js
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // For unique IDs

const TaskInput = ({ addTask }) => {
  const [taskInput, setTaskInput] = useState('');

  const handleAdd = () => {
	addTask(taskInput);
	setTaskInput('');
  };

  const handleKeyPress = (e) => {
	if (e.key === 'Enter') {
	  handleAdd();
	}
  };

  return (
	<div className="flex items-center mb-4">
	  <input
		type="text"
		placeholder="Enter a new task"
		value={taskInput}
		onChange={(e) => setTaskInput(e.target.value)}
		onKeyPress={handleKeyPress}
		className="
		  flex-grow p-2 
		  border border-gray-300 
		  rounded-lg 
		  focus:outline-none 
		  focus:ring-2 focus:ring-blue-400
		"
	  />
	  <button
		onClick={handleAdd}
		className="
		  ml-2 px-4 py-2 
		  bg-blue-500 text-white 
		  font-bold 
		  rounded-lg 
		  hover:bg-blue-600 
		  focus:outline-none 
		  focus:ring-2 focus:ring-blue-400
		"
	  >
		Add Task
	  </button>
	</div>
  );
};

export default TaskInput;
