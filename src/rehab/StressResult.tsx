import React, { useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/stress.css';

interface StressLevels {
  overall: number;
  sleep: number;
  study: number;
  screen: number;
  facial: number;
}

interface StressResultProps {
  stressLevels: StressLevels;
  email: string;
}

const StressResult: React.FC<StressResultProps> = ({ stressLevels, email }) => {
  const getStressLevel = (percentage: number) => {
    if (percentage <= 20) return 'Very Low';
    if (percentage <= 40) return 'Low';
    if (percentage <= 60) return 'Moderate';
    if (percentage <= 80) return 'High';
    return 'Very High';
  };

  const getStressColor = (percentage: number) => {
    if (percentage <= 20) return 'text-blue-500';
    if (percentage <= 40) return 'text-green-500';
    if (percentage <= 60) return 'text-yellow-500';
    if (percentage <= 80) return 'text-orange-500';
    return 'text-red-500';
  };

  useEffect(() => {
    const saveStressData = async () => {
      try {
        const response = await axios.post('http://localhost:5000/Stresstest', {
          email,
          overallStress: stressLevels.overall,
          sleepStress: stressLevels.sleep,
          studyStress: stressLevels.study,
          screenStress: stressLevels.screen,
          faceStress: stressLevels.facial,
        });
        if (response.status === 200) {
          toast.success('Stress test data saved/updated successfully');
        }
      } catch (error) {
        toast.error('Failed to save or update stress test data');
      }
    };

    saveStressData();
  }, [email, stressLevels]);

  return (
    <div className="stress-result-container">
      <ToastContainer position="bottom-right" />
      <h2 className="stress-result-title">Analysis Results</h2>
      
      <div className="overall-result">
        <h3 className="overall-result-title">Overall Stress Level</h3>
        <p className={`overall-result-percentage ${getStressColor(stressLevels.overall)}`}>
          {stressLevels.overall}%
        </p>
        <p className="overall-result-description">
          {getStressLevel(stressLevels.overall)} Stress
        </p>
      </div>

      <div className="detailed-analysis">
        <h3 className="detailed-analysis-title">Detailed Analysis</h3>
        <div className="detailed-analysis-item">
          <span className="detailed-analysis-label">Sleep Stress:</span>
          <span className={`detailed-analysis-percentage ${getStressColor(stressLevels.sleep)}`}>
            {stressLevels.sleep}%
          </span>
        </div>
        <div className="detailed-analysis-item">
          <span className="detailed-analysis-label">Study Stress:</span>
          <span className={`detailed-analysis-percentage ${getStressColor(stressLevels.study)}`}>
            {stressLevels.study}%
          </span>
        </div>
        <div className="detailed-analysis-item">
          <span className="detailed-analysis-label">Screen Time Stress:</span>
          <span className={`detailed-analysis-percentage ${getStressColor(stressLevels.screen)}`}>
            {stressLevels.screen}%
          </span>
        </div>
        <div className="detailed-analysis-item">
          <span className="detailed-analysis-label">Facial Stress:</span>
          <span className={`detailed-analysis-percentage ${getStressColor(stressLevels.facial)}`}>
            {stressLevels.facial}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default StressResult;