import { useState, useEffect } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import ChatMessage from './ChatMessage'; // Assuming ChatMessage remains the same
import FileUpload from './FileUpload'; // Import marked library
import { Link } from 'react-router-dom'; // Import Link for navigation
import '../styles/Nova.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Back = require('../nova-ai/back.png'); // Import the back icon image

interface Message {
  text: string;
  isBot: boolean;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi! I'm Nova AI, your educational assistant. How can I help you today?", isBot: true },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    toast.info('This Is NOVA AI, your study companion');

    if ('webkitSpeechRecognition' in window) {
      const recognitionInstance = new window.webkitSpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => setIsListening(true);
      recognitionInstance.onend = () => setIsListening(false);
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleVoiceInput(transcript);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages((prev) => [...prev, { text: userMessage, isBot: false }]);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { text: data.response, isBot: true }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        { text: 'Sorry, I encountered an error. Please try again.', isBot: true },
      ]);
    }

    setIsLoading(false);
  };

  const handleVoiceInput = async (transcript: string) => {
    setMessages([...messages, { text: transcript, isBot: false }]);
    // Handle the transcript as a user input and send it to the bot
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: transcript }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { text: data.response, isBot: true }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        { text: 'Sorry, I encountered an error. Please try again.', isBot: true },
      ]);
    }

    setIsLoading(false);
  };

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:3001/api/process-file', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { text: `Analyzing file: ${file.name}`, isBot: false },
        { text: data.summary, isBot: true },
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        { text: 'Sorry, I encountered an error processing the file. Please try again.', isBot: true },
      ]);
    }

    setIsLoading(false);
  };

  const handleMicClick = () => {
    if (isListening) {
      recognition?.stop();
    } else {
      recognition?.start();
    }
  };

  return (
    <div className="main-container1">
      <ToastContainer/>
      <div className="main2">
        <div className="main3">
          <div className="main4">
            <h1 className="heading">Nova AI Educational Assistant</h1>
            <Link to="/dashboard">
              <img
                src={Back} // Path to your image
                alt="Back to Dashboard"
                className="back-to-dashboard-icon"
              />
            </Link>
          </div>

          <div className="bot-messages">
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message.text} isBot={message.isBot} />
            ))}
            {isLoading && (
              <div className="loading-dots">
                <span>●</span>
                <span>●</span>
                <span>●</span>
              </div>
            )}
          </div>

          <div className="nova-input-container">
            <FileUpload onFileUpload={handleFileUpload} />

            <div className="input-wrapper">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything about your studies..."
                className="text-input"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="send-button"
              >
                <Send className="icon" />
              </button>
              <button onClick={handleMicClick} className="mic-button">
                {isListening ? <MicOff /> : <Mic />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;