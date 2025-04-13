import React from 'react';
import '../breathe.css';

interface TimerSelectorProps {
  selectedTime: number;
  onTimeSelect: (time: number) => void;
}

const timeOptions = [
  { label: '30 sec', value: 30 },
  { label: '1 min', value: 60 },
  { label: '2 min', value: 120 },
  { label: '5 min', value: 300 },
  { label: '10 min', value: 600 },
  { label: '20 min', value: 1200 },
  { label: '30 min', value: 1800 },
  { label: '1 hr', value: 3600 },
];

export const TimerSelector: React.FC<TimerSelectorProps> = ({ selectedTime, onTimeSelect }) => {
  return (
    <div className="timer-selector">
      {timeOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => onTimeSelect(option.value)}
          className={`timer-button ${selectedTime === option.value ? 'selected' : ''}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};