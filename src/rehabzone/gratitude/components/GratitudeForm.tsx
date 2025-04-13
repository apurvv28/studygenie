import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import axios from 'axios';
import { GratitudeEntry } from '../types';
import { isValidEntryTime, formatDate, getStorageKey } from '../utils';
import '../gratitude.css';

interface Props {
  onSubmit: (entry: GratitudeEntry) => void;
}

export const GratitudeForm: React.FC<Props> = ({ onSubmit }) => {
  const [entries, setEntries] = useState<string[]>(['', '', '']);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEntryTime()) {
      setError('Entries can only be made between 9:00 PM and 12:00 AM');
      return;
    }

    if (entries.some(entry => !entry.trim())) {
      setError('Please fill in all three gratitude entries');
      return;
    }

    const entry: GratitudeEntry = {
      id: getStorageKey(),
      date: formatDate(new Date()),
      entries,
      timestamp: Date.now(),
    };

    try {
      await axios.post('http://localhost:5000/api/gratitude', entry);
      onSubmit(entry);
    } catch (error) {
      setError('Error saving gratitude entry');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="gratitude-form"
    >
      <div className="gratitude-header">
        <Heart className="heart-icon" />
        <h2 className="header-title">Today's Gratitude</h2>
        <Sparkles className="floating-sparkle" />
      </div>

      <form onSubmit={handleSubmit}>
        {entries.map((entry, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="form-group"
          >
            <label className="form-label-gratitude">
              I'm grateful for...
            </label>
            <input
              type="text"
              value={entry}
              onChange={(e) => {
                const newEntries = [...entries];
                newEntries[index] = e.target.value;
                setEntries(newEntries);
                setError('');
              }}
              className="form-input-gratitude"
              placeholder={`Gratitude #${index + 1}`}
            />
          </motion.div>
        ))}

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="error-message"
          >
            {error}
          </motion.p>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="submit-button button-shine"
          type="submit"
        >
          Save Today's Gratitude
        </motion.button>
      </form>
    </motion.div>
  );
};