import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLearningStyle } from "./context/LearningStyleContext";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "../styles/dashboard.css";
import "../styles/predict.css";
import "@fortawesome/fontawesome-free/css/all.css";
import logo from "./logo.png";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// API Key should be managed via environment variables
const API_KEY = "AIzaSyAdC4wmAmi0psuXCzktjs-4uFgDTEr84xY";
if (!API_KEY) {
  console.error("API Key is missing. Please set REACT_APP_GOOGLE_AI_API_KEY in your environment variables.");
}
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

export default function PredictedLearningStylePage() {
  const navigate = useNavigate();
  const { learningStyle, fetchLearningStyle } = useLearningStyle();
  const [aiContent, setAiContent] = useState({
    recommendations: "",
    schedule: "",
    weaknesses: "",
    efficiency: {
      labels: ['Time Management', 'Focus', 'Retention', 'Understanding', 'Application'],
      data: [0, 0, 0, 0, 0]
    }
  });
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [displayedContent, setDisplayedContent] = useState({
    recommendations: "",
    schedule: "",
    weaknesses: "",
    efficiency: null
  });
  const [notifications, setNotifications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNotifications, setNewNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState([]);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [userData, setUserData] = useState(null);

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

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff'
        }
      },
      title: {
        display: true,
        text: 'Learning Efficiency Analysis',
        color: '#fff',
        font: {
          size: 16
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          color: '#fff'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      x: {
        ticks: {
          color: '#fff'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  };

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) {
      fetchLearningStyle(email);
    } else {
      toast.error("No logged-in user found.");
      navigate("/login");
    }
    const interval = setInterval(() => {
      const randomNotification = notificationMessages[Math.floor(Math.random() * notificationMessages.length)];
      setNotifications((prevNotifications) => [...prevNotifications, randomNotification]);
      setNewNotifications((prevNewNotifications) => [...prevNewNotifications, randomNotification]);
    }, 300000);

    return () => clearInterval(interval);
  }, [fetchLearningStyle, navigate]);

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

  useEffect(() => {
    const chatInstance = model.startChat({
      generationConfig: {
        maxOutputTokens: 1200,
      },
    });
    setChat(chatInstance);
  }, []);

  useEffect(() => {
    const fetchAiGeneratedContent = async () => {
      try {
        if (chat && learningStyle) {
          // Get recommendations
          const recommendationsPrompt = `Provide 10 detailed study recommendations point wise for a learner with the style: ${learningStyle}. Give in simple words targeting students entering in technical education.`;
          const recommendationsResult = await chat.sendMessage(recommendationsPrompt);

          // Get schedule
          const schedulePrompt = `Create a detailed weekly study schedule for a ${learningStyle} learner, including specific times and activities. Divide the schedule into weekdays and weekends. Give in simple words targeting students entering in technical education.`;
          const scheduleResult = await chat.sendMessage(schedulePrompt);

          // Get weaknesses
          const weaknessesPrompt = `List 10 main areas where ${learningStyle} learners typically face challenges and how to overcome them. Give in simple words targeting students entering in technical education.`;
          const weaknessesResult = await chat.sendMessage(weaknessesPrompt);

          // Generate efficiency data
          const efficiencyScores = {
            'Time Management': Math.floor(Math.random() * 20) + 80,
            'Focus': Math.floor(Math.random() * 20) + 75,
            'Retention': Math.floor(Math.random() * 15) + 85,
            'Understanding': Math.floor(Math.random() * 20) + 80,
            'Application': Math.floor(Math.random() * 15) + 85
          };

          setAiContent({
            recommendations: await recommendationsResult.response.text(),
            schedule: parseSchedule(await scheduleResult.response.text()),
            weaknesses: await weaknessesResult.response.text(),
            efficiency: {
              labels: Object.keys(efficiencyScores),
              data: Object.values(efficiencyScores)
            }
          });

          setLoading(false);
          typeContent(await recommendationsResult.response.text(), await scheduleResult.response.text(), await weaknessesResult.response.text());
        }
      } catch (error) {
        console.error("Error with Google Generative AI:", error);
        setLoading(false);
      }
    };

    if (learningStyle) {
      fetchAiGeneratedContent();
    }
  }, [chat, learningStyle]);

  const typeContent = (recommendations, schedule, weaknesses) => {
    let recommendationsIndex = 0;
    let scheduleIndex = 0;
    let weaknessesIndex = 0;

    const interval = setInterval(() => {
      setDisplayedContent(prev => ({
        ...prev,
        recommendations: recommendations.slice(0, recommendationsIndex),
        schedule: schedule.slice(0, scheduleIndex),
        weaknesses: weaknesses.slice(0, weaknessesIndex)
      }));

      recommendationsIndex++;
      scheduleIndex++;
      weaknessesIndex++;

      if (recommendationsIndex > recommendations.length &&
        scheduleIndex > schedule.length &&
        weaknessesIndex > weaknesses.length) {
        clearInterval(interval);
      }
    }, 10);
  };

  const formatContent = (content) => {
    if (!content) {
      return <p>Loading...</p>;
    }

    if (typeof content === "string") {
      const lines = content.replace(/[*]/g, "").trim().split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      return (
        <div className="formatted-content">
          {lines.map((line, index) => (
            <p key={index} className="mb-2">{line}</p>
          ))}
        </div>
      );
    }

    if (typeof content === "object") {
      return (
        <div className="formatted-content">
          {Object.keys(content).map((period, index) => (
            <div key={index} className="period-schedule">
              <h4>{period.charAt(0).toUpperCase() + period.slice(1)}</h4>
              <table>
                <tbody>
                  {content[period].map((activity, idx) => (
                    <tr key={idx}>
                      <td>{activity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      );
    }

    return <p>Loading...</p>;
  };

  const handleNavigation = (path) => {
    navigate(path);
  };
  const parseSchedule = (scheduleText) => {
    const schedule = {
      weekdays: [],
      weekends: []
    };

    const weekdaysRegex = /Weekdays:\s*(.*?)\s*(?=Weekends:|$)/gs;
    const weekendsRegex = /Weekends:\s*(.*?)\s*$/gs;

    const weekdaysMatch = weekdaysRegex.exec(scheduleText);
    const weekendsMatch = weekendsRegex.exec(scheduleText);

    if (weekdaysMatch) {
      schedule.weekdays = weekdaysMatch[1].split('\n').map(activity => activity.trim()).filter(activity => activity.length > 0);
    }

    if (weekendsMatch) {
      schedule.weekends = weekendsMatch[1].split('\n').map(activity => activity.trim()).filter(activity => activity.length > 0);
    }

    return schedule;
  };
  const handleProfileClick = async () => {
    if (!showProfileCard) {
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

  return (
    <div className="predict-container">
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
              <i className="fas fa-home"></i> Dashboard
            </li>
            <li onClick={() => handleNavigation('/genieguide')}>
              <i className="fas fa-book"></i> GenieGuide
            </li>
            <li onClick={() => handleNavigation('/nova')}>
              <i className="fas fa-robot"></i> Nova AI
            </li>
            <li onClick={handleStudyStyleQuizNavigation}>
              <i className="fas fa-question"></i> Study Style Quiz
            </li>
            <li onClick={() => handleNavigation('/userprofile')}>
              <i className="fas fa-user"></i> My Profile
            </li>
            <li onClick={() => handleNavigation('/progress')}>
              <i className="fas fa-chart-line"></i> Progress Report
            </li>
            <li onClick={() => handleNavigation('/rehab')}>
              <i className="fas fa-heart"></i> Students Rehab
            </li>
            <li onClick={() => handleNavigation('/about')}>
              <i className="fas fa-info-circle"></i> About StudyGenie
            </li>
            <li onClick={() => handleNavigation('/faq')}>
              <i className="fas fa-question-circle"></i> F.A.Q.
            </li>
            <li onClick={() => handleNavigation('/survey')}>
              <i className="fas fa-comment-dots"></i> Feedback Portal
            </li>
          </ul>
        </nav>
        <main className="main-AI">
          <div className="title-bar">
            <h2>Your Learning Style is: {learningStyle || "Not Available"}</h2>
          </div>
          <div className="grid-container">
            <div className="recommendations-container">
              <h3>Study Recommendations</h3>
              <div className="content">
                {loading ? (
                  <div className="loading-dots">
                    <span>.</span><span>.</span><span>.</span>
                  </div>
                ) : (
                  formatContent(displayedContent.recommendations)
                )}
              </div>
            </div>

            <div className="schedule-container">
              <h3>Study Schedule</h3>
              <div className="content">
                {loading ? (
                  <div className="loading-dots">
                    <span>.</span><span>.</span><span>.</span>
                  </div>
                ) : (
                  formatContent(displayedContent.schedule)
                )}
              </div>
            </div>

            <div className="weaknesses-container">
              <h3>Areas for Improvement</h3>
              <div className="content">
                {loading ? (
                  <div className="loading-dots">
                    <span>.</span><span>.</span><span>.</span>
                  </div>
                ) : (
                  formatContent(displayedContent.weaknesses)
                )}
              </div>
            </div>

            <div className="efficiency-container">
              <h3>Learning Efficiency Analysis</h3>
              <div className="chart-container">
                {loading ? (
                  <div className="loading-dots">
                    <span>.</span><span>.</span><span>.</span>
                  </div>
                ) : (
                  <Bar
                    options={chartOptions}
                    data={{
                      labels: aiContent.efficiency.labels,
                      datasets: [{
                        label: 'Efficiency Score',
                        data: aiContent.efficiency.data,
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                        borderColor: 'rgb(53, 162, 235)',
                        borderWidth: 1
                      }]
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="retake-quiz">
            <button className="retake-btn" onClick={() => handleNavigation("/quiz")}>
              Retake Quiz
            </button>
            
          </div>
        </main>
      </div>
    </div>
  );
}