import React, { useState, useEffect } from "react";

const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Fetch user details
    fetch(`http://localhost:8080/users/${userId}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((error) => console.error("Error fetching user:", error));

    // Fetch tasks assigned to the user
    fetch(`http://localhost:8080/tasks?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, [userId]);

  if (!user) return <p>Loading user profile...</p>;

  return (
    <div>
      <h2>User Profiles</h2>
      <h3>Tasks Worked By {user.name}</h3>
      <ul>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li key={task.id}>
              <strong>Title:</strong> {task.title} <br />
              <strong>Description:</strong> {task.description} <br />
              <strong>Status:</strong> {task.status}
            </li>
          ))
        ) : (
          <li>No tasks assigned</li>
        )}
      </ul>
    </div>
  );
};

export default UserProfile;
