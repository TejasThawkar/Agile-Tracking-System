import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";

const Signup = () => {
  const { login } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    let errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format";
      isValid = false;
    }

    if (!formData.password.trim()) {
      errors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleSignup = () => {
    if (!validateForm()) return;

    const newUser = { ...formData, role: "Employee" };

    fetch("http://localhost:8080/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Signup successful!");
        login(data); // Update user context
        navigate("/");
      })
      .catch((error) => console.error("Error signing up:", error));
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <label >Name: </label>
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}

      <label >Email: </label>
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}

      

      <label>Password: </label>
      <input
        type="password"
        placeholder="Password (min 6 characters)"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}

      <br />
      <button onClick={handleSignup}>Signup</button>
    </div>
  );
};

export default Signup;
