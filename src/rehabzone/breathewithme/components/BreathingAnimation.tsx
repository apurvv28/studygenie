import React from 'react';
import '../breathe.css';
interface BreathingAnimationProps {
  isInhaling: boolean;
}

export const BreathingAnimation: React.FC<BreathingAnimationProps> = ({ isInhaling }) => {
  return (
    <div className={`breathing-container ${isInhaling ? 'inhaling' : 'exhaling'}`}>
      <div className="breathing-circle breathing-circle-outer" />
      <div className="breathing-circle breathing-circle-middle" />
      <div className="breathing-circle breathing-circle-inner">
        <div className="breathing-text">
          {isInhaling ? 'Inhale' : 'Exhale'}
        </div>
      </div>
    </div>
  );
};