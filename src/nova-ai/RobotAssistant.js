import React, { useState, useEffect, useMemo } from "react";
import "../styles/RobotAssistant.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const RobotAssistant = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  const handleClick = () => {
    // Navigate to the Nova.tsx page
    navigate("/Nova");
  };

  const [message, setMessage] = useState("Hey there, I'm Nova AI.");
  const [visible, setVisible] = useState(true);

  const messages = useMemo(
    () => [
      "Hey there, I'm Nova AI.",
      "I'll help you with all your study-related activities.",
      "Need help? Just ask me!",
      "Let's ace your studies together!"
    ],
    []
  );

  useEffect(() => {
    // Change messages every 5 seconds
    const interval = setInterval(() => {
      setMessage((prev) => {
        const currentIndex = messages.indexOf(prev);
        const nextIndex = (currentIndex + 1) % messages.length;
        return messages[nextIndex];
      });
    }, 5000);

    return () => clearInterval(interval); // Clean up interval
  }, [messages]); // Include messages in dependencies

  return (
    <div className="robot-container">
      {/* Robot */}
      <div className="robot" onClick={() => setVisible(!visible)}>
      <img
        src="./robot.png"
        alt="Robot"
        className="robot"
        // onClick={() => setVisible(!visible)}
        onClick={handleClick} // Add onClick event to navigate to 
      />
      </div>
      {/* Speech Bubble */}
      {visible && (
        <div className="speech-bubble">
          <p>{message}</p>
        </div>
      )}
    </div>
  );
};

export default RobotAssistant;
