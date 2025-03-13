import React, { useState, useEffect } from "react";

const ScrumDetails = () => {
  const [scrums, setScrums] = useState([]);
  const [selectedScrum, setSelectedScrum] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [newScrum, setNewScrum] = useState({
    name: "",
    taskTitle: "",
    taskDescription: "",
    taskStatus: "To Do",
    assignedUser: "",
  });

  useEffect(() => {
    fetch("http://localhost:8080/scrums")
      .then((res) => res.json())
      .then((data) => setScrums(data))
      .catch((error) => console.error("Error fetching scrum teams:", error));

    fetch("http://localhost:8080/users") // Fetch users globally
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleGetDetails = (scrum) => {
    setSelectedScrum(scrum);

    fetch(`http://localhost:8080/tasks?scrumId=${scrum.id}`)
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Error fetching tasks:", error));
  };

  const handleAddScrum = async (e) => {
    e.preventDefault();
    if (!newScrum.name.trim() || !newScrum.taskTitle.trim()) return;

    try {
      // Step 1: Create Scrum Team
      const scrumRes = await fetch("http://localhost:8080/scrums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newScrum.name }),
      });

      const createdScrum = await scrumRes.json();

      // Step 2: Create Task for Scrum
      const taskRes = await fetch("http://localhost:8080/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newScrum.taskTitle,
          description: newScrum.taskDescription,
          status: newScrum.taskStatus,
          scrumId: createdScrum.id,
          assignedUserId: newScrum.assignedUser || null, // Optional
        }),
      });

      const createdTask = await taskRes.json();

      // Step 3: Update UI
      setScrums([...scrums, createdScrum]);
      setTasks([...tasks, createdTask]);
      setNewScrum({
        name: "",
        taskTitle: "",
        taskDescription: "",
        taskStatus: "To Do",
        assignedUser: "",
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error creating scrum/task:", error);
    }
  };

  return (
    <div>
      <h2>Scrum Teams</h2>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "Add New Scrum"}
      </button>

      {showForm && (
        <form onSubmit={handleAddScrum}>
            <label >Scrum Name</label>
          <input
            type="text"
            placeholder="Scrum Name"
            value={newScrum.name}
            onChange={(e) => setNewScrum({ ...newScrum, name: e.target.value })}
            required
          />
<br />
<label >Task Title</label>
          <input
            type="text"
            placeholder="Task Title"
            value={newScrum.taskTitle}
            onChange={(e) => setNewScrum({ ...newScrum, taskTitle: e.target.value })}
            required
          />
<br />
 <label >Task Description</label>
          <input
            type="text"
            placeholder="Task Description"
            value={newScrum.taskDescription}
            onChange={(e) => setNewScrum({ ...newScrum, taskDescription: e.target.value })}
          />
          <br />
 <label >Task Status</label>
          <select
            value={newScrum.taskStatus}
            onChange={(e) => setNewScrum({ ...newScrum, taskStatus: e.target.value })}
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          <br />
<label >Assign To</label>
          <select
            value={newScrum.assignedUser}
            onChange={(e) => setNewScrum({ ...newScrum, assignedUser: e.target.value })}
          >
            <option value="">Assign To</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          <br />
          <button type="submit">Create Scrum</button>
        </form>
      )}

      <ul>
        {scrums.map((scrum) => (
          <li key={scrum.id}>
            {scrum.name}{" "}
            <button onClick={() => handleGetDetails(scrum)}>Get Details</button>
          </li>
        ))}
      </ul>

      {selectedScrum && (
        <div>
          <h2>Scrum Details for {selectedScrum.name}</h2>

          <h3>Tasks</h3>
          <ul>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <li key={task.id}>
                  <strong>{task.title}:</strong> {task.description} -{" "}
                  <select
                    value={task.status}
                    onChange={(e) =>
                      setTasks((prevTasks) =>
                        prevTasks.map((t) =>
                          t.id === task.id ? { ...t, status: e.target.value } : t
                        )
                      )
                    }
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
          {/* user section */}
            <h3>Users</h3>
            <ul>
                {users.length > 0 ? (
                    users.map((user) => (
                    <li key={user.id}>
                        <strong>{user.name}</strong>
                    </li>
                    ))
                ) : (
                    <li>No users found</li>
                )}
            </ul>
        </div>
      )}
    </div>
  );
};

export default ScrumDetails;
