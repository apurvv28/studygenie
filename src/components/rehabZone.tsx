import { motion } from 'framer-motion';
import '../styles/rehabZone.css';// Import FontAwesome icon
import { useNavigate } from 'react-router-dom';
import { Puzzle as PenTool, BookHeart, Wind, Moon, Ghost, ArrowLeft } from 'lucide-react';

const games = [
  {
      title: 'Letter to Myself',
      image: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&w=400&h=400',
      description: 'Write a letter to your past or future self and receive a thoughtful response',
      path: '/lettertomyself',
      icon: PenTool,
      color: '#FF6B6B'
  },
  {
    title: 'Gratitude Journal',
    image: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=400&h=400',
    description: 'Practice gratitude through journaling',
    path: '/gratitudegame',
    icon: BookHeart,
    color: '#F4C2C2'
  },
  {
    title: 'Breathe with Me',
    image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=400&h=400',
    description: 'Guided breathing exercises for relaxation',
    path: '/breathegame',
    icon: Wind,
    color: '#8CBED6'
  },
  {
    title: 'Destroy the Anxiety Monster',
    image: 'https://images.unsplash.com/photo-1604076913837-52ab5629fba9?auto=format&fit=crop&w=400&h=400',
    description: 'Battle and weaken your anxiety through mindful tasks',
    path: '/anxietymonster',
    icon: Ghost,
    color: '#9B6B9E'
  }
];

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  hover: { scale: 1.05 }
};

const floatingAnimation = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

function RehabZone() {
  const navigate = useNavigate();

  const handleGameClick = (path: string) => {
    console.log(`Navigating to ${path}`);
    navigate(path);
  };
  
  const handleBackClick = () => {
    navigate('/rehab');
  };

  return (
    <div className="container">
      <div className="back-icon" onClick={handleBackClick}>
        <ArrowLeft />
      </div>
      <motion.div
        className="header-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Rehabilitation Zone
        </motion.h1>

        <motion.p
          className="subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Your Journey to Peace and Wellness Begins Here
        </motion.p>
      </motion.div>

      <div className="games-grid">
        {games.map((game, index) => (
          <motion.div
            key={game.title}
            className="game-card"
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            transition={{ delay: index * 0.2 }}
            onClick={() => handleGameClick(game.path)}
            style={{ backgroundColor: `${game.color}15` }}
          >
            <motion.div
              className="game-icon"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              style={{ color: game.color }}
            >
              <game.icon size={40} />
            </motion.div>
            <img
              src={game.image}
              alt={game.title}
              className="game-image"
            />
            <motion.h2
              className="game-title"
              style={{ color: game.color }}
            >
              {game.title}
            </motion.h2>
            <p className="game-description">{game.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default RehabZone;