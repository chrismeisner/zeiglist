// File: src/components/SavedZeiglist.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TodoList from './TodoList/TodoList';

function SavedZeiglist() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadedData, setLoadedData] = useState(null);

  useEffect(() => {
	setLoading(true);
	fetch(`/api/saved-lists/${id}`)
	  .then((res) => {
		if (!res.ok) {
		  throw new Error(`Failed to fetch. Status: ${res.status}`);
		}
		return res.json();
	  })
	  .then((data) => {
		setLoadedData(data);
		setLoading(false);
	  })
	  .catch((err) => {
		console.error('[SavedZeiglist] Error:', err);
		setError(err.message || 'Error loading data');
		setLoading(false);
	  });
  }, [id]);

  if (loading) {
	return <div>Loading Zeiglist...</div>;
  }

  if (error) {
	return <div className="text-red-500">Error: {error}</div>;
  }

  if (!loadedData) {
	return <div>No data found for this Zeiglist.</div>;
  }

  // We pass loadedData to <TodoList>, which includes eventDateTime.
  return <TodoList loadedData={loadedData} />;
}

export default SavedZeiglist;
