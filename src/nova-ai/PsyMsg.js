import React, { useEffect, useState, useRef } from 'react';
import { User, Bot, Volume2, VolumeX } from 'lucide-react';
import { marked } from 'marked'; // Import marked library
import '../styles/Nova.css';

const ChatMessage = ({ message, isBot }) => {
  const [playCount, setPlayCount] = useState(0);
  const [isSpeechOn, setIsSpeechOn] = useState(true);
  const [speechRate, setSpeechRate] = useState(1);
  const speechRef = useRef(null);

  useEffect(() => {
    if (isBot && isSpeechOn && playCount < 1) {
      const speech = new SpeechSynthesisUtterance(message);
      speech.rate = speechRate;
      window.speechSynthesis.speak(speech);
      speechRef.current = speech;
      setPlayCount(playCount + 1);
    }
  }, [message, isBot, isSpeechOn, playCount, speechRate]);

  const toggleSpeech = () => {
    if (isSpeechOn) {
      window.speechSynthesis.cancel();
    }
    setIsSpeechOn(!isSpeechOn);
    setPlayCount(0);
  };

  const cycleSpeechRate = () => {
    const rates = [0.5, 1, 2, 3];
    const currentIndex = rates.indexOf(speechRate);
    const nextIndex = (currentIndex + 1) % rates.length;
    setSpeechRate(rates[nextIndex]);

    if (speechRef.current) {
      speechRef.current.rate = rates[nextIndex];
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(speechRef.current);
      }
    }
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
      <div className={isBot ? 'bot-icon-psy' : 'user-icon-psy'}>
        {isBot ? <Bot /> : <User />}
      </div>
      <div className="message-content">
        <div className="author">{isBot ? 'Dr. PsyCure' : 'You'}</div>
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