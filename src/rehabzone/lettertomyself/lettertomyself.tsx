import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Clock, Calendar, Sparkles, PenTool } from 'lucide-react';
import { generateLetterResponse } from '../lettertomyself/lib/gemini';
import './lettertomyself.css';

type TimeDirection = 'past' | 'future';
type WritingStage = 'choice' | 'writing' | 'response';

const timeOptions = [
  { value: 'past', label: 'Past Self', description: 'Write to your younger self with wisdom and compassion' },
  { value: 'future', label: 'Future Self', description: 'Share your hopes, dreams, and current thoughts with your future self' }
];

function LetterToMyself() {
  const navigate = useNavigate();
  const [timeDirection, setTimeDirection] = useState<TimeDirection | null>(null);
  const [stage, setStage] = useState<WritingStage>('choice');
  const [letter, setLetter] = useState('');
  const [response, setResponse] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateResponse = async () => {
    if (!timeDirection) return;
    
    setIsTyping(true);
    setError(null);
    
    try {
      const aiResponse = await generateLetterResponse(letter, timeDirection);
      
      // Simulate typing effect
      let displayedResponse = '';
      for (let i = 0; i < aiResponse.length; i++) {
        displayedResponse += aiResponse[i];
        setResponse(displayedResponse);
        await new Promise(resolve => setTimeout(resolve, 30));
      }
    } catch (err) {
      setError('Unable to generate response. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = async () => {
    if (letter.trim().length > 0) {
      setStage('response');
      await generateResponse();
    }
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0 }
  };

  const cardVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.5 } },
    hover: { y: -5, transition: { duration: 0.2 } }
  };

  return (
    <div className="letter-container">
      <motion.button 
        className="back-button"
        onClick={() => navigate('/rehabzone')}
        whileHover={{ x: -5 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft />
        <span>Back to Rehab Zone</span>
      </motion.button>

      <AnimatePresence mode="wait">
        {stage === 'choice' && (
          <motion.div
            key="choice"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="choice-container"
          >
            <motion.h1 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="main-title"
            >
              Letter to Myself
            </motion.h1>
            
            <motion.p 
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
              className="subtitle-letter"
            >
              A journey of self-reflection and healing
            </motion.p>

            <div className="time-choices">
              {timeOptions.map((option) => (
                <motion.div
                  key={option.value}
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                  className="time-choice-card"
                  onClick={() => {
                    setTimeDirection(option.value as TimeDirection);
                    setStage('writing');
                  }}
                >
                  {option.value === 'past' ? <Clock className="choice-icon" /> : <Calendar className="choice-icon" />}
                  <h2>{option.label}</h2>
                  <p>{option.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {stage === 'writing' && (
          <motion.div
            key="writing"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="writing-container"
          >
            <motion.div 
              className="paper"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <h2>Dear {timeDirection === 'past' ? 'Past' : 'Future'} Self,</h2>
              <textarea
                value={letter}
                onChange={(e) => setLetter(e.target.value)}
                className='letter-input'
                placeholder={`Write your letter here... Share your thoughts, feelings, and ${
                  timeDirection === 'past' 
                    ? 'wisdom with your younger self' 
                    : 'hopes with your future self'
                }`}
                autoFocus
              />
              <motion.button
                className="ltr-send-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={letter.trim().length === 0}
              >
                <Send className="send-icon" />
                Send Letter
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {stage === 'response' && (
          <motion.div
            key="response"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="response-container"
          >
            <motion.div 
              className="response-paper"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <div className="original-letter">
                <h3>Your Letter:</h3>
                <p>{letter}</p>
              </div>
              
              <motion.div 
                className="response-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h3>Response from your {timeDirection === 'past' ? 'past' : 'future'} self:</h3>
                <div className="response-text">
                  {isTyping && (
                    <motion.div 
                      className="typing-indicator"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Sparkles className="typing-icon" />
                      <span>Writing response...</span>
                    </motion.div>
                  )}
                  {error ? (
                    <div className="error-message">
                      {error}
                    </div>
                  ) : (
                    <p>{response}</p>
                  )}
                </div>
              </motion.div>

              <motion.button
                className="new-letter-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setStage('choice');
                  setLetter('');
                  setResponse('');
                  setTimeDirection(null);
                  setError(null);
                }}
              >
                <PenTool className="new-letter-icon" />
                Write Another Letter
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LetterToMyself;