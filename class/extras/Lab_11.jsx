import { useState } from "react";

export default function App() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Complete Lab 11", completed: false },
    { id: 2, text: "Review JSX Events and State", completed: false },
  ]);

  const [newTask, setNewTask] = useState("");

  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = (event) => {
    event.preventDefault();
    if (newTask.trim() === "") return;
    setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
    setNewTask("");
  };

  return (
    <div>
      <h1>To-Do List</h1>
      <form onSubmit={addTask}>
        <input 
          type="text" 
          value={newTask} 
          onChange={(i) => setNewTask(i.target.value)} 
          placeholder="New task" 
        />
        <button type="submit">Add Task</button>
      </form>
      <ul>
        {tasks.map(task => (
          <li key={task.id} style={{ textDecoration: task.completed ? "line-through" : "none" }}>
            {task.text}
            <button onClick={() => toggleTaskCompletion(task.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
