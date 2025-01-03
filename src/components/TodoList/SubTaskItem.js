// src/components/TodoList/SubTaskItem.js
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const SubTaskItem = ({ sub, parentTask, updateSubTasks }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [textValue, setTextValue] = useState(sub.text);

  const toggleCompletion = () => {
	const updatedSub = {
	  ...sub,
	  completed: !sub.completed,
	  completedTime: !sub.completed ? new Date() : null,
	};
	const updatedSubtasks = parentTask.subtasks.map((s) =>
	  s.id === updatedSub.id ? updatedSub : s
	);
	updateSubTasks(updatedSubtasks);
  };

  const handleDelete = () => {
	if (window.confirm('Are you sure you want to delete this subtask?')) {
	  const updatedSubtasks = parentTask.subtasks.filter((s) => s.id !== sub.id);
	  updateSubTasks(updatedSubtasks);
	}
  };

  const handleEdit = () => {
	if (isEditing && textValue.trim() !== '') {
	  const updatedSub = {
		...sub,
		text: textValue.trim(),
	  };
	  const updatedSubtasks = parentTask.subtasks.map((s) =>
		s.id === updatedSub.id ? updatedSub : s
	  );
	  updateSubTasks(updatedSubtasks);
	}
	setIsEditing(!isEditing);
  };

  return (
	<li
	  data-id={sub.id}
	  className={`
		group 
		flex items-center justify-between 
		p-1 border rounded-lg 
		hover:bg-gray-50
		${sub.completed ? 'line-through text-gray-400' : ''}
	  `}
	>
	  {/* LEFT side: handle + checkbox + label */}
	  <div className="flex items-center flex-grow">
		<span className="mr-2 text-gray-500 select-none sub-grab-handle">
		  ≡
		</span>
		<input
		  type="checkbox"
		  className="mr-2"
		  checked={sub.completed}
		  onChange={toggleCompletion}
		/>
		{isEditing && !sub.completed ? (
		  <input
			type="text"
			value={textValue}
			onChange={(e) => setTextValue(e.target.value)}
			onBlur={handleEdit}
			onKeyPress={(e) => {
			  if (e.key === 'Enter') handleEdit();
			}}
			className="
			  flex-grow 
			  border border-gray-300 
			  rounded-lg 
			  px-1
			"
			autoFocus
		  />
		) : (
		  <span
			className="cursor-pointer"
			onClick={() => !sub.completed && setIsEditing(true)}
		  >
			{sub.text}
			{sub.completedTime && (
			  <span className="text-sm text-gray-500">
				{' '}
				(completed on{' '}
				{new Date(sub.completedTime).toLocaleString('en-US', {
				  year: 'numeric',
				  month: 'short',
				  day: 'numeric',
				  hour: 'numeric',
				  minute: 'numeric',
				  second: 'numeric',
				  timeZoneName: 'short',
				})}
				)
			  </span>
			)}
		  </span>
		)}
	  </div>

	  {/* RIGHT side: delete */}
	  <button
		onClick={handleDelete}
		className="
		  ml-2 text-red-500 
		  hidden group-hover:inline-block
		"
	  >
		🗑️
	  </button>
	</li>
  );
};

export default SubTaskItem;
