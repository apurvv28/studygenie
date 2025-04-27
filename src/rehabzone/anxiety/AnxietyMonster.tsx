import React from 'react';
import { motion } from 'framer-motion';

interface AnxietyMonsterProps {
  health: number;
  takingDamage: boolean;
}

const AnxietyMonster: React.FC<AnxietyMonsterProps> = ({ health, takingDamage }) => {
  const intensity = health / 100;
  const mainColor = health === 0 ? '#FFC0CB' : `hsl(${280 - (health * 2)}, ${70 + (health * 0.3)}%, ${50 - (health * 0.2)}%)`;
  const secondaryColor = health === 0 ? '#FFB6C1' : `hsl(${260 - (health * 2)}, 80%, 40%)`;
  const eyeColor = health === 100 ? '#ff0000' : health === 0 ? '#15803d' : health > 50 ? '#ff7700' : '#ffcc00';
  const speedMultiplier = 0.5 + (intensity * 1.5);
  
  const isHappy = health === 0;
  const isAngry = health === 100;

  const bodyVariants = {
    idle: {
      scale: [1, 1.05, 1],
      rotate: [0, 1, 0, -1, 0],
      y: [0, -5, 0],
      transition: {
        duration: 4 / speedMultiplier,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    damage: {
      scale: [0.9, 1.1, 0.9, 1],
      rotate: [-5, 5, -3, 2, 0],
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const eyeVariants = {
    idle: {
      scaleY: isAngry ? [0.8, 0.3, 0.8] : isHappy ? [1, 0.6, 1] : [1, 0.7, 1],
      transition: {
        duration: 2 / speedMultiplier,
        repeat: Infinity,
        ease: "easeInOut",
        repeatType: "reverse" as const
      }
    },
    damage: {
      scaleY: 0.1,
      transition: { duration: 0.2 }
    }
  };

  const pupilVariants = {
    idle: {
      y: isAngry ? [2, -2, 2] : isHappy ? [0, 2, 0] : [0, 1, 0],
      x: isAngry ? [-2, 2, -2] : isHappy ? [1, -1, 1] : [0, 0, 0],
      scale: isAngry ? 0.8 : isHappy ? 1.2 : 1,
      transition: {
        duration: 2.5 / speedMultiplier,
        repeat: Infinity,
        ease: "easeInOut",
        repeatType: "mirror" as "mirror"
      }
    },
    damage: {
      y: [5, -5, 3, -3, 0],
      x: [-3, 3, -2, 2, 0],
      scale: 0.8,
      transition: { duration: 0.5 }
    }
  };

  const getArmVariants = (i: number) => ({
    idle: {
      rotate: isAngry ? 
        [i % 2 === 0 ? -30 : 30, i % 2 === 0 ? 30 : -30] :
        isHappy ?
        [i % 2 === 0 ? -45 : 45, i % 2 === 0 ? -15 : 15] :
        [i % 2 === 0 ? -20 : 20, i % 2 === 0 ? 20 : -20],
      y: isAngry ?
        [0, i % 2 === 0 ? -15 : 15] :
        isHappy ?
        [0, i % 2 === 0 ? -20 : 20] :
        [0, i % 2 === 0 ? -10 : 10],
      transition: {
        duration: (3 + i * 0.5) / speedMultiplier,
        repeat: Infinity,
        ease: "easeInOut",
        repeatType: "mirror" as const
      }
    },
    damage: {
      rotate: [0, -20, 20, -10, 0],
      y: [-15, 10, -5, 0],
      transition: { duration: 0.5 }
    }
  });

  const getLegVariants = (i: number) => ({
    idle: {
      rotate: isAngry ?
        [i % 2 === 0 ? -10 : 10, i % 2 === 0 ? 10 : -10] :
        isHappy ?
        [i % 2 === 0 ? -15 : 15, i % 2 === 0 ? 15 : -15] :
        [i % 2 === 0 ? -5 : 5, i % 2 === 0 ? 5 : -5],
      y: isAngry ?
        [0, 10] :
        isHappy ?
        [0, -10] :
        [0, 5],
      transition: {
        duration: (2 + i * 0.3) / speedMultiplier,
        repeat: Infinity,
        ease: "easeInOut",
        repeatType: "mirror" as const
      }
    },
    damage: {
      rotate: [0, -10, 10, -5, 0],
      y: [10, -5, 0],
      transition: { duration: 0.5 }
    }
  });

  const mouthVariants = {
    idle: isAngry ? {
      scaleY: [1.2, 1.4, 1.2],
      scaleX: [0.8, 0.9, 0.8],
      y: [-5, -8, -5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    } : isHappy ? {
      scaleY: -1.2,
      scaleX: 1.4,
      y: 10,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    } : {
      scaleY: [1, 1.1, 1],
      scaleX: [1, 0.9, 1],
      transition: {
        duration: 3 / speedMultiplier,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    damage: {
      scaleY: 1.5,
      scaleX: 0.8,
      transition: { duration: 0.3 }
    }
  };

  const particleCount = Math.max(3, Math.floor(health / 10));
  const particles = Array.from({ length: particleCount }, (_, i) => i);
  const arms = [0, 1];
  const legs = [0, 1];

  return (
    <div className="monster-wrapper">
      {particles.map((i) => (
        <motion.div
          key={`particle-${i}`}
          className="anxiety-particle"
          style={{
            backgroundColor: `hsl(${280 - (Math.random() * 40)}, 70%, 60%)`,
            left: `${15 + (i * 15) % 70}%`,
          }}
          initial={{
            y: 0,
            opacity: 0.3 + (Math.random() * 0.7),
            scale: 0.5 + (Math.random() * 0.5)
          }}
          animate={{
            y: [-20 - (Math.random() * 40), -100 - (Math.random() * 50)],
            opacity: [0.7, 0],
            scale: [1, 0.5]
          }}
          transition={{
            duration: 2 + (Math.random() * 3),
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeOut"
          }}
        />
      ))}

      <div className="monster-full-body">
        {/* Arms */}
        {arms.map((i) => (
          <motion.div
            key={`arm-${i}`}
            className={`monster-arm ${i === 0 ? 'left' : 'right'}`}
            style={{ backgroundColor: secondaryColor }}
            custom={i}
            variants={getArmVariants(i)}
            animate={takingDamage ? "damage" : "idle"}
          />
        ))}

        {/* Body */}
        <motion.div
          className="monster-body"
          style={{ 
            backgroundColor: mainColor,
            borderRadius: isAngry ? '30% 30% 50% 50%' : isHappy ? '40% 40% 50% 50%' : '35% 35% 50% 50%'
          }}
          variants={bodyVariants}
          animate={takingDamage ? "damage" : "idle"}
        >
          {/* Face */}
          <div className="monster-face">
            <div className="monster-eyes">
              <div className="monster-eye left">
                <motion.div
                  className="eye-outer"
                  variants={eyeVariants}
                  animate={takingDamage ? "damage" : "idle"}
                >
                  <motion.div
                    className="eye-pupil"
                    style={{ backgroundColor: eyeColor }}
                    variants={pupilVariants}
                    animate={takingDamage ? "damage" : "idle"}
                  />
                </motion.div>
              </div>
              <div className="monster-eye right">
                <motion.div
                  className="eye-outer"
                  variants={eyeVariants}
                  animate={takingDamage ? "damage" : "idle"}
                >
                  <motion.div
                    className="eye-pupil"
                    style={{ backgroundColor: eyeColor }}
                    variants={pupilVariants}
                    animate={takingDamage ? "damage" : "idle"}
                  />
                </motion.div>
              </div>
            </div>

            <motion.div
              className="monster-mouth"
              style={{ 
                backgroundColor: secondaryColor,
                borderRadius: isAngry ? '10% 10% 50% 50%' : isHappy ? '50% 50% 30% 30%' : '30% 30% 50% 50%'
              }}
              variants={mouthVariants}
              animate={takingDamage ? "damage" : "idle"}
            />
          </div>
        </motion.div>

        {/* Legs */}
        {legs.map((i) => (
          <motion.div
            key={`leg-${i}`}
            className={`monster-leg ${i === 0 ? 'left' : 'right'}`}
            style={{ backgroundColor: secondaryColor }}
            custom={i}
            variants={getLegVariants(i)}
            animate={takingDamage ? "damage" : "idle"}
          />
        ))}
      </div>
    </div>
  );
};

export default AnxietyMonster;
