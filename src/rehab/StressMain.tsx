import { useState } from 'react';
import StressForm from '../rehab/StressForm';
import WebcamCapture from '../rehab/WebcamCapture';
import StressResult from '../rehab/StressResult';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/stress.css';

interface StressLevels {
  overall: number;
  sleep: number;
  study: number;
  screen: number;
  facial: number;
}

function App() {
  const [stressLevels, setStressLevels] = useState<StressLevels | null>(null);
  const [facialStress, setFacialStress] = useState<number>(0);
  const email = localStorage.getItem('userEmail');
  if (!email) {
    toast.error('No logged-in user found');
    return null;
  }

  const calculateStressLevels = (formData: any) => {
    // Sleep stress (optimal: 7-9 hours)
    const sleepStress = Math.min(
      Math.abs(8 - formData.sleepHours) * 20,
      100
    );

    // Study stress (optimal: 1-3 hours)
    let studyStress;
    if (formData.studyHours > 3) {
      studyStress = Math.min((formData.studyHours - 3) * 20, 100);
    } else if (formData.studyHours < 1) {
      studyStress = Math.min((1 - formData.studyHours) * 20, 100);
    } else {
      studyStress = 0; // No stress if within the optimal range
    }

    // Screen time stress (optimal: <4 hours)
    const screenStress = Math.min(formData.screenHours * 15, 100);

    // Calculate overall stress
    const overall = Math.round(
      (sleepStress + studyStress + screenStress + facialStress) / 4
    );

    setStressLevels({
      overall,
      sleep: Math.round(sleepStress),
      study: Math.round(studyStress),
      screen: Math.round(screenStress),
      facial: facialStress
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="sub-titles">Input Your Data</h2>
            <StressForm onSubmit={calculateStressLevels} />
          </div>
          
          <div className='webcam-container'>
            <h2 className="sub-titles">Facial Expression Analysis</h2>
            <WebcamCapture onStressDetected={setFacialStress} />
          </div>
        </div>

        {stressLevels && <StressResult stressLevels={stressLevels} email={email} />}
      </div>
    </div>
  );
}

export default App;