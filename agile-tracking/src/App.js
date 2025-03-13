import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import UserProfile from "./components/UserProfile/UserProfile"; // Updated import

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in when the app loads
    const user = localStorage.getItem("user");
    setIsAuthenticated(!!user); // Convert to boolean
  }, []);

  return (
    <Router>
      <Nav isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profiles" element={<UserProfile userId={2} />} /> {/* Updated route */}
      </Routes>
    </Router>
  );
};

const Nav = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user"); // Remove user from storage
    setIsAuthenticated(false); // Update state
    navigate("/login"); // Redirect to login
  };

  return (
    <nav>
      <ul>
        <li><Link to="/">Dashboard</Link></li>
        {isAuthenticated ? (
          <>
            <li><Link to="/profiles">Profiles</Link></li> {/* Updated link */}
            <li><button onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <li><Link to="/login">Login</Link></li>
          
        )}
      </ul>
    </nav>
  );
};

export default App;
