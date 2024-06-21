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
        body: JSON.stringify({ userId, title, description, reminderDate }),
      });
      const data = await response.json();
      if (data.success) {
        const newTask = { _id: data.taskId, title, description, status: 'pending', reminderDate };
        setPendingTasks([...pendingTasks, newTask]);
        setTasks([...tasks, newTask]);
        setTitle('');
        setDescription('');
        setReminderDate('');
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
  };

  const cancelEdit = () => {
    setEditTaskId('');
    setTitle('');
    setDescription('');
    setReminderDate('');
  };

  const submitEditTask = async () => {
    try {
      const response = await fetch(`http://localhost:5000/task/update/${editTaskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, reminderDate }),
      });
      const data = await response.json();
      if (data.success) {
        const updatedPendingTasks = pendingTasks.map((task) =>
          task._id === editTaskId ? { ...task, title, description, reminderDate } : task
        );
        setPendingTasks(updatedPendingTasks);
        setEditTaskId('');
        setTitle('');
        setDescription('');
        setReminderDate('');
        setMessage('Task updated successfully');
        scheduleNotifications(updatedPendingTasks);
      } else {
        setMessage(data.message);
      }
    } catch (e) {
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
                <div className="
                  w-full md:w-1/2 pr-2 mb-4">
                  <label
                    htmlFor="title"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter task title"
                  />
                </div>
                <div className="w-full md:w-1/2 pl-2 mb-4">
                  <label
                    htmlFor="description"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Description
                  </label>
                  <input
                    id="description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter task description"
                  />
                </div>
                <div className="w-full md:w-1/2 pr-2 mb-4">
                  <label
                    htmlFor="reminderDate"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Reminder Date
                  </label>
                  <input
                    id="reminderDate"
                    type="datetime-local"
                    value={reminderDate}
                    onChange={handleReminderChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Select reminder date"
                  />
                </div>
                <div className="w-full">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    {editTaskId ? 'Update Task' : 'Add Task'}
                  </button>
                  {editTaskId && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2 focus:outline-none focus:shadow-outline"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </form>
            {message && <p className="mt-4 text-red-500">{message}</p>}
            <ul>
              {pendingTasks.map((task) => (
                <li
                  key={task._id}
                  className={`mb-4 p-4 bg-white shadow-md rounded-lg flex justify-between items-center ${
                    task.status.includes('done') ? 'line-through text-gray-500' : ''
                  }`}
                >
                  <div>
                    <h2 className="text-xl font-bold">{task.title}</h2>
                    <p className="text-gray-700">{task.description}</p>
                    {task.status === 'deleted' && (
                      <p className="text-red-500 mt-2">This task has been marked as deleted</p>
                    )}
                    {task.status === 'done and deleted' && (
                      <p className="text-red-500 mt-2">
                        This task has been marked as done and deleted
                      </p>
                    )}
                    {task.reminderDate && (
                      <p className="text-blue-500 mt-2">
                        Reminder set for: {new Date(task.reminderDate).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={faEdit}
                      className="text-blue-500 cursor-pointer mr-2"
                      onClick={() => handleEditTask(task._id)}
                    />
                    {task.status === 'pending' && (
                      <button
                        onClick={() => updateTask(task._id)}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2 focus:outline-none focus:shadow-outline"
                      >
                        Mark as Done
                      </button>
                    )}
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {activeTab === 'done' && (
          <div>
            <ul>
              {doneTasks.map((task) => (
                <li
                  key={task._id}
                  className={`mb-4 p-4 bg-white shadow-md rounded-lg flex justify-between items-center ${
                    task.status.includes('done') ? 'line-through text-gray-500' : ''
                  }`}
                >
                  <div>
                    <h2 className="text-xl font-bold">{task.title}</h2>
                    <p className="text-gray-700">{task.description}</p>
                    {task.status === 'deleted' && (
                      <p className="text-red-500 mt-2">This task has been marked as deleted</p>
                    )}
                    {task.status === 'done and deleted' && (
                      <p className="text-red-500 mt-2">
                        This task has been marked as done and deleted
                      </p>
                    )}
                    {task.reminderDate && (
                      <p className="text-blue-500 mt-2">
                        Reminder set for: {new Date(task.reminderDate).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div>
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default TaskPage;
