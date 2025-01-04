// src/components/TodoList/FileControls.js

import React, { useRef, useState } from 'react';

const FileControls = ({ onUpload, onSave, todoData }) => {
  const fileInputRef = useRef(null);

  // States for UI feedback
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingToAirtable, setIsSavingToAirtable] = useState(false);

  // ---------- 1) Handle File Upload ----------
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

	// Reset input value so the same file can be uploaded again if needed
	e.target.value = '';
  };

  const handleUploadClick = () => {
	console.log('[FileControls] Upload button clicked.');
	fileInputRef.current.click();
  };

  // ---------- 2) Handle Save (Local Download) ----------
  const handleSaveClick = () => {
	console.log('[FileControls] Save button clicked.');
	setIsSaving(true);
	onSave();

	setTimeout(() => {
	  setIsSaving(false);
	  alert('To-Do list saved successfully.');
	}, 500); // Simulate short delay
  };

  // ---------- 3) Handle Save to Airtable (with extra debug logs) ----------
  const handleSaveToAirtable = async () => {
	console.log('[FileControls] handleSaveToAirtable triggered. Data:', todoData);
	if (!todoData) {
	  alert('No To-Do data available to save.');
	  return;
	}

	setIsSavingToAirtable(true);

	try {
	  // Because of the proxy in package.json, '/api/save-to-airtable' 
	  // goes to http://localhost:5001/api/save-to-airtable
	  const response = await fetch('/api/save-to-airtable', {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json',
		},
		body: JSON.stringify(todoData),
	  });

	  // 1) Log the raw text response for debugging
	  const rawResponse = await response.text();
	  console.log('[FileControls] RAW RESPONSE:', rawResponse);

	  if (!response.ok) {
		// If not OK, we might be receiving an error or HTML
		throw new Error(`Fetch failed: ${response.status} - ${response.statusText}`);
	  }

	  // 2) Parse the raw text as JSON only after confirming it's not an error
	  const data = JSON.parse(rawResponse);
	  console.log('[FileControls] Airtable save response (JSON):', data);
	  alert(data.message);
	} catch (error) {
	  console.error('[FileControls] Error saving to Airtable:', error);
	  alert(error.message || 'An error occurred while saving to Airtable.');
	} finally {
	  setIsSavingToAirtable(false);
	}
  };

  // ---------- 4) Render ----------
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
		className="px-4 py-2 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
		disabled={isUploading}
		aria-label="Upload To-Do List"
	  >
		{isUploading ? 'Uploading...' : 'Upload'}
	  </button>

	  {/* Save to Local JSON Button */}
	  <button
		onClick={handleSaveClick}
		className="px-4 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
		disabled={isSaving}
		aria-label="Save To-Do List"
	  >
		{isSaving ? 'Saving...' : 'Save'}
	  </button>

	  {/* Save to Airtable Button */}
	  <button
		onClick={handleSaveToAirtable}
		className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
		disabled={isSavingToAirtable}
		aria-label="Save To Airtable"
	  >
		{isSavingToAirtable ? 'Saving to Airtable...' : 'Save to Airtable'}
	  </button>
	</div>
  );
};

export default FileControls;
