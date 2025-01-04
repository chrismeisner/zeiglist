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

const TodoList = ({ loadedData }) => {
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
  const [eventDateTime, setEventDateTime] = useState(
	loadedData?.eventDateTime || ''
  );
  const [countdownText, setCountdownText] = useState('');

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

  /********************************
   * 2) Countdown effect
   ********************************/
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
   * 3) Derived progress info
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
   * 4) Task CRUD
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

  /**
   * 5) Reorder tasks => the first incomplete task is "top".
   */
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
	if (uploadedData.eventDateTime) {
	  setEventDateTime(uploadedData.eventDateTime);
	}
  };

  const handleSave = () => {
	const data = {
	  title,
	  tasks,
	  createdAt: createdAt.toISOString(),
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
	eventDateTime,
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

	  {/* Task Input (prepend new tasks) */}
	  <TaskInput addTask={addTask} />

	  {/* Task List (we pass reorder) */}
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
