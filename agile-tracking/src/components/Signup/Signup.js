import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = () => {
    const newUser = { name,email, password, role: "employee" }; 

    fetch("http://localhost:8080/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Signup successful! Redirecting to login.");
        navigate("/login"); 
      })
      .catch((error) => console.error("Error signing up:", error));
  };

  return (
    <div>
      <h2>Sign Up</h2>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <br />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <br />
      <button onClick={handleSignup}>Signup</button>
    </div>
  );
};

export default Signup;
