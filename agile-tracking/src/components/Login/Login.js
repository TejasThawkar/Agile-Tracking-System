import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    fetch(`http://localhost:8080/users?email=${email}&password=${password}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          localStorage.setItem("user", JSON.stringify(data[0])); // Store user in localStorage
          setIsAuthenticated(true); // Update state immediately
          navigate("/"); // Redirect to Dashboard
        } else {
          setError("Invalid email or password.");
        }
      })
      .catch((error) => console.error("Error during login:", error));
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <br />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
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
