import React, { useState } from "react";
import { Send, CheckCircle, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/survey.css"; // Import updated CSS

type Question = {
  id: number;
  text: string;
  options: string[];
};

const questions: Question[] = [
  {
    id: 1,
    text: "How would you rate StudyGenie's learning effectiveness?",
    options: ["Best", "Better", "Good","Need Improvement"],
  },
  {
    id: 2,
    text: "How user-friendly is StudyGenie's interface?",
    options: ["Best", "Better", "Good","Need Improvement"],
  },
  {
    id: 3,
    text: "How would you rate StudyGenie's content quality?",
    options: ["Best", "Better", "Good","Need Improvement"],
  },
  {
    id: 4,
    text: "How satisfied are you with StudyGenie's support system?",
    options: ["Best", "Better", "Good","Need Improvement"],
  },
  {
    id: 5,
    text: "How likely are you to recommend StudyGenie to others?",
    options: ["Often", "Likely", "Not Sure", "Never"],
  },
];

function FeedbackForm() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [detailedFeedback, setDetailedFeedback] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleOptionChange = (questionId: number, option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, detailedFeedback }),
      });

      if (response.ok) {
        setShowPopup(true);
        setAnswers({});
        setDetailedFeedback("");

        // Hide popup after 3.5 seconds
        setTimeout(() => setShowPopup(false), 3500);
      } else {
        alert("Failed to submit feedback.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  return (
    <div className="feedback-container">
      <div className="feedback-box">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120 }}
          className="feedback-text-center"
        >
          <h2>StudyGenie Feedback</h2>
          <p>Help us improve by sharing your experience</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="feedback-space-y-8">
          {questions.map((question) => (
            <div key={question.id} className="feedback-space-y-4 feedback-question">
              <p>{question.text}</p>
              <div className="feedback-options">
                {question.options.map((option) => (
                  <label key={option} className="feedback-label">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option}
                      checked={answers[question.id] === option}
                      onChange={() => handleOptionChange(question.id, option)}
                      className="feedback-input-radio"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="feedback-space-y-4 feedback-textarea-container">
            <label htmlFor="detailed-feedback">Share your detailed feedback</label>
            <textarea
              id="detailed-feedback"
              rows={5}
              className="feedback-textarea"
              placeholder="Please share your thoughts, suggestions, or concerns..."
              value={detailedFeedback}
              onChange={(e) => setDetailedFeedback(e.target.value)}
            />
          </div>

          <motion.button
            type="submit"
            className="feedback-button"
            whileTap={{ scale: 0.9 }} // Popping effect when clicked
          >
            <Send size={20} />
            Submit Feedback
          </motion.button>
        </form>
      </div>

      {/* Animated Popup Message */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="feedback-popup"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <CheckCircle size={40} className="feedback-popup-icon" />
            <p>Feedback Submitted Successfully!</p>
            <p className="feedback-message">
              Your valuable feedback helps fuel our minds to upgrade our app! 🚀
            </p>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FeedbackForm;
