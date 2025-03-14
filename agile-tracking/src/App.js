import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import UserProfile from "./components/UserProfile/UserProfile";
import UserContext from "./context/UserContext";

const App = () => {
  const { user } = useContext(UserContext); // Get user from context

  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profiles" element={user ? <UserProfile userId={user.id} /> : <Login />} />
      </Routes>
    </Router>
  );
};

const Nav = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Use logout function from UserContext
    navigate("/login"); // Redirect to login
  };

  return (
    <nav>
      <ul>
        <li><Link to="/">Dashboard</Link></li>
        {user ? (
          <>
            <li><Link to="/profiles">Profile</Link></li>
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
