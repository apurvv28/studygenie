import React, { useState, useEffect } from 'react';
import "../styles/dashboard.css";
import "../styles/progress.css";
import '@fortawesome/fontawesome-free/css/all.css';
import logo from './logo.png'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import Goals from './Goals';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Progress = () => {
    const navigate = useNavigate();
    const [currentSemester, setCurrentSemester] = useState(0);
    const [progressData, setProgressData] = useState([]);
    const [showGraph, setShowGraph] = useState(false);
    const [graphData, setGraphData] = useState(null);
    const [result, setResult] = useState(null);
    const [showStudentRehab, setShowStudentRehab] = useState(false);
    const [showPerformance, setShowPerformance] = useState(false);
    const [showGoal, setShowGoal] = useState(false);
    const [showTodo, setShowTodo] = useState(false);
    const [todoLists, setTodoLists] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [completedTodos, setCompletedTodos] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newNotifications, setNewNotifications] = useState([]);
    const [readNotifications, setReadNotifications] = useState([]);
    const [showProfileCard, setShowProfileCard] = useState(false);
    const [userData, setUserData] = useState(null);
    // List of predefined notifications
    const notificationMessages = [
        "Nova AI is waiting for you to start a new chapter",
        "Have you taken your stress level test yet?",
        "Have you taken your study style prediction test yet?",
        "Hello Student, it's time for study...",
        "Wanna impress your crush with good marks?",
        "Reminder: Don't forget to complete your GenieGuide today!",
        "Nova AI has new insights waiting for you.",
        "Keep up the good work, you're doing great!",
        "Time for a break? You've earned it!",
        "Your progress report is ready to be reviewed."
    ];

    const handleNavigation = (path) => {
        navigate(path);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const randomNotification = notificationMessages[Math.floor(Math.random() * notificationMessages.length)];

            // Trigger a toast notification for the new message


            // Update the state for notifications
            setNotifications((prevNotifications) => [
                ...prevNotifications,
                randomNotification,
            ]);

            setNewNotifications((prevNewNotifications) => [
                ...prevNewNotifications,
                randomNotification,
            ]);
        }, 300000);
        // 5 minutes
        const fetchUserData = async () => {
            const email = localStorage.getItem('userEmail');
            if (!email) {
                toast.error('No logged-in user found');
                return;
            }

            try {
                const response = await fetch(`http://localhost:5000/user/${email}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const userData = await response.json();
                const currentSem = parseInt(userData.semester, 10);
                setCurrentSemester(currentSem);

                const progressResponse = await fetch(`http://localhost:5000/userprogress/${email}`);
                if (!progressResponse.ok) {
                    throw new Error('Failed to fetch progress data');
                }
                const progressData = await progressResponse.json();
                if (progressData.length > 0) {
                    setGraphData(progressData);
                    setShowGraph(true);
                } else {
                    setProgressData(Array(currentSem - 1).fill(''));
                }
                const todoResponse = await fetch(`http://localhost:5000/todos/${email}`);
                if (!todoResponse.ok) {
                    throw new Error('Failed to fetch to-do lists');
                }
                const todoData = await todoResponse.json();
                setTodoLists(todoData);


            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Error fetching data');
            }
        };

        fetchUserData();
        return () => clearInterval(interval);
    }, []);

    const handleShowStudentRehab = async () => {
      const email = localStorage.getItem('userEmail');
      if (!email) {
        toast.error('No logged-in user found');
        return;
      }
    
      try {
        const response = await axios.get(`http://localhost:5000/Stresstest/${email}`);
        if (response.status === 200) {
          // Destructuring only the required fields from response.data
          const { email, overallStress, sleepStress, studyStress, screenStress, faceStress } = response.data;
    
          // Creating an object with the filtered fields
          const filteredData = { email, overallStress, sleepStress, studyStress, screenStress, faceStress };
    
          setResult(filteredData);
          setShowStudentRehab(true);
          toast.success('Stress data fetched successfully');
        } else {
          toast.error('No stress data found');
        }
      } catch (error) {
        console.error('Error fetching stress result:', error);
        toast.error('Failed to fetch stress data');
      }
    };


    const handleCloseStudentRehab = () => {
        setShowStudentRehab(false);
    };

    const handleInputChange = (index, value) => {
        const newProgressData = [...progressData];
        newProgressData[index] = value;
        setProgressData(newProgressData);
    };

    const handleSaveProgress = async () => {
        const email = localStorage.getItem('userEmail');
        if (!email) {
            toast.error('No logged-in user found');
            return;
        }

        const progressEntries = progressData.map((percentage, index) => ({
            semester: index + 1,
            percentage,
        }));

        try {
            const response = await fetch('http://localhost:5000/userprogress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, progress: progressEntries }),
            });

            if (!response.ok) {
                throw new Error('Failed to save progress data');
            }

            toast.success('Progress data saved successfully');
            setGraphData(progressEntries);
            setShowGraph(true);
        } catch (error) {
            console.error('Error saving progress data:', error);
            toast.error('Error saving progress data');
        }
    };

    const handleGenerateNew = () => {
        setShowGraph(false);
        setProgressData(Array(currentSemester - 1).fill(''));
    };

    const handleShowPerformance = () => {
        setShowPerformance(true);
    };

    const handleClosePerformance = () => {
        setShowPerformance(false);
    };
    const handleShowTodo = () => {
        setShowTodo(true);
    };

    const handleCloseTodo = () => {
        setShowTodo(false);
    };

    const handleAddTodo = async () => {
        if (newTodo.trim() !== "") {
          const email = localStorage.getItem("userEmail");
          if (!email) {
            toast.error("No logged-in user found");
            return;
          }
    
          try {
            const response = await fetch("http://localhost:5000/todos", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, todo: newTodo }),
            });
    
            if (!response.ok) {
              throw new Error("Failed to add to-do list");
            }
            const todoData = await response.json();
            const newTodoItem = {
              _id: todoData._id || Date.now().toString(),
              todo: newTodo,
              completed: false,
              email
            };
            setTodoLists([...todoLists, newTodoItem]);
            setNewTodo("");
            toast.success("Task added successfully");
          } catch (error) {
            console.error("Error adding task:", error);
            toast.error("Error adding task");
          }
        }
      };
      const handleToggleTodo = async (todoId) => {
        try {
          const updatedTodos = todoLists.map((todo) =>
            todo._id === todoId ? { ...todo, completed: !todo.completed } : todo
          );
          setTodoLists(updatedTodos);
    
          const todoToUpdate = updatedTodos.find((todo) => todo._id === todoId);
          await fetch(`http://localhost:5000/todos/${todoId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ completed: todoToUpdate.completed }),
          });
        } catch (error) {
          console.error("Error updating task status:", error);
          toast.error("Error updating task status");
        }
      };
    
      const handleDeleteTodo = async (todoId) => {
        const email = localStorage.getItem("userEmail");
        if (!email) {
          toast.error("No logged-in user found");
          return;
        }
      
        try {
          console.log("Attempting to delete task with ID:", todoId);
      
          // First update the UI optimistically
          setTodoLists(todoLists.filter((todo) => todo._id !== todoId));
      
          const response = await fetch(`http://localhost:5000/todos/${todoId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email,todo: todoId  }), // Add email to request body
          });
      
          if (!response.ok) {
            const data = await response.json();
            console.error("Backend error response:", data);
            throw new Error(data.message || "Failed to delete task");
          }
      
          toast.success("Task deleted successfully");
        } catch (error) {
          console.error("Error deleting task:", error);
          toast.error("Error deleting task");
      
          // Refresh the todo list to ensure UI is in sync with server
          try {
            const todoResponse = await fetch(`http://localhost:5000/todos/${email}`);
            if (todoResponse.ok) {
              const todoData = await todoResponse.json();
              setTodoLists(todoData);
            } else {
              console.error("Failed to fetch todos after error");
            }
          } catch (fetchError) {
            console.error("Error refreshing todo list:", fetchError);
          }
        }
      };

    const handleStudyStyleQuizNavigation = async () => {
        const email = localStorage.getItem('userEmail');
        if (!email) {
            toast.error('No logged-in user found');
            return;
        }

        try {
            const response = await axios.get(`http://localhost:5000/UserStyle/${email}`);
            if (response.status === 200 && response.data.predictedStyle) {
                navigate('/predictedlearningstyle');
            } else {
                navigate('/quiz');
            }
        } catch (error) {
            console.error('Error fetching user style:', error);
            toast.error('Error checking user style. Redirecting to quiz.');
            navigate('/quiz');
        }
    };
    const handleNotificationClick = () => {
        setIsModalOpen(true);
        setNewNotifications([]);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    const handleShowGoal = () => {
        setShowGoal(true);
    }
    const handleCloseGoal = () => {
        setShowGoal(false);
    };
    const handleProfileClick = async () => {
        if (!showProfileCard) { // Fetch data only when opening the card
          const email = localStorage.getItem('userEmail');
          if (!email) {
            toast.error('No logged-in user found');
            return;
          }
    
          try {
            const response = await axios.get(`http://localhost:5000/user/${email}`);
            if (response.status === 200) {
              setUserData(response.data);
            } else {
              toast.error('Unable to fetch user profile');
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
            toast.error('Error retrieving user profile');
          }
        }
        setShowProfileCard(!showProfileCard);
      };
    const markAsRead = (index) => {
        setNewNotifications((prevNewNotifications) =>
            prevNewNotifications.filter((_, i) => i !== index)
        );
        setReadNotifications((prevReadNotifications) => [
            ...prevReadNotifications,
            notifications[index]
        ]);
    };
    const progressPercentage =
    todoLists.length > 0
      ? (todoLists.filter((todo) => todo.completed).length / todoLists.length) *
        100
      : 0;
      
      const data = {
        labels: Array.from({ length: 8 }, (_, i) => `Semester ${i + 1}`),
        datasets: [
          {
            label: 'Percentage/CGPA',
            data: graphData ? graphData.map((entry) => parseFloat(entry.percentage)) : [],
            borderColor: 'rgb(3, 248, 220)', // Bright blue border color
            backgroundColor: 'rgba(0, 206, 252, 0.95)', // Bright blue background color
            fill: false,
            tension: 0.4, // Increased tension for smoother curves
            pointRadius: 5, // Larger points
            pointHoverRadius: 7, // Larger hover points
            pointBackgroundColor: 'rgba(0, 206, 252, 0.95)', // Point background color
            pointBorderColor: 'rgb(3, 248, 220)', // Point border color
          },
        ],
      };
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#fff', // Bright blue text color
          },
        },
        title: {
          display: true,
          text: "Student's Performance Progress Report",
          color: '#fff', // Bright blue text color
        },
        tooltip: {
          titleColor: '#fff', // Bright blue text color
          bodyColor: '#fff', // Bright blue text color
          backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark background for tooltip
          borderColor: 'rgb(3, 248, 220)', // Bright blue border color
          borderWidth: 1,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: 'Percentage/CGPA',
            color: '#fff', // Bright blue text color
          },
          ticks: {
            color: '#fff', // Bright blue text color
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)', // Light grid lines
          },
        },
        x: {
          title: {
            display: true,
            text: 'Semester',
            color: '#fff', // Bright blue text color
          },
          ticks: {
            color: '#fff', // Bright blue text color
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)', // Light grid lines
          },
        },
      },
      animation: {
        duration: 2000, // Animation duration in milliseconds
        easing: 'easeInOutQuad', // Easing function for animation
      },
    };
    const stressData = {
      labels: ['Overall Stress', 'Sleep Stress', 'Study Stress', 'Screen Stress', 'Face Stress'],
      datasets: [
        {
          label: 'Stress Levels (%)',
          data: result ? [result.overallStress, result.sleepStress, result.studyStress, result.screenStress, result.faceStress ?? 0] : [],
          borderColor: 'rgb(3, 248, 220)', // Bright blue border color
          backgroundColor: 'rgba(0, 206, 252, 0.95)', // Bright blue background color
          fill: false,
          tension: 0.4, // Increased tension for smoother curves
          pointRadius: 5, // Larger points
          pointHoverRadius: 7, // Larger hover points
          pointBackgroundColor: 'rgba(0, 206, 252, 0.95)', // Point background color
          pointBorderColor: 'rgb(3, 248, 220)', // Point border color
        },
      ],
    };
    
    const stressOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#fff', // Bright blue text color
          },
        },
        title: {
          display: true,
          text: "Student's Stress Levels",
          color: '#fff', // Bright blue text color
        },
        tooltip: {
          titleColor: '#fff', // Bright blue text color
          bodyColor: '#fff', // Bright blue text color
          backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark background for tooltip
          borderColor: 'rgb(3, 248, 220)', // Bright blue border color
          borderWidth: 1,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: 'Stress Level (%)',
            color: '#fff', // Bright blue text color
          },
          ticks: {
            color: '#fff', // Bright blue text color
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)', // Light grid lines
          },
        },
        x: {
          title: {
            display: true,
            text: 'Stress Categories',
            color: '#fff', // Bright blue text color
          },
          ticks: {
            color: '#fff', // Bright blue text color
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)', // Light grid lines
          },
        },
      },
      animation: {
        duration: 2000, // Animation duration in milliseconds
        easing: 'easeInOutQuad', // Easing function for animation
      },
    };
    
    return (
        <div className="report-container">
            <header className="dashboard-header">
                    <div className="logo">
                      <img src={logo} alt="Logo" />
                    </div>
                    <div className="header-right">
                      <div className="icon profile" onClick={handleProfileClick}>
                        <i className="fas fa-user"></i>
                      </div>
                    </div>
                  </header>
                  {showProfileCard && userData && (
                    <div className="profile-card">
                      <button className="close-btn" onClick={() => setShowProfileCard(false)}>
                        &times;
                      </button>
                      <h3>User Profile</h3>
                      <p><strong>Name:</strong> {userData.name}</p>
                      <p><strong>Email:</strong> {userData.email}</p>
                      <p><strong>Age:</strong> {userData.age}</p>
                    </div>
                  )}
                  <div className="dashboard-body">
                    <nav className="sidebar-dashboard">
                      <ul>
                      <li onClick={() => handleNavigation('/dashboard')}>
              <i className="fas fa-home"> </i> Dashboard
            </li>
            <li onClick={() => handleNavigation('/genieguide')}>
              <i className="fas fa-book"> </i> GenieGuide
            </li>
            <li onClick={() => handleNavigation('/nova')}>
              <i className="fas fa-robot"> </i> Nova AI
            </li>
            <li onClick={handleStudyStyleQuizNavigation}>
              <i className="fas fa-question"> </i> Study Style Quiz
            </li>
            <li onClick={() => handleNavigation('/userprofile')}>
              <i className="fas fa-user"> </i> My Profile
            </li>
            <li onClick={() => handleNavigation('/progress')}>
              <i className="fas fa-chart-line"> </i> Progress Report
            </li>
            <li onClick={() => handleNavigation('/rehab')}>
              <i className="fas fa-heart"> </i> Students Rehab
            </li>
            <li onClick={() => handleNavigation('/about')}>
              <i className="fas fa-info-circle"> </i> About StudyGenie
            </li>
            <li onClick={() => handleNavigation('/faq')}>
              <i className="fas fa-question-circle"> </i> F.A.Q.
            </li>
            <li onClick={() => handleNavigation('/survey')}>
              <i className="fas fa-comment-dots"> </i> Feedback Portal
            </li>
                      </ul>
                    </nav>
                <main className="main-content">
                    <div className="summary-container">
                        <div className="performance-summary" onClick={handleShowPerformance}>
                            <h2>Student's Semester Performance</h2>
                        </div>
                        <div className="rehab-summary" onClick={handleShowStudentRehab}>
                            <h2>Student's Stress Report</h2>
                        </div>
                        <div className="todo-summary" onClick={handleShowTodo}>
                            <h2>To-Do Lists</h2>
                        </div>
                        <div className="goals-summary" onClick={handleShowGoal}>
                            <h2>My Goals</h2>
                        </div>
                    </div>
                    {showPerformance && (
  <div className="modal">
    <div className="modal-content">
      <span className="close" onClick={handleClosePerformance}></span>
      {showGraph ? (
        <div className="graph-container">
          <Line data={data} options={options} />
          <button onClick={handleGenerateNew} className='generate'>Generate New</button>
        </div>
      ) : (
        <div className="progress-container">
          {Array.from({ length: currentSemester - 1 }, (_, index) => (
            <label key={index}>
              Semester {index + 1}:
              <input
                type="text"
                value={progressData[index]}
                onChange={(e) => handleInputChange(index, e.target.value)}
              />
            </label>
          ))}
          <button onClick={handleSaveProgress}>Save Progress</button>
        </div>
      )}
    </div>
  </div>
)}
                    {showTodo && (
  <div className="modal">
    <div className="modal-content">
      <span className="close" onClick={handleCloseTodo}></span>
      
      <div className="todo-app-container">
        <h1 className="todo-title">To-Do List</h1>
        
        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{
              width: `${progressPercentage}%`,
            }}
          />
        </div>
        <p className="progress-text">{progressPercentage.toFixed(0)}% Completed</p>

        <div className="add-todo-container">
          <input
            type="text"
            value={newTodo}
            placeholder="Enter a new task..."
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddTodo()}
            className="todo-input"
          />
          <button onClick={handleAddTodo} className="add-button">
            Add Task
          </button>
        </div>

        <ul className="todo-list">
          {todoLists.map((todo) => (
            <li
              key={todo._id}
              className={`todo-item ${todo.completed ? "completed" : ""}`}
            >
              <div className="todo-content">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleTodo(todo._id)}
                  className="todo-checkbox"
                />
                <span className="todo-text">{todo.todo}</span>
              </div>
              <button 
                onClick={() => handleDeleteTodo(todo._id)}
                className="delete-btn"
              >
                Delete
              </button>
            </li>
          ))}
                                </ul>
                                {todoLists.length === 0 && (
          <p className="no-tasks">No tasks added yet!</p>
        )}
      </div>
    </div>
  </div>
                    )}

{showStudentRehab && (
  <div className="modal">
    <div className="modal-content">
      <span className="close" onClick={handleCloseStudentRehab}></span>
      <h2 className="rehab-report-title">Stress Test Results</h2>
      {result ? (
        <div className="stress-results">
          <h3>Email: <span>{result.email}</span></h3>
          <h3>Overall Stress: <span>{result.overallStress}%</span></h3>
          <h3>Sleep Stress: <span>{result.sleepStress}%</span></h3>
          <h3>Study Stress: <span>{result.studyStress}%</span></h3>
          <h3>Screen Stress: <span>{result.screenStress}%</span></h3>
          <h3>Face Stress: <span>{result.faceStress ?? 'N/A'}%</span></h3>

          {/* Display message based on overall stress level */}
          {result.overallStress > 80 && (
            <h2 className="stress-message high">Stress Level Too High, Consider consulting a doctor</h2>
          )}
          {result.overallStress > 60 && result.overallStress <= 80 && (
            <h2 className="stress-message medium-high">Stress Level is High!</h2>
          )}
          {result.overallStress > 40 && result.overallStress <= 60 && (
            <h2 className="stress-message moderate">Stress Level is Moderate!</h2>
          )}
          {result.overallStress > 20 && result.overallStress <= 40 && (
            <h2 className="stress-message low">Stress Level is Low.. You're doing great buddy!</h2>
          )}
          {result.overallStress <= 20 && (
            <h2 className="stress-message chill">You're a Chill Person Indeed!</h2>
          )}

          {/* Stress Levels Graph */}
          <div className="graph-container">
            <Line data={stressData} options={stressOptions} />
          </div>

          {/* Retake Test Button */}
          <button
            className="retake-button"
            onClick={() => handleNavigation('/rehab') && toast.info('Click on Stress Level Detector!')}
          >
            Retake Stress Test
          </button>
        </div>
      ) : (
        <p>No stress data available.</p>
      )}
    </div>
  </div>
)}
                    {showGoal && (
                        <div className='modal'>
                            <div className="modal-content">
                            <span className="close" onClick={handleCloseGoal}></span>
                                <h1 className='goals-header'>Goals</h1>
                                <Goals/>
                            </div>
                        </div>
                    )}
                </main>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Progress;