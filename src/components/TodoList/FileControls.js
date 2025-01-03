// src/components/TodoList/FileControls.js
import React, { useRef, useState } from 'react';

const FileControls = ({ onUpload, onSave }) => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleFileChange = (e) => {
	console.log('[FileControls] handleFileChange triggered...');
	const file = e.target.files[0];
	console.log('[FileControls] Chosen file:', file);

	if (!file) {
	  console.log('[FileControls] No file selected, returning...');
	  return;
	}

	setIsUploading(true);

	const reader = new FileReader();
	reader.onload = (event) => {
	  console.log('[FileControls] FileReader onload event');
	  console.log('[FileControls] Raw file contents:', event.target.result);

	  try {
		const json = JSON.parse(event.target.result);
		console.log('[FileControls] Parsed JSON:', json);
		onUpload(json);
		alert('To-Do list uploaded successfully.');
	  } catch (error) {
		console.error('[FileControls] Failed to parse JSON file:', error);
		alert('Failed to parse JSON file.');
	  }

	  setIsUploading(false);
	};

	reader.readAsText(file);

	// Reset the input value to allow uploading the same file again if needed
	e.target.value = '';
  };

  const handleUploadClick = () => {
	console.log('[FileControls] Upload button clicked.');
	fileInputRef.current.click();
  };

  const handleSaveClick = () => {
	console.log('[FileControls] Save button clicked.');
	setIsSaving(true);
	onSave();

	setTimeout(() => {
	  setIsSaving(false);
	  alert('To-Do list saved successfully.');
	}, 500); // Simulate a delay
  };

  return (
	<div className="flex justify-center mb-4 space-x-2">
	  {/* Hidden File Input */}
	  <input
		type="file"
		accept="application/json"
		ref={fileInputRef}
		onChange={handleFileChange}
		style={{ display: 'none' }}
	  />

	  {/* Upload Button */}
	  <button
		onClick={handleUploadClick}
		className="
		  px-4 py-2 
		  bg-purple-500 text-white 
		  font-bold 
		  rounded-lg 
		  hover:bg-purple-600 
		  focus:outline-none 
		  focus:ring-2 focus:ring-purple-400
		"
		disabled={isUploading}
		aria-label="Upload To-Do List"
	  >
		{isUploading ? 'Uploading...' : 'Upload'}
	  </button>

	  {/* Save Button */}
	  <button
		onClick={handleSaveClick}
		className="
		  px-4 py-2 
		  bg-green-500 text-white 
		  font-bold 
		  rounded-lg 
		  hover:bg-green-600 
		  focus:outline-none 
		  focus:ring-2 focus:ring-green-400
		"
		disabled={isSaving}
		aria-label="Save To-Do List"
	  >
		{isSaving ? 'Saving...' : 'Save'}
	  </button>

	  {/*
		The Clear button has been removed entirely.
	  */}
	</div>
  );
};

export default FileControls;
