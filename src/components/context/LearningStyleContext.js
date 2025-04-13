import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const LearningStyleContext = createContext(undefined);

export const LearningStyleProvider = ({ children }) => {
  const [learningStyle, setLearningStyle] = useState(null);

  const fetchLearningStyle = async (email) => {
    try {
      const response = await axios.get(`http://localhost:5000/UserStyle/${email}`);
      if (response.status === 200 && response.data.predictedStyle) {
        setLearningStyle(response.data.predictedStyle);
      } else {
        console.error('No learning style found for the user.');
      }
    } catch (error) {
      console.error('Error fetching learning style:', error);
    }
  };

  return (
    <LearningStyleContext.Provider value={{ learningStyle, setLearningStyle, fetchLearningStyle }}>
      {children}
    </LearningStyleContext.Provider>
  );
};

export const useLearningStyle = () => {
  const context = useContext(LearningStyleContext);
  if (!context) {
    throw new Error('useLearningStyle must be used within a LearningStyleProvider');
  }
  return context;
};
