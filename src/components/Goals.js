import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../styles/goals.css";

const GoalTracker = () => {
  const [selectedType, setSelectedType] = useState("daily");
  const [goalInput, setGoalInput] = useState("");
  const [goals, setGoals] = useState({ daily: [], weekly: [], monthly: [], yearly: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [editingGoal, setEditingGoal] = useState(null);

  const userEmail = localStorage.getItem("userEmail");

  // Fetch goals from the backend
  const fetchGoals = useCallback(async () => {
    if (!userEmail) return;
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:5000/goals", {
        headers: { "user-email": userEmail },
      });

      const updatedGoals = { ...response.data };
      Object.keys(updatedGoals).forEach((type) => {
        updatedGoals[type] = updatedGoals[type].map((goal) => ({
          ...goal,
          remainingTime: updateRemainingTime(goal),
        }));
      });

      setGoals(updatedGoals);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching goals:", error);
      setMessage("Failed to load goals.");
      setIsLoading(false);
    }
  }, [userEmail]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  // Calculate remaining time for each goal
  const updateRemainingTime = (goal) => {
    const durations = {
      daily: 24 * 60 * 60 * 1000,
      weekly: 7 * 24 * 60 * 60 * 1000,
      monthly: 30 * 24 * 60 * 60 * 1000,
      yearly: 365 * 24 * 60 * 60 * 1000,
    };

    const remainingTime = Math.max(
      0,
      new Date(goal.createdAt).getTime() +
        durations[goal.type] -
        new Date().getTime()
    );
    return remainingTime;
  };

  // Add a new goal
  const addGoal = async () => {
    if (!goalInput) {
      setMessage("Goal cannot be empty.");
      return;
    }

    const newGoal = {
      type: selectedType,
      goal: goalInput,
      createdAt: new Date().toISOString(),
    };

    try {
      setIsLoading(true);
      await axios.post("http://localhost:5000/goals", newGoal, {
        headers: { "user-email": userEmail },
      });
      setGoalInput("");
      fetchGoals();
    } catch (error) {
      console.error("Error adding goal:", error);
      setMessage("Failed to add goal.");
    }
  };

  // Delete a goal
  const deleteGoal = async (goalId) => {
    try {
      await axios.delete(`http://localhost:5000/goals/${goalId}`, {
        headers: { "user-email": userEmail },
      });
      fetchGoals();
      setMessage("Goals Completed and Deleted");
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  // Edit an existing goal
  const editGoal = async () => {
    if (!goalInput || !editingGoal) {
      setMessage("Goal cannot be empty.");
      return;
    }

    try {
      setIsLoading(true);
      await axios.put(`http://localhost:5000/goals/${editingGoal._id}`, { goal: goalInput }, {
        headers: { "user-email": userEmail },
      });
      setGoalInput("");
      setEditingGoal(null);
      fetchGoals();
    } catch (error) {
      console.error("Error editing goal:", error);
      setMessage("Failed to edit goal.");
    }
  };

  // Periodically update remaining time and auto-delete expired goals
  useEffect(() => {
    const intervalId = setInterval(() => {
      setGoals((prevGoals) => {
        const updatedGoals = { ...prevGoals };

        Object.keys(updatedGoals).forEach((type) => {
          updatedGoals[type] = updatedGoals[type].filter((goal) => {
            const remainingTime = updateRemainingTime(goal);
            if (remainingTime <= 0) {
              deleteGoal(goal._id); // Automatically delete expired goal
              return false; // Remove from state
            }
            return true; // Keep goal if not expired
          });
        });

        return updatedGoals;
      });
    }, 1000); // Check every second

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  // Format remaining time for display
  const formatRemainingTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const days = Math.floor(totalSeconds / (24 * 60 * 60));
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="container1">
    <div className="tab-buttons">
      {["daily", "weekly", "monthly", "yearly"].map((type) => (
        <button
          key={type}
          onClick={() => setSelectedType(type)}
          className={`tab-button ${selectedType === type ? "selected" : ""}`}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </button>
      ))}
    </div>

      <textarea
        value={goalInput}
        onChange={(e) => setGoalInput(e.target.value)}
        placeholder={`Enter your ${editingGoal ? "updated" : selectedType} goal here...`}
      />
      <button
        onClick={editingGoal ? editGoal : addGoal}
        className="add-goal-btn"
      >
        {editingGoal ? "Update Goal" : "Add Goal"}
      </button>

      <div className="goals-container">
        {message && <div className="message">{message}</div>}
        <h2>
          {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Goals
        </h2>
        <div className="goals-grid">
          {goals[selectedType].map((goal) => (
            <div key={goal._id} className="goal-card">
              <h3>{goal.goal}</h3>
              <div className="goal-timer">
                Remaining Time: {formatRemainingTime(updateRemainingTime(goal))}
              </div>
              <div className="goal-actions">
                <button
                  className="edit-btn"
                  onClick={() => {
                    setEditingGoal(goal);
                    setGoalInput(goal.goal);
                  }}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => deleteGoal(goal._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GoalTracker;