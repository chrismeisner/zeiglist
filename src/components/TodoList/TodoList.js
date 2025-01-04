// src/components/TodoList/TodoList.js
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

function TodoList({ loadedData }) {
  /********************************
   * A) Helper: toLocalDateTimeInputValue
   ********************************/
  function toLocalDateTimeInputValue(date) {
	// Convert a Date to "YYYY-MM-DDTHH:MM" in *local time*.
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  /********************************
   * B) Helper: getDefaultEventDateTime
   ********************************/
  function getDefaultEventDateTime() {
	const now = new Date();

	// Create a new Date for 4:20 PM local time *today*:
	const fourTwenty = new Date(
	  now.getFullYear(),
	  now.getMonth(),
	  now.getDate(),
	  16, // 16 for 4 PM
	  20  // 20 for minutes
	);

	// If we are already past 4:20 PM, use tomorrow
	if (now > fourTwenty) {
	  fourTwenty.setDate(fourTwenty.getDate() + 1);
	}

	// Return a local date-time string instead of UTC
	return toLocalDateTimeInputValue(fourTwenty);
  }

  /********************************
   * 1) State for tasks, title, createdAt, countdown
   ********************************/
  const [title, setTitle] = useState(
	loadedData ? loadedData.title : 'My Master List'
  );
  const [tasks, setTasks] = useState(loadedData ? loadedData.tasks : []);
  const [createdAt, setCreatedAt] = useState(
	loadedData?.createdAt ? new Date(loadedData.createdAt) : new Date()
  );

  // If no loadedData.eventDateTime, default to local 4:20 (today or tomorrow).
  const [eventDateTime, setEventDateTime] = useState(
	loadedData?.eventDateTime || getDefaultEventDateTime()
  );

  const [countdownText, setCountdownText] = useState('');

  /********************************
   * 2) If loadedData changes, re-apply
   ********************************/
  useEffect(() => {
	if (loadedData) {
	  setTitle(loadedData.title || 'My Master List');
	  setTasks(loadedData.tasks || []);
	  setCreatedAt(
		loadedData.createdAt ? new Date(loadedData.createdAt) : new Date()
	  );

	  // If loadedData has a specific eventDateTime (string), use it.
	  // Otherwise, revert to the 4:20pm default.
	  if (loadedData.eventDateTime) {
		setEventDateTime(loadedData.eventDateTime);
	  } else {
		setEventDateTime(getDefaultEventDateTime());
	  }
	}
  }, [loadedData]);

  /********************************
   * 3) Countdown effect
   ********************************/
  useEffect(() => {
	const timer = setInterval(() => {
	  if (!eventDateTime) {
		setCountdownText('Set a time completion time');
		return;
	  }

	  // eventDateTime is a local "YYYY-MM-DDTHH:MM" string.
	  // Convert it back to a real Date object in local time:
	  const target = new Date(eventDateTime.replace('T', ' ').replace(/-/g, '/'));

	  const now = new Date();
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
   * 4) Derived progress info
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
   * 5) Task CRUD
   ********************************/
  const addTask = (text) => {
	if (text.trim() === '') return;
	setTasks((prev) => [
	  {
		id: uuidv4(),
		text: text.trim(),
		completed: false,
		completedTime: null,
		subtasks: [],
		createdAt: new Date(),
	  },
	  ...prev,
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
   * 6) File Upload & Download
   ********************************/
  const handleUpload = (uploadedData) => {
	if (!uploadedData.tasks) {
	  alert('Invalid file format: "tasks" array is missing.');
	  return;
	}
	setTitle(uploadedData.title || 'My Master List');
	setTasks(uploadedData.tasks);
	setCreatedAt(
	  uploadedData.createdAt ? new Date(uploadedData.createdAt) : new Date()
	);

	// If JSON has an eventDateTime, use it; else use local 4:20.
	if (uploadedData.eventDateTime) {
	  setEventDateTime(uploadedData.eventDateTime);
	} else {
	  setEventDateTime(getDefaultEventDateTime());
	}
  };

  const handleSave = () => {
	const data = {
	  title,
	  tasks,
	  createdAt: createdAt.toISOString(),
	  // We keep eventDateTime as the local "YYYY-MM-DDTHH:MM" string:
	  eventDateTime,
	};
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
   * 7) Title editing
   ********************************/
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const handleTitleClick = () => setIsEditingTitle(true);
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleTitleBlur = () => setIsEditingTitle(false);
  const handleTitleKeyDown = (e) => {
	if (e.key === 'Enter') setIsEditingTitle(false);
  };

  /********************************
   * 8) Render
   ********************************/
  const todoData = {
	title,
	tasks,
	createdAt,
	eventDateTime, // local format
  };

  return (
	<div>
	  {/* FileControls */}
	  <FileControls onUpload={handleUpload} onSave={handleSave} todoData={todoData} />

	  {/* Current Time, date-time picker, countdown */}
	  <CurrentTimeDisplay />
	  <DateTimePicker
		eventDateTime={eventDateTime}
		setEventDateTime={setEventDateTime}
		onUpdate={handleUpdateEventDateTime}
	  />
	  <Countdown countdownText={countdownText} />

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
		  <h1 className="text-lg font-bold cursor-pointer" onClick={handleTitleClick}>
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

	  {/* Progress Bar & Summary */}
	  <ProgressBar progress={progress} />
	  <ProgressSummary
		completedTasks={completedTasks}
		totalTasks={totalTasks}
		progress={progress}
	  />

	  {/* Task Input */}
	  <TaskInput addTask={addTask} />

	  {/* Task List */}
	  <TaskList
		tasks={tasks}
		updateTask={updateTask}
		deleteTask={deleteTask}
		reorderTasks={reorderTasks}
	  />
	</div>
  );
}

export default TodoList;
