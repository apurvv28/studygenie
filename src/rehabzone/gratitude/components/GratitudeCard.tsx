import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Calendar, Star } from 'lucide-react';
import { GratitudeEntry } from '../types';
import '../gratitude.css';
interface Props {
  entry: GratitudeEntry;
}

export const GratitudeCard: React.FC<Props> = ({ entry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="gratitude-card"
    >
      <div className="gratitude-header">
        <div className="header-content">
          <Heart className="heart-icon" />
          <h3 className="header-title">Today's Gratitude</h3>
        </div>
        <div className="date-display">
          <Calendar className="icon-small" />
          <span>{entry.date}</span>
        </div>
      </div>

      <div className="gratitude-entries">
        {entry.entries.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="gratitude-entry"
          >
            <div className="gratitude-entry-content">
              <Star className="icon-small" style={{ color: '#ec4899' }} />
              <p className="entry-text">{item}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};