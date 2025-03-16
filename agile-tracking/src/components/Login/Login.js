import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";

const Login = () => {
  const { login } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email.trim() || !password.trim()) {
      setError("Email and Password are required.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    return true;
  };

  const handleLogin = () => {
    setError(""); // Clear previous errors

    if (!validateForm()) return;

    fetch(`http://localhost:8080/users?email=${email}&password=${password}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          login(data[0]); // Update user context
          navigate("/"); // Redirect to Dashboard
        } else {
          setError("Invalid email or password.");
        }
      })
      .catch((error) => {
        console.error("Error during login:", error);
        setError("Something went wrong. Please try again.");
      });
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <label >Email: </label>
      <input 
        type="email" 
        placeholder="Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <br />
      <label>Password: </label>
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <br />
      <button onClick={handleLogin}>Login</button>
      <br />
      <Link to="/signup">
        <button>Sign Up</button>
      </Link>
    </div>
  );
};

export default Login;
