import React, { useState, useEffect } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import PublicNotes from "./pages/PublicNotes";
import Home from "./pages/Home"; // New home page

function App() {
  const [route, setRoute] = useState(localStorage.getItem("route") || "home");
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    localStorage.setItem("route", route);
  }, [route]);

  const logout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setRoute("home");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <nav className="bg-gray-900 text-white shadow p-4 flex justify-between items-center">
        <h1
          className="text-xl font-semibold cursor-pointer"
          onClick={() => setRoute("home")}
        >
          Notes App
        </h1>
        <div className="space-x-4">
          <button
            onClick={() => setRoute("dashboard")}
            className="text-sm hover:text-indigo-400"
          >
            My Notes
          </button>
          <button
            onClick={() => setRoute("public")}
            className="text-sm hover:text-indigo-400"
          >
            Public
          </button>

          {loggedIn ? (
            <button
              onClick={logout}
              className="text-sm bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
            >
              Logout
            </button>
          ) : (
            <>
              <button
                onClick={() => setRoute("login")}
                className="text-sm hover:text-indigo-400"
              >
                Login
              </button>
              <button
                onClick={() => setRoute("signup")}
                className="text-sm hover:text-indigo-400"
              >
                Signup
              </button>
            </>
          )}
        </div>
      </nav>

      <div className="flex-1">
        {route === "home" && <Home onNavigate={setRoute} loggedIn={loggedIn} />}
        {route === "login" && (
          <Login onNavigate={setRoute} onLogin={() => setLoggedIn(true)} />
        )}
        {route === "signup" && (
          <Signup onNavigate={setRoute} onSignup={() => setLoggedIn(true)} />
        )}
        {route === "dashboard" && <Dashboard />}
        {route === "public" && <PublicNotes />}
      </div>
    </div>
  );
}

export default App;
