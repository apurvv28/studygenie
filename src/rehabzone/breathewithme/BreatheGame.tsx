import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';
import { BreathingAnimation } from './components/BreathingAnimation';
import { TimerSelector } from './components/TimerSelector';
import './breathe.css';

function App() {
  const [selectedTime, setSelectedTime] = useState(300);
  const [timeRemaining, setTimeRemaining] = useState(selectedTime);
  const [isActive, setIsActive] = useState(false);
  const [isInhaling, setIsInhaling] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const breathingInterval = 4000;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeRemaining(selectedTime);
    setIsInhaling(true);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const playVoiceGuidance = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.src = isInhaling
        ? 'https://storage.googleapis.com/breathwithme/inhale.mp3'
        : 'https://storage.googleapis.com/breathwithme/exhale.mp3';
      audioRef.current.play().catch(console.error);
    }
  }, [isInhaling]);

  useEffect(() => {
    let timer: number;
    if (isActive && timeRemaining > 0) {
      timer = window.setInterval(() => {
        setTimeRemaining((time) => time - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsActive(false);
    }
    return () => clearInterval(timer);
  }, [isActive, timeRemaining]);

  useEffect(() => {
    let breathTimer: number;
    if (isActive) {
      breathTimer = window.setInterval(() => {
        setIsInhaling((prev) => !prev);
      }, breathingInterval);
    }
    return () => clearInterval(breathTimer);
  }, [isActive]);

  useEffect(() => {
    if (isActive) {
      playVoiceGuidance();
    }
  }, [isInhaling, isActive, playVoiceGuidance]);

  return (
    <div className="app-container">
      <audio ref={audioRef} className="hidden" />
      
      <div className="app-content">
        <h1 className="app-title">Breath With Me</h1>
        
        <div className="timer-display">
          {formatTime(timeRemaining)}
        </div>

        <BreathingAnimation isInhaling={isInhaling} />

        <div className="br-controls-container">
          <TimerSelector selectedTime={selectedTime} onTimeSelect={(time) => {
            setSelectedTime(time);
            setTimeRemaining(time);
            resetTimer();
          }} />

          <div className="button-container">
            <button
              onClick={toggleTimer}
              className="button primary-button"
            >
              {isActive ? <Pause size={24} /> : <Play size={24} />}
              {isActive ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={resetTimer}
              className="button secondary-button"
            >
              <RefreshCw size={24} />
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App