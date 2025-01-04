// src/components/TodoList/TaskList.js
import React from 'react';
import { ReactSortable } from 'react-sortablejs';
import TaskItem from './TaskItem';

const TaskList = ({
  tasks,
  updateTask,
  deleteTask,
  reorderTasks,
}) => {
  // Order tasks: incomplete first, then complete
  const orderedTasks = [
	...tasks.filter((t) => !t.completed),
	...tasks.filter((t) => t.completed),
  ];

  return (
	<ReactSortable
	  list={orderedTasks}
	  setList={reorderTasks}
	  handle=".grab-handle"
	  animation={150}
	  className="space-y-2"
	>
	  {orderedTasks.map((task, index) => (
		<TaskItem
		  key={task.id}
		  task={task}
		  updateTask={updateTask}
		  deleteTask={deleteTask}
		  // Only the VERY FIRST incomplete task (index=0 in the incomplete list) is "top"
		  isTop={index === 0 && !task.completed}
		/>
	  ))}
	</ReactSortable>
  );
};

export default TaskList;
