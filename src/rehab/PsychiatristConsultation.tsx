import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Mic, MicOff, Send, Volume2, Edit2, Check, User, Home, Download, PieChart, Brain, Stethoscope } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

import '../styles/PsychiatristConsultation.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'regenerator-runtime/runtime';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);
// Placeholder paths for videos and images
const maleVideoPath = new URL('/src/rehab/vishwas.mp4', import.meta.url).href;
const femaleVideoPath = new URL('/src/rehab/prerna.mp4', import.meta.url).href;
const docimgpath = new URL('/src/rehab/male1.png', import.meta.url).href;

// Gemini API key - in a real app, this should be in an environment variable
const GEMINI_API_KEY = 'AIzaSyAP4LPvEUbrTgiHlBmdzsRZw9u2FDRSykM';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'psychiatrist';
  timestamp: Date;
}

interface CopingStrategy {
  strategy: string;
  effectiveness: number;
}

interface StressData {
  label: string;
  value: number;
  color: string;
}

export default function PsychiatristConsultation() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [doctorGender, setDoctorGender] = useState<'male' | 'female'>('male');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAIResponse, setCurrentAIResponse] = useState<string>('');
  const [useVideo, setUseVideo] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [userName, setUserName] = useState('');
  const [overallStress, setOverallStress] = useState(0);
  const navigate = useNavigate();
  
  // Stress level data for pie chart
  const [stressData, setStressData] = useState({
    labels: ['Sleep Stress', 'Study Stress', 'Screen Stress', 'Face Stress'],
    datasets: [
      {
        label: 'Stress Levels',
        data: [0, 0, 0, 0],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  });
  
  const [copingStrategies, setCopingStrategies] = useState<CopingStrategy[]>([
    { strategy: 'Deep Breathing', effectiveness: 75 },
    { strategy: 'Mindfulness', effectiveness: 65 },
    { strategy: 'Physical Exercise', effectiveness: 80 },
    { strategy: 'Journaling', effectiveness: 60 },
    { strategy: 'Social Support', effectiveness: 70 },
    { strategy: 'Meditation', effectiveness: 85 },
    { strategy: 'Yoga', effectiveness: 78 },
    { strategy: 'Art Therapy', effectiveness: 68 },
    { strategy: 'Music Therapy', effectiveness: 72 },
    { strategy: 'Progressive Muscle Relaxation', effectiveness: 77 },
    { strategy: 'Nature Walks', effectiveness: 74 },
    { strategy: 'Healthy Eating', effectiveness: 82 },
    { strategy: 'Adequate Sleep', effectiveness: 88 },
    { strategy: 'Time Management', effectiveness: 79 },
    { strategy: 'Professional Counseling', effectiveness: 90 }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const webcamRef = useRef<Webcam>(null);
  const speechSynthesis = window.speechSynthesis;
  const videoRef = useRef<HTMLVideoElement>(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Fallback AI response generation
  const generateFallbackResponse = (userInput: string): string => {
    // Common phrases and responses for a psychiatrist
    const userFeelingPatterns = [
      { pattern: /sad|depressed|unhappy|miserable|down/i, responses: [
        "I understand that you're feeling down. Could you tell me more about when these feelings started?",
        "I'm sorry to hear you're feeling this way. What do you think might be contributing to these feelings?",
        "Depression can be challenging to deal with. Have you noticed any specific triggers for these feelings?"
      ]},
      { pattern: /anxious|worried|nervous|stress|stressed/i, responses: [
        "Anxiety can be quite overwhelming. Could you describe what situations tend to make you feel most anxious?",
        "I understand that anxiety can be difficult to manage. Have you noticed any physical symptoms when you feel anxious?",
        "Stress affects many people differently. What strategies have you tried to manage your stress so far?"
      ]},
      { pattern: /angry|mad|frustrated|irritated/i, responses: [
        "I can hear that you're feeling frustrated. What specifically has been triggering these feelings of anger?",
        "Anger is a natural emotion, but it can be challenging when it's intense. How do you typically express your anger?",
        "When you feel this way, what thoughts tend to go through your mind?"
      ]},
      { pattern: /tired|exhausted|fatigue|no energy/i, responses: [
        "Fatigue can significantly impact our mental health. How has your sleep been recently?",
        "I understand feeling exhausted can make everything more difficult. Has this been affecting your daily activities?",
        "Energy levels can be connected to many factors. Have you noticed any patterns with your fatigue?"
      ]},
      { pattern: /lonely|alone|isolated/i, responses: [
        "Feeling lonely can be very difficult. Could you tell me more about your social connections?",
        "I understand that feeling isolated can be painful. How long have you been experiencing these feelings?",
        "Social connection is important for our wellbeing. What kind of support system do you currently have?"
      ]},
      { pattern: /confused|don't know|uncertain|lost/i, responses: [
        "It's okay to feel uncertain sometimes. Could you share more about what's causing this confusion?",
        "Feeling lost can be disorienting. Let's try to break down what might be contributing to these feelings.",
        "I understand that uncertainty can be uncomfortable. What aspects of your situation feel most unclear right now?"
      ]},
      { pattern: /happy|good|great|better/i, responses: [
        "I'm glad to hear you're feeling positive. What do you think has contributed to this?",
        "That's wonderful to hear. Could you tell me more about what's going well for you?",
        "It's important to recognize these positive moments. How can we build on this feeling?"
      ]},
      { pattern: /sleep|insomnia|nightmare/i, responses: [
        "Sleep difficulties can significantly impact our mental health. Could you describe your typical sleep pattern?",
        "I understand that sleep problems can be frustrating. How long have you been experiencing these issues?",
        "Many factors can affect our sleep. Have you noticed any patterns or triggers for your sleep difficulties?"
      ]},
      { pattern: /relationship|partner|spouse|marriage/i, responses: [
        "Relationships can be both rewarding and challenging. Could you tell me more about what's happening in this relationship?",
        "I understand that relationship issues can be stressful. How has this been affecting you?",
        "Relationship dynamics can be complex. What aspects of the relationship are most concerning to you right now?"
      ]},
      { pattern: /work|job|career|boss|colleague/i, responses: [
        "Work stress can significantly impact our wellbeing. Could you tell me more about your work situation?",
        "I understand that workplace challenges can be difficult. How has this been affecting other areas of your life?",
        "Many people struggle with work-related stress. What aspects of your job do you find most challenging?"
      ]},
      { pattern: /family|parent|child|mother|father/i, responses: [
        "Family dynamics can be complex. Could you tell me more about what's happening with your family?",
        "I understand that family issues can be emotionally charged. How have these situations been affecting you?",
        "Family relationships often carry deep emotional significance. What aspects of these relationships are most challenging for you?"
      ]}
    ];
    
    // Check for greeting
    if (messages.length <= 1) {
      return "Thank you for sharing. I'm here to listen and support you. Could you tell me more about what brings you to therapy today?";
    }
    
    // Check for patterns in user input
    for (const { pattern, responses } of userFeelingPatterns) {
      if (pattern.test(userInput)) {
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }
    
    // Default responses if no pattern matches
    const defaultResponses = [
      "Thank you for sharing that with me. Could you elaborate a bit more on how this has been affecting you?",
      "I appreciate your openness. How have you been coping with these feelings?",
      "That sounds challenging. Have you noticed any patterns or triggers related to this?",
      "I'm listening and I understand this is important. How long have you been experiencing this?",
      "Your feelings are valid. Could you tell me more about what you think might be contributing to this?",
      "I'm here to support you through this. What would be most helpful for you right now?",
      "That's important information. How has this been impacting your daily life?",
      "I understand. Have you tried any strategies to manage these feelings so far?",
      "Thank you for trusting me with this. What are your thoughts about what might help in this situation?",
      "I'm hearing that this has been difficult for you. What would you like to focus on in our session today?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        const initialMessage: Message = {
          id: Date.now().toString(),
          text: `Hello ${userName}, I'm Dr. ${doctorGender === 'male' ? 'Vishwas' : 'Prerna'}. I'm here to help with any mental health concerns you might have. How are you feeling today?`,
          sender: 'psychiatrist',
          timestamp: new Date()
        };

        setMessages([initialMessage]);
        setCurrentAIResponse(initialMessage.text);
        speakMessage(initialMessage.text);
      }
    };

    speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();

    return () => {
      speechSynthesis.cancel();
    };
  }, [doctorGender]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (transcript && !isEditing) {
      setInputMessage(transcript);
    }
  }, [transcript, isEditing]);
  useEffect(() => {
    if (videoRef.current) {
      if (isSpeaking) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isSpeaking]);
  useEffect(() => {
    const fetchStressData = async () => {
      const email = localStorage.getItem('userEmail');
      if (!email) {
        console.error('No email found in local storage');
        return;
      }
  
      try {
        const response = await axios.get(`http://localhost:5000/StressTest/${email}`);
        const data = response.data;
        setStressData({
          labels: ['Sleep Stress', 'Study Stress', 'Screen Stress', 'Face Stress'],
          datasets: [
            {
              label: 'Stress Levels',
              data: [
                data.sleepStress || 0,
                data.studyStress || 0,
                data.screenStress || 0,
                data.faceStress || 0,
              ],
              backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
              ],
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching stress data:', error);
      }
    };
  
    fetchStressData();
  }, []);
  useEffect(() => {
    const fetchUserStress = async () => {
      const email = localStorage.getItem('userEmail');
      if (!email) {
        console.error('No email found in local storage');
        return;
      }
  
      try {
        const response = await axios.get(`http://localhost:5000/StressTest/${email}`);
        const data = response.data;
        setOverallStress(data.overallStress);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
  
    fetchUserStress();
  }, []);
  useEffect(() => {
    const fetchUserInfo = async () => {
      const email = localStorage.getItem('userEmail');
      if (!email) {
        console.error('No email found in local storage');
        return;
      }
  
      try {
        const response = await axios.get(`http://localhost:5000/user/${email}`);
        const data = response.data;
        setUserName(data.name);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
  
    fetchUserInfo();
  }, []);
  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel(); // Stop any ongoing speech
      const utterance = new SpeechSynthesisUtterance();
  
      const selectVoice = () => {
        const voices = speechSynthesis.getVoices();
  
        let preferredVoices = voices.filter((voice) => {
          const voiceName = voice.name.toLowerCase();
          return doctorGender === 'male'
            ? voiceName.includes('google india male') || voiceName.includes('google uk english male') || voiceName.includes('google us english male')
            : voiceName.includes('google india female') || voiceName.includes('google uk english female') || voiceName.includes('google us english female');
        });
  
        // Fallback: Choose any available male/female voice if no specific match found
        if (preferredVoices.length === 0) {
          preferredVoices = voices.filter((voice) => voice.name.toLowerCase().includes(doctorGender));
        }
  
        // Final fallback: Pick the first available voice
        utterance.voice = preferredVoices[0] || voices[0];
  
        // Adjust pitch to make male voice deeper and female voice slightly higher
        utterance.pitch = doctorGender === 'female' ? 1.2 : 0.9;
      };
  
      // If voices are already loaded, select voice immediately
      if (speechSynthesis.getVoices().length > 0) {
        selectVoice();
      } else {
        // Wait for voices to be available
        speechSynthesis.addEventListener('voiceschanged', selectVoice);
      }
  
      const speakChunks = (chunks: string[]) => {
        if (chunks.length === 0) return;
  
        const chunk = chunks.shift();
        if (chunk) {
          const chunkUtterance = new SpeechSynthesisUtterance(chunk);
          chunkUtterance.voice = utterance.voice;
          chunkUtterance.pitch = utterance.pitch;
          chunkUtterance.rate = utterance.rate;
  
          chunkUtterance.onend = () => speakChunks(chunks);
          speechSynthesis.speak(chunkUtterance);
        }
      };
  
      // Split the text into chunks of 200 characters
      const chunks = text.match(/.{1,200}/g) || [];
      speakChunks(chunks);
  
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
    }
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleMic = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      setIsEditing(false);
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    resetTranscript();
    setIsThinking(true);
    setIsEditing(false);

    try {
      // Create a context from previous messages
      const conversationHistory = messages.map(msg => 
        `${msg.sender === 'user' ? 'Patient' : `Dr. ${doctorGender === 'male' ? 'Vishwas' : 'Prerna'}`}: ${msg.text}`
      ).join('\n');

      // Prepare the prompt for Gemini
      const prompt = `
You are Dr. ${doctorGender === 'male' ? 'Vishwas' : 'Prerna'}, a compassionate and professional psychiatrist. 
Respond to the patient in a supportive, empathetic manner. Keep responses concise (2-3 sentences).
Focus on understanding the patient's feelings, asking clarifying questions, and providing gentle guidance.
Avoid making diagnoses or prescribing medications. Also your conversations must be in simple words and don't only ask questions give suggestions too. Recommend games in the rehab zone of studygenie like Gratitude Journal, Breathe with me, Letter to myself or Destroy the anxiety monster whenever you think that it can act as coping strartegy for the student

Patient Name: ${userName} (if student say's he has other name, then ask him to change the name in profile so that it will make the psychiatrist easy to communicate)
Overall Stress Level: ${overallStress}

Previous conversation:
${conversationHistory}

Patient: ${userMessage.text}

Your response as Dr. ${doctorGender === 'male' ? 'Vishwas' : 'Prerna'}:`;

      // Call Gemini API
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 150,
          }
        }
      );

      // Extract the response text
      let aiResponseText = "";
      if (response.data && 
          response.data.candidates && 
          response.data.candidates[0] && 
          response.data.candidates[0].content && 
          response.data.candidates[0].content.parts && 
          response.data.candidates[0].content.parts[0]) {
        aiResponseText = response.data.candidates[0].content.parts[0].text;
      } else {
        // Fallback if the response format is unexpected
        aiResponseText = generateFallbackResponse(userMessage.text);
      }

      // Clean up the response if needed (remove any prefixes like "Dr. Vishwas:")
      aiResponseText = aiResponseText.replace(/^(Dr\. (Vishwas|Prerna):)/i, '').trim();

      const psychiatristMessage: Message = {
        id: Date.now().toString(),
        text: aiResponseText,
        sender: 'psychiatrist',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, psychiatristMessage]);
      setCurrentAIResponse(psychiatristMessage.text);
      speakMessage(psychiatristMessage.text);
    } catch (error) {
      console.error('Error generating response:', error);
      
      // Use fallback response generation
      const fallbackResponse = generateFallbackResponse(userMessage.text);
      
      const psychiatristMessage: Message = {
        id: Date.now().toString(),
        text: fallbackResponse,
        sender: 'psychiatrist',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, psychiatristMessage]);
      setCurrentAIResponse(psychiatristMessage.text);
      speakMessage(psychiatristMessage.text);
    } finally {
      setIsThinking(false);
    }
  };

  const handleEndChat = () => {
    setShowExportDialog(true);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const handleNavigation = (path: string) => {
    navigate(path);
  };
  
  const exportChatSummary = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const lineHeight = 7;
    let yPosition = 20;

    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Psychiatric Consultation Summary', margin, yPosition);
    yPosition += lineHeight * 2;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Consultation History:', margin, yPosition);
    yPosition += lineHeight * 1.5;

    pdf.setFont('helvetica', 'normal');
    messages.forEach(message => {
      const sender = message.sender === 'user' ? 'You' : 'Dr. ' + (doctorGender === 'male' ? 'Vishwas' : 'Prerna');
      const timestamp = formatDate(message.timestamp);
      const text = `[${timestamp}] ${sender}: ${message.text}`;
      
      const splitText = pdf.splitTextToSize(text, pageWidth - margin * 2);
      
      if (yPosition + (splitText.length * lineHeight) > pdf.internal.pageSize.getHeight() - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      
      splitText.forEach((line: string) => {
        pdf.text(line, margin, yPosition);
        yPosition += lineHeight;
      });
      
      yPosition += lineHeight / 2;
    });

    pdf.save(`psychiatric-consultation-summary.pdf`);
  };

  const handleExportDialogResponse = (shouldExport: boolean) => {
    if (shouldExport) {
      exportChatSummary();
    }
    setShowExportDialog(false);
  };

  const renderStressLevelBarChart = () => {
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            color: 'rgba(255, 255, 255, 0.8)',
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: 'rgba(255, 255, 255, 0.8)',
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context: any) {
              return `${context.label}: ${context.raw}%`;
            },
          },
        },
      },
    };
  
    return (
      <div className="stress-bar-chart">
        <h3>
          <PieChart size={20} /> Stress Distribution
        </h3>
        <div className="chart-container">
          <Bar data={stressData} options={chartOptions} />
        </div>
        <div className="chart-note">
          <p>Based on Stress Detection System</p>
        </div>
      </div>
    );
  };
  const renderCopingStrategies = () => {
    return (
      <div className="coping-strategies">
        <h3><Brain size={20} /> Coping Strategies</h3>
        <div className="strategy-bars">
          {copingStrategies.map((strategy, index) => (
            <div key={strategy.strategy} className="strategy-bar-container">
              <span className="strategy-name">{strategy.strategy}</span>
              <div className="strategy-bar-wrapper">
                <div 
                  className="strategy-bar"
                  style={{ 
                    width: `${strategy.effectiveness}%`,
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <span className="strategy-value">{Math.round(strategy.effectiveness)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="consultation-container">
      <div className="consultation-header">
        <div className="doctor-info">
          <div className={`doctor-avatar ${isSpeaking ? 'speaking' : ''}`}>
            <img
              src={docimgpath}
              alt="Doctor avatar"
              className="avatar-animation"
            />
          </div>
          <div className="doctor-details">
            <h2>Psychiatric Consultation</h2>
            <p>AI-Powered Mental Health Support</p>
          </div>
        </div>
        <div className="header-controls">
  <div className="gender-selector">
    <button
      onClick={() => setDoctorGender('male')}
      className={`gender-button ${doctorGender === 'male' ? 'active' : ''}`}
    >
      Male
    </button>
    <button
      onClick={() => setDoctorGender('female')}
      className={`gender-button ${doctorGender === 'female' ? 'active' : ''}`}
    >
      Female
    </button>
  </div>
  <button onClick={handleEndChat} className="end-chat-button">
    <Home size={20} />
    End Chat
  </button>
</div>
      </div>

      <div className="psy-main-content">
        <div className="video-panel left">
          <div className="video-container small">
            <Webcam
              ref={webcamRef}
              audio={false}
              mirrored
              className="video-feed"
              width={280}
              height={200}
            />
            <div className="video-label">You</div>
          </div>
          {renderStressLevelBarChart()}
          {renderCopingStrategies()}
        </div>

        <div className="chat-section">
          <div className="messages-container">
            {messages.map(message => (
              <div key={message.id} className={`message ${message.sender}`}>
                {message.sender === 'psychiatrist' && (
                  <div className="message-icon">
                    <Stethoscope size={20} />
                  </div>
                )}
                <div className="message-content">
                  <p>{message.text}</p>
                  {message.sender === 'psychiatrist' && (
                    <button 
                      className="replay-voice"
                      onClick={() => speakMessage(message.text)}
                    >
                      <Volume2 size={16} />
                    </button>
                  )}
                </div>
                {message.sender === 'user' && (
                  <div className="message-icon">
                    <User size={20} />
                  </div>
                )}
                <span className="message-time">{formatDate(message.timestamp)}</span>
              </div>
            ))}
            {isThinking && (
              <div className="thinking-indicator">
                <div className="thinking-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span>Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="input-container">
            <div className="input-controls">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={listening && !isEditing ? 'Listening...' : 'Type your message...'}
                className="message-input"
                disabled={listening && !isEditing}
              />
              {browserSupportsSpeechRecognition && (
                <button
                  onClick={toggleMic}
                  className={`mic-button ${listening ? 'active' : ''}`}
                  title={listening ? 'Stop recording' : 'Start recording'}
                >
                  {listening ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
              )}
              {listening && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`edit-button ${isEditing ? 'active' : ''}`}
                  title={isEditing ? 'Submit edit' : 'Edit transcript'}
                >
                  {isEditing ? <Check size={20} /> : <Edit2 size={20} />}
                </button>
              )}
              <button
                onClick={handleSend}
                disabled={!inputMessage.trim()}
                className="send-button"
                title="Send message"
              >
                <Send size={20} />
              </button>
            </div>
            {listening && !isEditing && (
              <p className="listening-indicator">Speaking... Click edit to modify the text</p>
            )}
          </div>
        </div>

        <div className="video-panel right">
        <div className={`video-container small ${isSpeaking ? 'speaking' : ''}`}>
  <video
    ref={videoRef}
    src={doctorGender === 'male' ? maleVideoPath : femaleVideoPath}
    className="avatar-animation"
    loop
    muted
    playsInline
    autoPlay
  />
  <div className="video-label">Dr. {doctorGender === 'male' ? 'Vishwas' : 'Prerna'}</div>
</div>
          <div className="ai-response">
            <h3>Current Response</h3>
            <p>{currentAIResponse}</p>
          </div>
        </div>
      </div>

      {showExportDialog && (
        <div className="export-dialog-overlay">
          <div className="export-dialog">
            <h3>Save Session Summary</h3>
            <p>Would you like to save a PDF summary of this consultation?</p>
            <div className="export-dialog-buttons">
              <button onClick={() => handleExportDialogResponse(true)} className="export-yes">
                <Download size={20} />
                Yes, Save PDF
              </button>
              <button onClick={() => handleNavigation('/rehab')} className="export-no">
                No, Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}