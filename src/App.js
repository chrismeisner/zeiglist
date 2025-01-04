// File: src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TodoList from './components/TodoList/TodoList';
import SavedZeiglists from './components/SavedZeiglists';

// --- NEW IMPORT ---
import SavedZeiglist from './components/SavedZeiglist'; 
// This component will fetch a saved list and render the <TodoList> with that data.

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Persistent Header */}
        <header className="bg-blue-600 text-white p-4">
          <nav className="container mx-auto flex justify-between">
            <Link to="/" className="text-xl font-bold">
              Zeiglist
            </Link>
            <div>
              <Link to="/" className="mr-4 hover:underline">
                New Zeiglist
              </Link>
              <Link to="/saved" className="hover:underline">
                Saved Zeiglists
              </Link>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="container mx-auto p-4">
          <Routes>
            {/* Root route: Full TodoList functionality */}
            <Route path="/" element={<TodoList />} />

            {/* Saved Zeiglists route */}
            <Route path="/saved" element={<SavedZeiglists />} />

            {/* NEW ROUTE: Fetch a saved Zeiglist by ID and open it */}
            <Route path="/saved/:id" element={<SavedZeiglist />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
