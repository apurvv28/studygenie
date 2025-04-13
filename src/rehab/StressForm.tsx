import React, { useState } from 'react';

interface StressFormProps {
  onSubmit: (data: FormData) => void;
}

interface FormData {
  sleepHours: number;
  studyHours: number;
  screenHours: number;
}

const StressForm: React.FC<StressFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    sleepHours: 0,
    studyHours: 0,
    screenHours: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="stress-form">
      <div className='form-group'>
        <label className="form-group-label">Sleep Hours (per day)</label>
        <input
          type="number"
          min="0"
          max="24"
          className="form-group-input"
          value={formData.sleepHours}
          onChange={(e) => setFormData({ ...formData, sleepHours: Number(e.target.value) })}
        />
      </div>

      <div className='form-group'>
        <label className="form-group-label">Study Hours (per day)</label>
        <input
          type="number"
          min="0"
          max="24"
          className="form-group-input"
          value={formData.studyHours}
          onChange={(e) => setFormData({ ...formData, studyHours: Number(e.target.value) })}
        />
      </div>

      <div className='form-group'>
        <label className="form-group-label">Screen Time Hours (per day)</label>
        <input
          type="number"
          min="0"
          max="24"
          className="form-group-input"
          value={formData.screenHours}
          onChange={(e) => setFormData({ ...formData, screenHours: Number(e.target.value) })}
        />
      </div>

      <button
        type="submit"
        className="button"
      >
        Calculate Stress Level
      </button>
    </form>
  );
};

export default StressForm;