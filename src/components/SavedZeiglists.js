// src/components/SavedZeiglists.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SavedZeiglists = () => {
  const [savedLists, setSavedLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
	fetch('/api/saved-lists')
	  .then((res) => {
		if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
		return res.json();
	  })
	  .then((data) => {
		setSavedLists(data);
		setLoading(false);
	  })
	  .catch((err) => {
		console.error('[SavedZeiglists] Error:', err);
		setError(err.message);
		setLoading(false);
	  });
  }, []);

  if (loading) {
	return <div>Loading saved Zeiglists...</div>;
  }

  if (error) {
	return <div className="text-red-500">Error: {error}</div>;
  }

  return (
	<div>
	  <h2 className="text-xl font-bold mb-4">Saved Zeiglists</h2>
	  {savedLists.map((list) => (
		<div
		  key={list.id}
		  className="p-4 mb-2 bg-white rounded shadow flex justify-between items-center"
		>
		  <div>
			<h3 className="font-bold">{list.title}</h3>
			<p className="text-sm text-gray-500">
			  Created at: {new Date(list.createdAt).toLocaleString()}
			</p>
		  </div>
		  <div>
			<button
			  onClick={() => navigate(`/saved/${list.id}`)}
			  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
			>
			  Open in Zeiglist
			</button>
		  </div>
		</div>
	  ))}
	</div>
  );
};

export default SavedZeiglists;
