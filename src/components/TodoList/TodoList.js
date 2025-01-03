// src/components/TodoList/TodoList.js
import React, { useState } from 'react';
import TaskInput from './TaskInput';
import TaskList from './TaskList';
import ProgressBar from '../ProgressBar';
import ProgressSummary from '../ProgressSummary';
import FileControls from './FileControls';
import { v4 as uuidv4 } from 'uuid';

const TodoList = () => {
  /********************************
   * 1) STATE FOR TITLE, TASKS, ETC.
   * (Removed localStorage references; 
   *  just using defaults now.)
   ********************************/
  const [title, setTitle] = useState('My Master List');
  const [tasks, setTasks] = useState([]);
  const [createdAt, setCreatedAt] = useState(new Date());
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  /********************************
   * 2) DERIVED PROGRESS INFO
   ********************************/
  const totalTasks = tasks.reduce(
	(acc, task) => acc + 1 + task.subtasks.length,
	0
  );
  const completedTasks = tasks.reduce(
	(acc, task) =>
	  acc +
	  (task.completed ? 1 : 0) +
	  task.subtasks.filter((sub) => sub.completed).length,
	0
  );
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  /********************************
   * 3) TASK CRUD OPERATIONS
   ********************************/
  const addTask = (text) => {
	if (text.trim() === '') return;
	setTasks((prevTasks) => [
	  ...prevTasks,
	  {
		id: uuidv4(),
		text: text.trim(),
		completed: false,
		completedTime: null,
		subtasks: [],
		createdAt: new Date(),
	  },
	]);
  };

  const updateTask = (updatedTask) => {
	setTasks((prevTasks) =>
	  prevTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
	);
  };

  const deleteTask = (taskId) => {
	setTasks((prevTasks) => prevTasks.filter((t) => t.id !== taskId));
  };

  const reorderTasks = (newTasks) => {
	setTasks(newTasks);
  };

  /********************************
   * 4) FILE UPLOAD & DOWNLOAD
   ********************************/
  const handleUpload = (uploadedData) => {
	if (!uploadedData.tasks || !uploadedData.createdAt) {
	  alert('Invalid file format.');
	  return;
	}

	// Basic validation of fields
	const isValid = uploadedData.tasks.every((task) => {
	  if (
		!task.id ||
		typeof task.text !== 'string' ||
		typeof task.completed !== 'boolean' ||
		(task.completed && !task.completedTime)
	  ) {
		return false;
	  }
	  // Validate subtasks
	  if (task.subtasks) {
		return task.subtasks.every((sub) => {
		  return (
			sub.id &&
			typeof sub.text === 'string' &&
			typeof sub.completed === 'boolean' &&
			(sub.completed && sub.completedTime)
		  );
		});
	  }
	  return true;
	});

	if (!isValid) {
	  alert('Uploaded data is missing required fields or has invalid formats.');
	  return;
	}

	setTitle(uploadedData.title || 'My Master List'); // Fallback if no title
	setTasks(uploadedData.tasks);
	setCreatedAt(new Date(uploadedData.createdAt));
  };

  const handleSave = () => {
	const data = {
	  title,
	  tasks,
	  createdAt: createdAt.toISOString(),
	};
	const blob = new Blob([JSON.stringify(data, null, 2)], {
	  type: 'application/json',
	});
	const url = URL.createObjectURL(blob);

	// Sanitize title for file name if needed
	const safeTitle = title.replace(/[^\w\s-]/g, '');
	const link = document.createElement('a');
	link.href = url;
	link.download = `${safeTitle}-${createdAt.toISOString()}.json`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
  };

  // Removed `handleClear` and any calls to localStorage

  /********************************
   * 5) TITLE EDITING HANDLERS
   ********************************/
  const handleTitleClick = () => {
	setIsEditingTitle(true);
  };

  const handleTitleChange = (e) => {
	setTitle(e.target.value);
  };

  const handleTitleBlur = () => {
	setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e) => {
	if (e.key === 'Enter') {
	  setIsEditingTitle(false);
	}
  };

  /********************************
   * 6) RENDER
   ********************************/
  return (
	<div>
	  {/* File Upload & Save (no Clear) */}
	  <FileControls onUpload={handleUpload} onSave={handleSave} />

	  {/* Editable Title */}
	  <div className="text-center mb-4">
		{isEditingTitle ? (
		  <input
			type="text"
			className="text-lg font-bold border-b outline-none px-1"
			value={title}
			onChange={handleTitleChange}
			onBlur={handleTitleBlur}
			onKeyDown={handleTitleKeyDown}
			autoFocus
		  />
		) : (
		  <h1
			className="text-lg font-bold cursor-pointer"
			onClick={handleTitleClick}
		  >
			{title}
		  </h1>
		)}
	  </div>

	  {/* Creation Time */}
	  <div className="text-center mb-4">
		<p className="text-sm text-gray-500">
		  List Created:{' '}
		  {createdAt.toLocaleString('en-US', {
			weekday: 'short',
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric',
			timeZoneName: 'short',
		  })}
		</p>
	  </div>

	  {/* Progress Bar */}
	  <ProgressBar progress={progress} />

	  {/* Progress Summary */}
	  <ProgressSummary
		completedTasks={completedTasks}
		totalTasks={totalTasks}
		progress={progress}
	  />

	  {/* To-Do List Section */}
	  <TaskInput addTask={addTask} />
	  <TaskList
		tasks={tasks}
		updateTask={updateTask}
		deleteTask={deleteTask}
		reorderTasks={reorderTasks}
	  />
	</div>
  );
};

export default TodoList;
