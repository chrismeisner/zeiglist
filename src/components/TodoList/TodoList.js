// File: /Users/chrismeisner/Projects/zeiglist/src/components/TodoList/TodoList.js

import React, { useState, useEffect } from 'react';
import TaskInput from './TaskInput';
import TaskList from './TaskList';
import ProgressBar from '../ProgressBar';
import ProgressSummary from '../ProgressSummary';
import FileControls from './FileControls';
import CurrentTimeDisplay from '../CurrentTimeDisplay';
import DateTimePicker from '../DateTimePicker';
import Countdown from '../Countdown';
import { v4 as uuidv4 } from 'uuid';

const TodoList = ({ loadedData }) => {
  /********************************
   * 1) STATE FOR TITLE, TASKS, CREATED TIME
   ********************************/
  const [title, setTitle] = useState(
	loadedData ? loadedData.title : 'My Master List'
  );
  const [tasks, setTasks] = useState(loadedData ? loadedData.tasks : []);
  const [createdAt, setCreatedAt] = useState(
	loadedData?.createdAt ? new Date(loadedData.createdAt) : new Date()
  );

  /********************************
   * 2) COUNTDOWN & TIME PICKER
   ********************************/
  // If loadedData included eventDateTime, restore it. Otherwise default to empty
  const [eventDateTime, setEventDateTime] = useState(
	loadedData?.eventDateTime ? loadedData.eventDateTime : ''
  );
  const [countdownText, setCountdownText] = useState('');

  // If loadedData changes (e.g. different ID?), update
  useEffect(() => {
	if (loadedData) {
	  setTitle(loadedData.title || 'My Master List');
	  setTasks(loadedData.tasks || []);
	  setCreatedAt(
		loadedData.createdAt ? new Date(loadedData.createdAt) : new Date()
	  );
	  setEventDateTime(loadedData.eventDateTime || '');
	}
  }, [loadedData]);

  // Recalculate countdown every second
  useEffect(() => {
	const timer = setInterval(() => {
	  if (!eventDateTime) {
		setCountdownText('Set a time completion time');
		return;
	  }

	  const now = new Date();
	  const target = new Date(eventDateTime);
	  const diff = target - now;

	  if (diff <= 0) {
		setCountdownText('Time is up!');
		return;
	  }

	  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
	  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
	  const minutes = Math.floor((diff / (1000 * 60)) % 60);
	  const seconds = Math.floor((diff / 1000) % 60);

	  setCountdownText(`${days}d ${hours}h ${minutes}m ${seconds}s remaining`);
	}, 1000);

	return () => clearInterval(timer);
  }, [eventDateTime]);

  const handleUpdateEventDateTime = () => {
	alert('Event date/time updated!');
  };

  /********************************
   * 3) DERIVED PROGRESS INFO
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
   * 4) TASK CRUD OPERATIONS
   ********************************/
  const addTask = (text) => {
	if (text.trim() === '') return;
	setTasks((prev) => [
	  ...prev,
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
	setTasks((prev) =>
	  prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
	);
  };

  const deleteTask = (taskId) => {
	setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const reorderTasks = (newTasks) => {
	setTasks(newTasks);
  };

  /********************************
   * 5) FILE UPLOAD & DOWNLOAD
   ********************************/
  // (A) handleUpload: read "eventDateTime" if present in the JSON
  const handleUpload = (uploadedData) => {
	console.log('[TodoList] handleUpload called with:', uploadedData);
	if (!uploadedData.tasks) {
	  alert('Invalid file format: "tasks" array is missing.');
	  return;
	}

	setTitle(uploadedData.title || 'My Master List');
	setTasks(uploadedData.tasks);
	setCreatedAt(
	  uploadedData.createdAt ? new Date(uploadedData.createdAt) : new Date()
	);

	// If JSON includes eventDateTime, restore it
	if (uploadedData.eventDateTime) {
	  setEventDateTime(uploadedData.eventDateTime);
	}
  };

  // (B) handleSave: include "eventDateTime" in the JSON
  const handleSave = () => {
	console.log('[TodoList] handleSave triggered.');
	const data = {
	  title,
	  tasks,
	  createdAt: createdAt.toISOString(),
	  eventDateTime, // <--- Important
	};
	console.log('[TodoList] Data to be saved:', data);

	const blob = new Blob([JSON.stringify(data, null, 2)], {
	  type: 'application/json',
	});
	const url = URL.createObjectURL(blob);

	const safeTitle = title.replace(/[^\w\s-]/g, '');
	const link = document.createElement('a');
	link.href = url;
	link.download = `${safeTitle}-${createdAt.toISOString()}.json`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
  };

  /********************************
   * 6) TITLE EDITING HANDLERS
   ********************************/
  const [isEditingTitle, setIsEditingTitle] = useState(false);

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
   * 7) RENDER
   ********************************/
  // Combine all data we might want to store (for FileControls, Airtable, etc.)
  const todoData = {
	title,
	tasks,
	createdAt,
	eventDateTime,
  };

  return (
	<div>
	  {/* (1) File Upload & Save Controls */}
	  <FileControls
		onUpload={handleUpload}
		onSave={handleSave}
		todoData={todoData}
	  />

	  {/* (2) Countdown & DateTimePicker & Current Time Display */}
	  <CurrentTimeDisplay />
	  <DateTimePicker
		eventDateTime={eventDateTime}
		setEventDateTime={setEventDateTime}
		onUpdate={handleUpdateEventDateTime}
	  />
	  <Countdown countdownText={countdownText} />

	  {/* (3) Editable Title */}
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

	  {/* (4) Creation Time Display */}
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

	  {/* (5) Progress Bar */}
	  <ProgressBar progress={progress} />

	  {/* (6) Progress Summary */}
	  <ProgressSummary
		completedTasks={completedTasks}
		totalTasks={totalTasks}
		progress={progress}
	  />

	  {/* (7) To-Do List Section */}
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
