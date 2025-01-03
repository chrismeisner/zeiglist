// src/components/TodoList/TodoList.js
import React, { useState, useEffect } from 'react';
import TaskInput from './TaskInput';
import TaskList from './TaskList';
import ProgressBar from '../ProgressBar';
import ProgressSummary from '../ProgressSummary';
import FileControls from './FileControls';
import { v4 as uuidv4 } from 'uuid'; // For unique IDs

const TodoList = () => {
  const [tasks, setTasks] = useState(() => {
	// Retrieve tasks from localStorage on initial load
	const savedData = localStorage.getItem('todoData');
	return savedData ? JSON.parse(savedData).tasks : [];
  });

  const [createdAt, setCreatedAt] = useState(() => {
	const savedData = localStorage.getItem('todoData');
	return savedData ? new Date(JSON.parse(savedData).createdAt) : new Date();
  });

  // Derived progress info
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

  const addTask = (text) => {
	if (text.trim() === '') return;
	setTasks([
	  ...tasks,
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
	setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const deleteTask = (taskId) => {
	setTasks(tasks.filter((t) => t.id !== taskId));
  };

  const reorderTasks = (newTasks) => {
	setTasks(newTasks);
  };

  // Save to localStorage whenever tasks or createdAt change
  useEffect(() => {
	const data = {
	  tasks,
	  createdAt: createdAt.toISOString(),
	};
	localStorage.setItem('todoData', JSON.stringify(data));
  }, [tasks, createdAt]);

  // Handle uploading a new to-do list
  const handleUpload = (uploadedData) => {
	if (!uploadedData.tasks || !uploadedData.createdAt) {
	  alert('Invalid file format.');
	  return;
	}

	// Validate each task
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

	setTasks(uploadedData.tasks);
	setCreatedAt(new Date(uploadedData.createdAt));
  };

  // Handle saving the current to-do list
  const handleSave = () => {
	const data = {
	  tasks,
	  createdAt: createdAt.toISOString(),
	};
	const blob = new Blob([JSON.stringify(data, null, 2)], {
	  type: 'application/json',
	});
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = `todo-list-${createdAt.toISOString()}.json`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
  };

  return (
	<div>
	  {/* File Controls */}
	  <FileControls onUpload={handleUpload} onSave={handleSave} />

	  {/* Display Creation Time */}
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
