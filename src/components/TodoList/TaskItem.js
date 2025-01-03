// src/components/TodoList/TaskItem.js
import React, { useState } from 'react';
import SubTaskList from './SubTaskList';
import SubTaskInput from './SubTaskInput';
import { v4 as uuidv4 } from 'uuid';

const TaskItem = ({ task, updateTask, deleteTask, isTop }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [textValue, setTextValue] = useState(task.text);
  const [showSubTaskInput, setShowSubTaskInput] = useState(false);

  const toggleCompletion = () => {
	const updatedTask = {
	  ...task,
	  completed: !task.completed,
	  completedTime: !task.completed ? new Date() : null,
	};
	updateTask(updatedTask);
  };

  const handleDelete = () => {
	if (window.confirm('Are you sure you want to delete this task?')) {
	  deleteTask(task.id);
	}
  };

  const handleEdit = () => {
	if (isEditing && textValue.trim() !== '') {
	  updateTask({ ...task, text: textValue.trim() });
	}
	setIsEditing(!isEditing);
  };

  const addSubTask = (subText) => {
	const newSubTask = {
	  id: uuidv4(),
	  text: subText,
	  completed: false,
	  completedTime: null,
	  createdAt: new Date(),
	};
	updateTask({ ...task, subtasks: [...task.subtasks, newSubTask] });
  };

  const updateSubTasks = (updatedSubtasks) => {
	updateTask({ ...task, subtasks: updatedSubtasks });
  };

  return (
	<li
	  data-id={task.id}
	  className={`
		flex flex-col 
		p-2 border rounded-lg hover:bg-gray-100
		task-cell
		${task.completed ? 'line-through text-gray-400' : ''}
		${isTop ? 'bg-yellow-200 text-black' : ''}
	  `}
	>
	  {/* MAIN ROW */}
	  <div className="flex items-center justify-between group">
		{/* LEFT side: handle + checkbox + label */}
		<div className="flex items-center flex-grow">
		  <span className="mr-2 text-gray-500 select-none grab-handle">≡</span>
		  <input
			type="checkbox"
			className="task-checkbox mr-2"
			checked={task.completed}
			onChange={toggleCompletion}
		  />
		  {isEditing && !task.completed ? (
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
			  onClick={() => !task.completed && setIsEditing(true)}
			>
			  {task.text}
			  {task.completedTime && (
				<span className="text-sm text-gray-500">
				  {' '}
				  (completed on{' '}
				  {new Date(task.completedTime).toLocaleString('en-US', {
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

		{/* RIGHT side: +SubTask button (if not completed), then delete */}
		<div className="flex items-center">
		  {!task.completed && (
			<button
			  onClick={() => setShowSubTaskInput(!showSubTaskInput)}
			  className="
				hidden group-hover:inline-block 
				ml-3 px-2 py-0 
				bg-green-500 text-white 
				rounded hover:bg-green-600
				focus:outline-none focus:ring-2 focus:ring-green-400
			  "
			>
			  + Sub Task
			</button>
		  )}
		  <button
			onClick={handleDelete}
			className="
			  hidden group-hover:inline-block 
			  text-red-500 delete-hover ml-3
			"
		  >
			🗑️
		  </button>
		</div>
	  </div>

	  {/* SUBTASK LIST */}
	  <SubTaskList
		subtasks={task.subtasks}
		parentTask={task}
		updateSubTasks={updateSubTasks}
	  />

	  {/* ADD SUBTASK INPUT */}
	  {showSubTaskInput && !task.completed && (
		<div className="flex items-center mt-2">
		  <SubTaskInput
			addSubTask={addSubTask}
			setShowSubTaskInput={setShowSubTaskInput}
		  />
		</div>
	  )}
	</li>
  );
};

export default TaskItem;
