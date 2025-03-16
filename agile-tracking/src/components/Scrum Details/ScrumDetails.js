import React, { useState, useEffect, useContext } from "react";
import UserContext from "../../context/UserContext";

const ScrumDetails = () => {
    const { user } = useContext(UserContext); // Get logged-in user
    const isAdmin = user?.role === "admin"; // Check if user is admin

    const [scrums, setScrums] = useState([]);
    const [selectedScrum, setSelectedScrum] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [users, setUsers] = useState([]);
    const [newScrum, setNewScrum] = useState({
        name: "",
        taskTitle: "",
        taskDescription: "",
        taskStatus: "To Do",
        assignedUserId: "",

    });

    useEffect(() => {
        fetch("http://localhost:8080/scrums")
            .then((res) => res.json())
            .then((data) => setScrums(data))
            .catch((error) => console.error("Error fetching scrum teams:", error));

        fetch("http://localhost:8080/users")
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

    const [validationErrors, setValidationErrors] = useState({});

    const handleAddScrum = async (e) => {
        e.preventDefault();

        // Validation logic for all fields
        const errors = {};
        if (!newScrum.name.trim()) errors.name = "Scrum Name is required";
        if (!newScrum.taskTitle.trim()) errors.taskTitle = "Task Title is required";
        if (!newScrum.taskDescription.trim()) errors.taskDescription = "Task Description is required";
        if (!newScrum.taskStatus.trim()) errors.taskStatus = "Task Status is required";
        if (!newScrum.assignedUserId.trim()) errors.assignedUserId = "Assigning a user is required";

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        try {
            const scrumRes = await fetch("http://localhost:8080/scrums", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newScrum.name }),
            });

            const createdScrum = await scrumRes.json();

            const taskRes = await fetch("http://localhost:8080/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: newScrum.taskTitle,
                    description: newScrum.taskDescription,
                    status: newScrum.taskStatus,
                    scrumId: createdScrum.id,
                    assignedTo: newScrum.assignedUserId || null,
                }),
            });

            const createdTask = await taskRes.json();

            setScrums([...scrums, createdScrum]);
            setTasks([...tasks, createdTask]);

            // Reset form and errors
            setNewScrum({
                name: "",
                taskTitle: "",
                taskDescription: "",
                taskStatus: "To Do",
                assignedUserId: "",
            });
            setValidationErrors({});
            setShowForm(false);
        } catch (error) {
            console.error("Error creating scrum/task:", error);
        }
    };



    return (
        <div>
            <h2>Scrum Teams</h2>

            {isAdmin && (
                <>
                    <button onClick={() => setShowForm(!showForm)}>
                        {showForm ? "Cancel" : "Add New Scrum"}
                    </button>

                    {showForm && (
                        <form onSubmit={handleAddScrum}>
                            <label>Scrum Name</label>
                            <input
                                type="text"
                                placeholder="Scrum Name"
                                value={newScrum.name}
                                onChange={(e) => setNewScrum({ ...newScrum, name: e.target.value })}
                            />
                            {validationErrors.name && <span style={{ color: "red", marginLeft: "10px" }}>{validationErrors.name}</span>}
                            <br />

                            <label>Task Title</label>
                            <input
                                type="text"
                                placeholder="Task Title"
                                value={newScrum.taskTitle}
                                onChange={(e) => setNewScrum({ ...newScrum, taskTitle: e.target.value })}
                            />
                            {validationErrors.taskTitle && <span style={{ color: "red", marginLeft: "10px" }}>{validationErrors.taskTitle}</span>}
                            <br />

                            <label>Task Description</label>
                            <input
                                type="text"
                                placeholder="Task Description"
                                value={newScrum.taskDescription}
                                onChange={(e) => setNewScrum({ ...newScrum, taskDescription: e.target.value })}
                            />
                            {validationErrors.taskDescription && <span style={{ color: "red", marginLeft: "10px" }}>{validationErrors.taskDescription}</span>}
                            <br />

                            <label>Task Status</label>
                            <select
                                value={newScrum.taskStatus}
                                onChange={(e) => setNewScrum({ ...newScrum, taskStatus: e.target.value })}
                            >
                                <option value="">Select Status</option>
                                <option value="To Do">To Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                            </select>
                            {validationErrors.taskStatus && <span style={{ color: "red", marginLeft: "10px" }}>{validationErrors.taskStatus}</span>}
                            <br />

                            <label>Assign To</label>
                            <select
                                value={newScrum.assignedUserId}
                                onChange={(e) => setNewScrum({ ...newScrum, assignedUserId: e.target.value })}
                            >
                                <option value="">Assign To</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                            {validationErrors.assignedUserId && <span style={{ color: "red", marginLeft: "10px" }}>{validationErrors.assignedUserId}</span>}
                            <br />

                            <button type="submit">Create Scrum</button>
                        </form>
                    )}



                </>
            )}

            <ul>
                {scrums.map((scrum) => (
                    <li key={scrum.id}>
                        {scrum.name}
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
                                    <strong>{task.title}:</strong> {task.description} -  {" "}
                                    {isAdmin ? (
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
                                    ) : (
                                        <i>{task.status}</i>
                                    )}
                                </li>
                            ))
                        ) : (
                            <li>No tasks found</li>
                        )}
                    </ul>
                    <h3>Users</h3>
                    <ul>
                        {users
                            .filter(user => tasks.some(task => task.assignedTo === user.id))
                            .map(user => (
                                <li key={user.id}>
                                    <p>{user.name} ({user.email})</p>
                                </li>
                            ))}
                    </ul>


                </div>
            )}
        </div>
    );
};

export default ScrumDetails;
