import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

const Header = ({ logout }) => (
  <header className="bg-white text-black py-4 px-6 shadow-md">
    <div className="container mx-auto flex justify-between items-center">
      <h1 className="text-3xl font-bold">Tasks</h1>
      <button
        onClick={logout}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>
  </header>
);

const Footer = () => (
  <footer className="bg-gray-200 py-4 px-6 mt-10">
    <div className="container mx-auto text-center">
      <p className="text-gray-700">© 2023 Task Manager. All rights reserved.</p>
    </div>
  </footer>
);

const TaskPage = ({ userId, logout }) => {
  const [tasks, setTasks] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [priority, setPriority] = useState('low'); // State for task priority
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [editTaskId, setEditTaskId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`http://localhost:5000/task/all?userId=${userId}`);
        const data = await response.json();
        if (data.success) {
          const allTasks = data.getData;
          const filteredPendingTasks = allTasks.filter((task) => task.status === 'pending');
          const filteredDoneTasks = allTasks.filter((task) => task.status === 'done');
          setTasks(allTasks);
          setPendingTasks(filteredPendingTasks);
          setDoneTasks(filteredDoneTasks);
          scheduleNotifications(filteredPendingTasks);
        } else {
          setMessage(data.message);
        }
      } catch (e) {
        setMessage('Failed to fetch tasks');
      }
    };

    if (userId) {
      fetchTasks();
    } else {
      navigate('/login');
    }
  }, [userId, navigate]);

  const addTask = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/task/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, title, description, reminderDate, priority }), // Include priority in the request body
      });
      const data = await response.json();
      if (data.success) {
        const newTask = { _id: data.taskId, title, description, status: 'pending', reminderDate, priority }; // Include priority in the new task object
        setPendingTasks([...pendingTasks, newTask]);
        setTasks([...tasks, newTask]);
        setTitle('');
        setDescription('');
        setReminderDate('');
        setPriority('low'); // Reset priority state after task addition
        setMessage('Task added successfully');
        scheduleNotifications([...pendingTasks, newTask]);
      } else {
        setMessage(data.message);
      }
    } catch (e) {
      setMessage('Failed to add task');
    }
  };

  const updateTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:5000/task/update/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'done' }),
      });
      const data = await response.json();
      if (data.success) {
        const updatedPendingTasks = pendingTasks.filter((task) => task._id !== taskId);
        const updatedTask = pendingTasks.find((task) => task._id === taskId);
        updatedTask.status = 'done';
        const updatedDoneTasks = [...doneTasks, updatedTask];
        setPendingTasks(updatedPendingTasks);
        setDoneTasks(updatedDoneTasks);
        scheduleNotifications(updatedPendingTasks);
      } else {
        setMessage(data.message);
      }
    } catch (e) {
      setMessage('Failed to update task');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:5000/task/update/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'done and deleted' }),
      });
      const data = await response.json();
      if (data.success) {
        const updatedPendingTasks = pendingTasks.filter((task) => task._id !== taskId);
        const updatedDoneTasks = doneTasks.filter((task) => task._id !== taskId);
        setPendingTasks(updatedPendingTasks);
        setDoneTasks(updatedDoneTasks);
        scheduleNotifications(updatedPendingTasks);
      } else {
        setMessage(data.message);
      }
    } catch (e) {
      setMessage('Failed to delete task');
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleReminderChange = (e) => {
    setReminderDate(e.target.value);
  };

  const handleEditTask = (taskId) => {
    const taskToEdit = pendingTasks.find((task) => task._id === taskId);
    setEditTaskId(taskId);
    setTitle(taskToEdit.title);
    setDescription(taskToEdit.description);
    setReminderDate(taskToEdit.reminderDate || '');
    setPriority(taskToEdit.priority || 'low'); // Set priority state for editing task
  };

  const cancelEdit = () => {
    setEditTaskId('');
    setTitle('');
    setDescription('');
    setReminderDate('');
    setPriority('low'); // Reset priority state on cancel
  };

  const submitEditTask = async () => {
    try {
      const response = await fetch(`http://localhost:5000/task/update/${editTaskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, title, description, reminderDate, priority }), // Include priority in update request
      });
      const data = await response.json();
      if (data.success) {
        const updatedPendingTasks = pendingTasks.map((task) =>
          task._id === editTaskId ? { ...task, title, description, reminderDate, priority } : task
        );
        setPendingTasks(updatedPendingTasks);
        setEditTaskId('');
        setTitle('');
        setDescription('');
        setReminderDate('');
        setPriority('low'); // Reset priority state after task update
        setMessage('Task updated successfully');
        scheduleNotifications(updatedPendingTasks);
      } else {
        setMessage(data.message);
      }
    } catch (e) {
      console.error('Failed to update task', e);
      setMessage('Failed to update task');
    }
  };

  const scheduleNotifications = (tasksToNotify) => {
    tasksToNotify.forEach((task) => {
      if (task.reminderDate) {
        const reminderTime = new Date(task.reminderDate).getTime();
        const now = new Date().getTime();
        if (reminderTime > now) {
          const timeUntilReminder = reminderTime - now;
          setTimeout(() => {
            showNotification(task);
          }, timeUntilReminder);
        }
      }
    });
  };

  const showNotification = (task) => {
    if (Notification.permission === 'granted') {
      new Notification(`Reminder: ${task.title}`, {
        body: task.description,
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification(`Reminder: ${task.title}`, {
            body: task.description,
          });
        }
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header logout={logout} />

      <main className="flex-grow container mx-auto mt-10 px-4">
        <div className="mb-6">
          <button
            onClick={() => handleTabChange('pending')}
            className={`mr-2 py-2 px-4 rounded focus:outline-none ${
              activeTab === 'pending'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Pending Tasks
          </button>
          <button
            onClick={() => handleTabChange('done')}
            className={`py-2 px-4 rounded focus:outline-none ${
              activeTab === 'done'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Done Tasks
          </button>
        </div>
        {activeTab === 'pending' && (
          <div>
            <form onSubmit={editTaskId ? submitEditTask : addTask} className="mb-8">
              <div className="flex flex-wrap mb-4">
                <div className="w-full md:w-1/2 pr-2 mb-4">
                  <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter task title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="w-full md:w-1/2 pr-2 mb-4">
                  <label
                    htmlFor="priority"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Priority
                  </label>
                  <select
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap mb-4">
                <div className="w-full pr-2 mb-4">
                  <label
                    htmlFor="description"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter task description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-wrap mb-4">
                <div className="w-full md:w-1/2 pr-2 mb-4">
                  <label
                    htmlFor="reminderDate"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Reminder Date
                  </label>
                  <input
                    type="datetime-local"
                    id="reminderDate"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={reminderDate}
                    onChange={handleReminderChange}
                  />
                </div>
              </div>
              <div className="flex items-center justify-end">
                {editTaskId ? (
                  <div className="flex items-center">
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                    >
                      Update Task
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Add Task
                  </button>
                )}
              </div>
            </form>
            <div>
              {pendingTasks.map((task) => (
                <div key={task._id} className="border-b border-gray-200 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold">{task.title}</h2>
                      <p className="text-gray-700">{task.description}</p>
                      <p className="text-blue-500 mt-2">Priority: {task.priority}</p>
                      <p className="text-gray-600">
                        {task.reminderDate ? `Reminder: ${task.reminderDate}` : 'No reminder set'}
                      </p>
                    </div>
                    <div>
                      <button
                        onClick={() => handleEditTask(task._id)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => updateTask(task._id)}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                      >
                        Mark Done
                      </button>
                      <button
                        onClick={() => deleteTask(task._id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'done' && (
          <div>
            {doneTasks.map((task) => (
              <div key={task._id} className="border-b border-gray-200 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">{task.title}</h2>
                    <p className="text-gray-700">{task.description}</p>
                    <p className="text-blue-500 mt-2">Priority: {task.priority}</p>
                    <p className="text-gray-600">
                      {task.reminderDate ? `Reminder: ${task.reminderDate}` : 'No reminder set'}
                    </p>
                  </div>
                  <div>
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default TaskPage;
