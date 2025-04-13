import React, { useEffect, useState } from 'react';
import { User, Bot, Volume2, VolumeX } from 'lucide-react';
import { marked } from 'marked'; // Import marked library
import '../styles/Nova.css';

const ChatMessage = ({ message, isBot }) => {
  const [isSpeechOn, setIsSpeechOn] = useState(true);
  const [speechRate, setSpeechRate] = useState(1);
  const [maleVoice, setMaleVoice] = useState(null);

  useEffect(() => {
    // Load available voices and select a male voice
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const selectedMaleVoice = voices.find((voice) =>
        voice.name.toLowerCase().includes('male') // Look for male voices
      );
      setMaleVoice(selectedMaleVoice || null);
    };

    // Load voices when they are available
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    loadVoices();
  }, []);

  useEffect(() => {
    if (isBot && isSpeechOn && maleVoice) {
      const speakMessage = (text) => {
        const speech = new SpeechSynthesisUtterance(text);
        speech.voice = maleVoice; // Set the voice
        speech.rate = speechRate;
  
        // Speak the message
        window.speechSynthesis.speak(speech);
      };
  
      // Split the message into chunks if it's too long
      const maxChunkLength = 200; // Adjust chunk size as needed
      const chunks = message.match(new RegExp(`.{1,${maxChunkLength}}`, 'g')) || [message];
  
      // Speak each chunk sequentially
      chunks.forEach((chunk) => speakMessage(chunk));
    }
  }, [message, isBot, isSpeechOn, speechRate, maleVoice]);

  const toggleSpeech = () => {
    if (isSpeechOn) {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
    }
    setIsSpeechOn(!isSpeechOn); // Toggle speech on/off
  };

  const cycleSpeechRate = () => {
    const rates = [0.5, 1, 1.5, 2]; // Define speech rates
    const currentIndex = rates.indexOf(speechRate);
    const nextIndex = (currentIndex + 1) % rates.length;
    setSpeechRate(rates[nextIndex]); // Cycle through speech rates
  };

  const renderMarkdown = (markdown) => {
    marked.setOptions({
      gfm: true,
      breaks: true,
    });
    return { __html: marked(markdown) };
  };

  return (
    <div
      className={`chat-message-container ${isBot ? 'chat-message-bot' : 'chat-message-user'}`}
    >
      <div className={isBot ? 'bot-icon' : 'user-icon'}>
        {isBot ? <Bot /> : <User />}
      </div>
      <div className="message-content">
        <div className="author">{isBot ? 'Nova AI' : 'You'}</div>
        <div className="text" dangerouslySetInnerHTML={renderMarkdown(message)} />
      </div>
      {isBot && (
        <div className="controls">
          <button
            onClick={toggleSpeech}
            className="speech-toggle-button"
          >
            {isSpeechOn ? <Volume2 /> : <VolumeX />}
          </button>
          <button onClick={cycleSpeechRate} className="speech-rate-button">
            {speechRate}x
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;