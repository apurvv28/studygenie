import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { useLearningStyle } from './context/LearningStyleContext';
import '../styles/quiz.css';
import '@fortawesome/fontawesome-free/css/all.css';
import logo from './logo.png';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/dashboard.css'; 

export default function Page() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { setLearningStyle } = useLearningStyle();
  const [newNotifications, setNewNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState([]);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [userData, setUserData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate(); 

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

  const storeStudyStyle = async () => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      toast.error('No logged-in user found');
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/UserStyle/${email}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
    } catch (err) {
      console.error('Error saving learning style:', err);
    }
  };
            
  const questions = [
    { id: 1, text: "How do you prefer to learn new concepts?", options: ["Research Papers/PDFs", "Watching YouTube Videos", "using AI Tools", "Visual/Diagrammatic Representations"] },
    { id: 2, text: "How do you prepare for exams?", options: ["Watching video lectures", "Reading textbooks", "Making mindmaps", "Learning concepts by heart"] },
    { id: 3, text: "What kind of learning material do you find useful?", options: ["Textbooks", "Handwritten Notes", "AI Tools", "Videos & Podcasts"] },
    { id: 4, text: "What helps you to remember new information the best?", options: ["Reading it several times", "Repeating key points in mind or aloud", "Associating it with real-life examples", "Writing it down in a summary"] },
    { id: 5, text: "What is your preferred way to summarize information?", options: ["Writing detailed paragraphs", "Creating bullet points", "Diagrammatic representation of concepts", "Making mindmaps"] },
    { id: 6, text: "When preparing for presentations, you:", options: ["Design visual slides", "Practice aloud with friends", "Write a detailed script", "Simulate it in real life"] },
    { id: 7, text: "Your go-to learning tool is:", options: ["YouTube Videos", "AI Tools", "Group Study", "Books"] },
    { id: 8, text: "What kind of notes do you prefer to keep?", options: ["Digital notes in PDF", "Aesthetic handwritten notes with doodles", "Typing quick bullet points on Notes App", "Screenshots or photos of important info"] },
  ];

  const handleChange = (value) => {
    const currentQuestionId = questions[currentQuestionIndex].id;
    setResponses({ ...responses, [currentQuestionId]: value });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuizClick = () => {
    window.location.reload('/study-style-quiz'); 
  };


  const handlePredictClick = async () => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      toast.error('No logged-in user found');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/UserStyle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, predictedStyle: prediction }),
      });
      if (!response.ok) {
        throw new Error('Failed to save user style');
      }
      toast.success('Your learning style has been updated.');
    } catch (error) {
      console.error('Failed to add or update study style', error);
      toast.error('Error updating learning style.');
    }
    navigate('/predictedlearningstyle');
  };
  
  

    const handleSubmit = async () => {
      setLoading(true);
      setError(null);
  
      try {
        const response = await axios.post('http://localhost:8000/api/predictLearningStyle', { responses });
        const { prediction } = response.data;
        await storeStudyStyle();
        setPrediction(prediction);
        setLearningStyle(prediction);
        
        setShowModal(true);
      } catch (err) {
        console.error('Error fetching prediction:', err);
        setError('An error occurred. Please try again.');
      } finally {
        setLoading(false);
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
          <div className="quiz-container">
            <div className="quiz-question">
              <p>{questions[currentQuestionIndex].text}</p>
              {questions[currentQuestionIndex].options.map((option) => (
                <label key={option} className="quiz-option">
                  <input
                    type="radio"
                    name={`question-${questions[currentQuestionIndex].id}`}
                    value={option}
                    onChange={() => handleChange(option)}
                    checked={responses[questions[currentQuestionIndex].id] === option}
                    
                  />
                  {option}
                </label>
              ))}
            </div>
            <div className="quiz-navigation">
              <button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                Previous
              </button>
              {currentQuestionIndex < questions.length - 1 ? (
                <button onClick={handleNext}>Next</button>
              ) : (
                <button onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Submitting...' : 'Finish Quiz'}
                </button>
              )}
            </div>
            {error && <p className="quiz-error">{error}</p>}
          </div>

          {/* Modal for displaying predicted learning style */}
          {showModal && (
            <div className="quiz-modal">
              <div className="quiz-modal-content">
                <h3>Your Predicted Study Style</h3>
                <p>{prediction}</p>
                <button className="quiz-modal-button" onClick={handlePredictClick}>
                  Continue
                </button>
                <button className="quiz-modal-button" onClick={handleQuizClick}>
                  Retake Quiz
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
      <ToastContainer/>
    </div>
  );
}
