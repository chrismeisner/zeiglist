// src/components/ProgressSummary.js
import React from 'react';

const ProgressSummary = ({ completedTasks, totalTasks, progress }) => {
  return (
	<div className="flex justify-between mb-4 text-gray-600 text-sm">
	  <span id="tasksSummaryLeft">
		{completedTasks} of {totalTasks} Complete
	  </span>
	  <span id="tasksSummaryRight">{Math.round(progress)}%</span>
	</div>
  );
};

export default ProgressSummary;
