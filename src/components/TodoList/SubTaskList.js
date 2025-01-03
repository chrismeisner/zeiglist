// src/components/TodoList/SubTaskList.js
import React from 'react';
import { ReactSortable } from 'react-sortablejs';
import SubTaskItem from './SubTaskItem';

const SubTaskList = ({ subtasks, parentTask, updateSubTasks }) => {
  const handleSortEnd = (newOrder) => {
	const updatedSubtasks = newOrder.map((sub) => ({
	  id: sub.id,
	  text: sub.text,
	  completed: sub.completed,
	  completedTime: sub.completedTime,
	  createdAt: sub.createdAt,
	}));
	updateSubTasks(updatedSubtasks);
  };

  return (
	<ReactSortable
	  list={subtasks}
	  setList={handleSortEnd}
	  handle=".sub-grab-handle"
	  animation={150}
	  className="ml-6 mt-2 space-y-1"
	>
	  {subtasks.map((sub) => (
		<SubTaskItem
		  key={sub.id}
		  sub={sub}
		  parentTask={parentTask}
		  updateSubTasks={updateSubTasks}
		/>
	  ))}
	</ReactSortable>
  );
};

export default SubTaskList;
