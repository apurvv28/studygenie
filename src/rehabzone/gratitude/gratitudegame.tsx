import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GratitudeForm } from './components/GratitudeForm';
import { GratitudeCard } from './components/GratitudeCard';
import { GratitudeEntry } from './types';
import { getStorageKey } from './utils';
import { Sparkles } from 'lucide-react';

function GratitudeGame() {
  const [todayEntry, setTodayEntry] = useState<GratitudeEntry | null>(null);

  useEffect(() => {
    const storedEntry = localStorage.getItem(getStorageKey());
    if (storedEntry) {
      setTodayEntry(JSON.parse(storedEntry));
    }
  }, []);

  const handleSubmit = (entry: GratitudeEntry) => {
    localStorage.setItem(entry.id, JSON.stringify(entry));
    setTodayEntry(entry);
  };

  return (
    <div className="body">
    <div className="gratitude-container">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="gratitude-header"
      >
        <div className="gratitude-header">
        </div>
      </motion.div>

      {todayEntry ? (
        <GratitudeCard entry={todayEntry} />
      ) : (
        <GratitudeForm onSubmit={handleSubmit} />
      )}
    </div>
    </div>
  );
}

export default GratitudeGame;