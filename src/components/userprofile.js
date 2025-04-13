import React, { useEffect, useState } from 'react';
import "../styles/dashboard.css";
import '@fortawesome/fontawesome-free/css/all.css';
import logo from './logo.png';  
import logo1 from './logo2.png';
import { useNavigate } from 'react-router-dom';
import '../styles/profile.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editableFields, setEditableFields] = useState({
    name: '',
    course: '',
    subfield: '',
    year: '',
    college: '',
    age: '',
    mobile: '',
    semester: '', // New field for semester
  });
  const [notifications, setNotifications] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newNotifications, setNewNotifications] = useState([]);
    const [readNotifications, setReadNotifications] = useState([]);
      const [showProfileCard, setShowProfileCard] = useState(false);
    // List of predefined notifications
    const notificationMessages = [
      "Nova AI is waiting for you to start a new chapter",
      "Have you taken your stress level test yet?",
      "Have you taken your study style prediction test yet?",
      "Hello Student, it's time for study...",
      "Wanna impress your crush with good marks?",
      "Reminder: Don't forget to complete your Daily Goal!",
      "Nova AI has new insights waiting for you.",
      "Keep up the good work, you're doing great!",
      "Time for a break? You've earned it!",
      "Your progress report is ready to be reviewed."
    ];
  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    
    if (email) {
      fetch(`http://localhost:5000/user/${email}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setUserData(data);
          setEditableFields({
            name: data.name || '',
            course: data.course || '',
            subfield: data.subfield || '',
            year: data.year || '',
            college: data.college || '',
            age: data.age || '',
            mobile: data.mobile || '',
            semester: data.semester || '', // New field for semester
          });
          setLoading(false);
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
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
          setError(error);
          setLoading(false);
        });
    } else {
      setError(new Error('No logged-in user found'));
      setLoading(false);
    }
  }, []);
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
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleSaveChanges = () => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      fetch(`http://localhost:5000/user/${email}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editableFields),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setUserData(data);
          toast.success('Student Data Updated in our Database');
        })
        .catch(error => {
          console.error('Error saving user data:', error);
          toast.error('Error updating student data');
        });
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
      navigate('/quiz'); // Fallback to quiz if there's an error
    }
  };

  const handleLogout = () => {
    const confirmLogout = () => {
      localStorage.removeItem('userEmail');
      navigate('/login');
      toast.success('Logged out successfully');
    };

    const toastId = toast(
      <div>
        <h3>Are you sure you want to logout?</h3>
        <button onClick={confirmLogout} className='ask-yes'>Yes</button>
        <button onClick={() => toast.dismiss(toastId)} className='ask-no'>No</button>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  const handleNavigation = (path) => {
    navigate(path);
  };
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
    <div className="profile-container">
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
          <div className="profile-box">
            <img src={logo1} className="studygenie-logo" alt="StudyGenie Logo" />
            <h1 className="profile-header">Student's Profile</h1>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="error-message">Error: {error.message}</p>
            ) : (
              <div className="profile-details">
                <p className="profile-email"><strong>Email:</strong> {userData.email}</p>
                <div className="profile-form">
                  <div className="profile-column">
                    <label>
                      <strong>Name:</strong>
                      <input
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        value={editableFields.name}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label>
                      <strong>College:</strong>
                      <input
                        type="text"
                        name="college"
                        placeholder="Enter your college"
                        value={editableFields.college}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label>
                      <strong>Age:</strong>
                      <input
                        type="text"
                        name="age"
                        placeholder="Enter your age"
                        value={editableFields.age}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label>
                      <strong>Mobile:</strong>
                      <input
                        type="text"
                        name="mobile"
                        placeholder="Enter your mobile number"
                        value={editableFields.mobile}
                        onChange={handleInputChange}
                      />
                    </label>
                  </div>
                  <div className="profile-column">
                    <label>
                      <strong>Course:</strong>
                      <input
                        type="text"
                        name="course"
                        placeholder="Enter your course"
                        value={editableFields.course}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label>
                      <strong>Department:</strong>
                      <input
                        type="text"
                        name="subfield"
                        placeholder="Enter your subfield"
                        value={editableFields.subfield}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label>
                      <strong>Year:</strong>
                      <input
                        type="text"
                        name="year"
                        placeholder="Enter your year"
                        value={editableFields.year}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label>
                      <strong>Semester:</strong>
                      <input
                        type="text"
                        name="semester"
                        placeholder="Enter your semester"
                        value={editableFields.semester}
                        onChange={handleInputChange}
                      />
                    </label>
                  </div>
                </div>
                <div className="button-group">
                  <button onClick={handleSaveChanges} className='update'>Update</button>
                  <button onClick={handleLogout} className='logout'>Logout</button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Profile;