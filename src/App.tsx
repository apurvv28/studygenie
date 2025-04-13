import React, {useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './components/dashboard';
import Login from './pages/login';
import Register from './pages/register';
import About from './components/about';
import RoadMap from './genieguide/RoadmapGenerator';
import Rehab from './rehab/rehab'
import Quiz from './components/studystylequiz';
import Progress from './components/progress';
import Profile from './components/userprofile';
import Nova from './nova-ai/Nova';
import RobotAssistant from './nova-ai/RobotAssistant';
import { LearningStyleProvider } from './components/context/LearningStyleContext';
import PredictedLearningStylePage from './components/predictedlearningpage';
import RehabZone from './components/rehabZone';
import GratitudeGame from './rehabzone/gratitude/gratitudegame';  
import BreatheGame from './rehabzone/breathewithme/BreatheGame';
import AnxietyMonsterGame from './rehabzone/anxiety/AnxietyMonsterGame';
import LetterToMyself from './rehabzone/lettertomyself/lettertomyself';
import Psy from './rehab/PsychiatristConsultation';
import StressMain from './rehab/StressMain';
import FAQ from './components/faq';
import GenieGuide from './genieguide/GenieGuide';
import MindMap from './genieguide/components/MindMap';
import Survey from './components/Survey';
const App: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const pageTitleMap: { [key: string]: string } = {
      '/dashboard': 'Dashboard - StudyGenie',
      '/login': 'Login - StudyGenie',
      '/register': 'Register - StudyGenie',
      '/about': 'About - StudyGenie',
      '/genieguide': 'GenieGuide - StudyGenie',
      '/rehab': 'Student Rehabilitation - StudyGenie',
      '/quiz': 'Study Style Quiz - StudyGenie',
      '/progress': 'Student Progress - StudyGenie',
      '/userprofile': 'Profile - StudyGenie',
      '/nova': 'Nova AI - StudyGenie',
      '/psychiatrist': 'Psychiatrist Consultation - StudyGenie',
      '/predictedlearningstyle': 'Predicted Learning Style - StudyGenie',
      '/rehabzone': 'Rehabilitation Zone - StudyGenie',
      '/gratitudegame': 'Gratitude Journal - StudyGenie',
      '/breathegame': 'Breathe With Me - StudyGenie',
      '/anxietymonster': 'Anxiety Monster - StudyGenie',
      '/lettertomyself': 'Letter to Myself - StudyGenie',
      '/stressmain': 'Stress Analysis - StudyGenie',
      '/faq': 'FAQ - StudyGenie',
      '/roadmap': 'Roadmap - StudyGenie',
      '/mindmap': 'Mindmap - StudyGenie',
      '/survey': 'Survey - StudyGenie'
    };

    const currentPath = location.pathname;
    document.title = pageTitleMap[currentPath] || 'StudyGenie';
  }, [location]);

  const showRobotAssistant = () => {
    const pathsWithRobotAssistant = [
      '/dashboard',
      '/about',
      '/academic',
      '/rehab',
      '/quiz',
      '/genieguide',
      '/progress',
      '/userprofile',
      '/predictedlearningstyle',
      '/rehabZone',
      '/gratitudegame',
      '/breathegame',
      '/psychiatrist',
      '/anxietymonster',
      '/lettertomyself',
      '/stressmain',
      '/faq',
      '/roadmap',
      '/mindmap',
      '/survey'
    ];
    return pathsWithRobotAssistant.includes(location.pathname);
  };

  return (
    <div className="App">
      {showRobotAssistant() && <RobotAssistant />}
      <LearningStyleProvider>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/genieguide" element={<GenieGuide />} />
        <Route path="/roadmap" element={<RoadMap />} />
        <Route path="/mindmap" element={<MindMap />} />
        <Route path="/rehab" element={<Rehab />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/progress" element={<Progress />} />
        <Route path='/userprofile' element={<Profile />} />
        <Route path="/nova" element={<Nova />} />
        <Route path="/predictedlearningstyle" element={<PredictedLearningStylePage />} />
        <Route path="/psychiatrist" element={<Psy/>} />
        <Route path="/rehabZone" element={<RehabZone />} />
        <Route path="/gratitudegame" element={<GratitudeGame />} />
        <Route path="/breathegame" element={<BreatheGame />} />
        <Route path="/anxietymonster" element={<AnxietyMonsterGame />} />
        <Route path="/lettertomyself" element={<LetterToMyself />} />
        <Route path="/stressmain" element={<StressMain />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/survey" element={<Survey/>} />  
      </Routes>
      </LearningStyleProvider>
    </div>
  );
};

const AppWrapper: React.FC = () => (
  <Router>
   
      <App />
    
  </Router>
);

export default AppWrapper;