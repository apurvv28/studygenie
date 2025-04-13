import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Target, Brain, Coffee } from 'lucide-react';
import './anxiety.css';

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  points: number;
}

interface DailyGoal {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  impact: number;
}

const mindfulThoughts = [
  "You are stronger than your anxiety",
  "Take a deep breath, you've got this",
  "Every small step counts",
  "You are not your thoughts",
  "This moment shall pass",
  "You are making progress",
  "Celebrate small victories",
];

const dailyGoals: DailyGoal[] = [
  {
    id: 1,
    title: "Digital Detox",
    description: "Take a 2-hour break from social media",
    completed: false,
    impact: 20,
  },
  {
    id: 2,
    title: "Mindful Movement",
    description: "Take a 15-minute walk without your phone",
    completed: false,
    impact: 15,
  },
  {
    id: 3,
    title: "Sleep Schedule",
    description: "Go to bed before 11 PM tonight",
    completed: false,
    impact: 25,
  },
];

const tasks: Task[] = [
  {
    id: 1,
    title: "Breathing Exercise",
    description: "Take 5 deep breaths",
    completed: false,
    points: 10,
  },
  {
    id: 2,
    title: "Gratitude Practice",
    description: "List 3 things you're grateful for",
    completed: false,
    points: 15,
  },
  {
    id: 3,
    title: "Body Scan",
    description: "Do a quick body scan meditation",
    completed: false,
    points: 20,
  },
];

function AnxietyMonsterGame() {
  const navigate = useNavigate();
  const [monsterHealth, setMonsterHealth] = useState(100);
  const [currentThought, setCurrentThought] = useState("");
  const [localTasks, setLocalTasks] = useState(tasks);
  const [localGoals, setLocalGoals] = useState(dailyGoals);
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (monsterHealth < 100) {
        setMonsterHealth(prev => Math.min(prev + 1, 100));
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const showMindfulThought = () => {
    const thought = mindfulThoughts[Math.floor(Math.random() * mindfulThoughts.length)];
    setCurrentThought(thought);
    setTimeout(() => setCurrentThought(""), 3000);
  };

  const completeTask = (taskId: number) => {
    setLocalTasks(prev => prev.map(task => {
      if (task.id === taskId && !task.completed) {
        setMonsterHealth(health => Math.max(0, health - task.points));
        showMindfulThought();
        return { ...task, completed: true };
      }
      return task;
    }));
  };

  const completeGoal = (goalId: number) => {
    setLocalGoals(prev => prev.map(goal => {
      if (goal.id === goalId && !goal.completed) {
        setMonsterHealth(health => Math.max(0, health - goal.impact));
        showMindfulThought();
        return { ...goal, completed: true };
      }
      return goal;
    }));
  };

  const monsterVariants = {
    idle: {
      scale: [1, 1.05, 1],
      rotate: [-1, 1, -1],
      transition: {
        duration: 2,
        repeat: Infinity,
      },
    },
    damage: {
      scale: 0.9,
      rotate: [-5, 5, -5, 5, 0],
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="container-anxiety">
      <button 
        onClick={() => navigate('/rehabzone')}
        className="back-button-monster"
      >
        <ArrowLeft />
        <span>Back to Rehab Zone</span>
      </button>

      <div className="content">
        <motion.div 
          className="header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="title-anxiety">
            Destroy the Anxiety Monster
          </h1>
          <p className="subtitle-anxiety">
            Complete mindful tasks to weaken the monster before it grows too strong
          </p>
        </motion.div>

        <div className="monster-container">
          <motion.div
            className="monster"
            style={{
              backgroundColor: `hsl(${280 - (monsterHealth * 2.8)}, 70%, 50%)`,
            }}
            variants={monsterVariants}
            animate={monsterHealth < 100 ? "damage" : "idle"}
          />
          <div className="health-bar-container">
            <motion.div
              className="health-bar"
              initial={{ width: "100%" }}
              animate={{ width: `${monsterHealth}%` }}
            />
          </div>
          <p className="health-text">
            Monster Health: {monsterHealth}%
          </p>
        </div>

        <AnimatePresence>
          {currentThought && (
            <motion.div
              className="mindful-thought"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <p>{currentThought}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid-container">
          <div className="section">
            <h2 className="section-title">
              <Brain />
              Mindful Tasks
            </h2>
            <div className="task-list">
              {localTasks.map(task => (
                <motion.div
                  key={task.id}
                  className={`task-card ${task.completed ? 'completed' : ''}`}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="task-content">
                    <div className="task-info">
                      <h3>{task.title}</h3>
                      <p>{task.description}</p>
                    </div>
                    <button
                      onClick={() => completeTask(task.id)}
                      disabled={task.completed}
                      className="task-button"
                    >
                      {task.completed ? 'Completed' : 'Complete'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="section">
            <h2 className="section-title">
              <Target />
              Daily Goals
            </h2>
            <div className="task-list">
              {localGoals.map(goal => (
                <motion.div
                  key={goal.id}
                  className={`task-card ${goal.completed ? 'completed' : ''}`}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="task-content">
                    <div className="task-info">
                      <h3>{goal.title}</h3>
                      <p>{goal.description}</p>
                    </div>
                    <button
                      onClick={() => completeGoal(goal.id)}
                      disabled={goal.completed}
                      className="task-button"
                    >
                      {goal.completed ? 'Completed' : 'Complete'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnxietyMonsterGame;