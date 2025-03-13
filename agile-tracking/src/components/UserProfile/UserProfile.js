import React, { useState, useEffect } from "react";

const UserProfiles = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Employee",
  });
  const [tasks, setTasks] = useState({});
  const [loadingTasks, setLoadingTasks] = useState(null);

  useEffect(() => {
    // Fetch all users
    fetch("http://localhost:8080/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateUser = () => {
    fetch("http://localhost:8080/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((newUser) => {
        setUsers([...users, newUser]);
        setShowForm(false);
        setFormData({ name: "", email: "", password: "", role: "Employee" });
      })
      .catch((error) => console.error("Error creating user:", error));
  };

  const handleGetHistory = (userId) => {
    setLoadingTasks(userId);
    fetch(`http://localhost:8080/tasks?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setTasks({ ...tasks, [userId]: data });
        setLoadingTasks(null);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
        setLoadingTasks(null);
      });
  };

  return (
    <div>
      <h2>User Profiles</h2>
      {!showForm && <button onClick={() => setShowForm(true)}>Add New User</button>}

      {showForm && (
        <div>
          <button onClick={() => setShowForm(false)}>Cancel</button>
          <br />
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
          <br />
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
          <br />
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleInputChange} />
          <br />
          <label>Role:</label>
          <select name="role" value={formData.role} onChange={handleInputChange}>
            <option value="Employee">Employee</option>
            <option value="Manager">Manager</option>
            <option value="Admin">Admin</option>
          </select>
          <br />
          <button onClick={handleCreateUser}>Create User</button>
        </div>
      )}

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <strong>Name:</strong> {user.name} <br />
            <strong>Email:</strong> {user.email} <br />
            <strong>Role:</strong> {user.role} <br />
            <button onClick={() => handleGetHistory(user.id)}>
              {loadingTasks === user.id ? "Loading..." : "Get History"}
            </button>

            {/* Show tasks if available */}
           
           
            {tasks[user.id] && (
                
              <ul>
                 <h3>Tasks Worked By {user.name}</h3>
                {tasks[user.id].length > 0 ? (
                  tasks[user.id].map((task) => (
                    <li key={task.id}>
                      <strong>Title:</strong> {task.title} <br />
                      <strong>Description:</strong> {task.description} <br />
                      <strong>Status:</strong> {task.status} <br />
                    </li>
                  ))
                ) : (
                  <li>No tasks assigned</li>
                )}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserProfiles;
