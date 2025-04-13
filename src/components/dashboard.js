import React, { useState, useEffect } from 'react';
import "../styles/dashboard.css";
import '@fortawesome/fontawesome-free/css/all.css';
import logo from './logo.png';
import logo1 from './logo1.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const Dashboard = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNotifications, setNewNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState([]);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
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

  // Simulate random notifications every 5 minutes
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
    }, 300000); // 5 minutes
  
    return () => clearInterval(interval);
  }, []);
  

  const handleNotificationClick = () => {
    setIsModalOpen(true);
    setNewNotifications([]);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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

  return (
    <div className="dashboard-container">
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
          <button className="close-btn1" onClick={() => setShowProfileCard(false)}>
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
          
        <div className="logo-box"><img src={logo1} alt="Logo" /></div>
          <div className="quiz-box">
            <p>Take a quiz to detect your study style</p>
            <button className="start-quiz-btn" onClick={handleStudyStyleQuizNavigation}>Take Quiz</button>
          </div>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Dashboard;
