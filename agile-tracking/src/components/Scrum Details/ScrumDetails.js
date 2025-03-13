import React, { useState, useEffect } from "react";

const ScrumDetails = () => {
  const [scrums, setScrums] = useState([]);
  const [selectedScrum, setSelectedScrum] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/scrums")
      .then((res) => res.json())
      .then((data) => setScrums(data))
      .catch((error) => console.error("Error fetching scrum teams:", error));
  }, []);

  const handleGetDetails = (scrum) => {
    setSelectedScrum(scrum); // Store entire scrum object

    // Fetch Tasks for selected Scrum team
    fetch(`http://localhost:8080/tasks?scrumId=${scrum.id}`)
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Error fetching tasks:", error));

    // Fetch Users for selected Scrum team (Fixed API Call)
    fetch(`http://localhost:8080/users?scrumId=${scrum.id}`)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  };

  const handleStatusChange = (taskId, newStatus) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );

    // API call to update task status in backend
    fetch(`http://localhost:8080/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
      .then(res => res.json())
      .then(updatedTask => console.log("Task updated:", updatedTask))
      .catch(error => console.error("Error updating task:", error));
  };

  return (
    <div>
      <h2>Scrum Teams</h2>
      <ul>
        {scrums.map((scrum) => (
          <li key={scrum.id}>
            {scrum.name}{" "}
            <button onClick={() => handleGetDetails(scrum)}>Get Details</button>
          </li>
        ))}
      </ul>

      {/* Show Scrum details when selected */}
      {selectedScrum && (
        <div>
          <h2>Scrum Details for {selectedScrum.name}</h2>

          {/* Tasks Section */}
          <h3>Tasks</h3>
          <ul>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <li key={task.id}>
                  <strong>{task.title}:</strong> {task.description} -{" "}
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </li>
              ))
            ) : (
              <li>No tasks found</li>
            )}
          </ul>

          {/* Users Section */}
          <h3>Users</h3>
          <ul>
            {users.length > 0 ? (
              users
                .filter(user => user.role === "employee") // Only show employees
                .map(user => (
                  <li key={user.id}>
                    <strong>{user.name}:</strong> {user.email}
                  </li>
                ))
            ) : (
              <li>No employees found in this Scrum team</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ScrumDetails;
