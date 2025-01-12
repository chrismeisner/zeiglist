import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TodoList from "./components/TodoList/TodoList";
import SavedZeiglists from "./components/SavedZeiglists";
import SavedZeiglist from "./components/SavedZeiglist";
import LoginScreen from "./components/LoginScreen/LoginScreen";
import { app } from "./firebase"; // Ensures Firebase initializes

function App() {
  // Log the Firebase app instance once
  React.useEffect(() => {
    console.log("[App] Firebase App instance:", app);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-blue-600 text-white p-4">
          <nav className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-xl font-bold hover:underline">
              Zeiglist
            </Link>
            <div className="flex space-x-4">
              <Link to="/" className="hover:underline">
                New Zeiglist
              </Link>
              <Link to="/saved" className="hover:underline">
                Saved Zeiglists
              </Link>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="container mx-auto p-4">
          <Routes>
            {/* Root route: TodoList */}
            <Route path="/" element={<TodoList />} />

            {/* Saved Zeiglists */}
            <Route path="/saved" element={<SavedZeiglists />} />
            <Route path="/saved/:id" element={<SavedZeiglist />} />

            {/* Login Screen */}
            <Route path="/login" element={<LoginScreen />} />

            {/* Fallback Route */}
            <Route
              path="*"
              element={
                <div className="text-center">
                  <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
                  <Link to="/" className="text-blue-500 hover:underline">
                    Go back to the homepage
                  </Link>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
