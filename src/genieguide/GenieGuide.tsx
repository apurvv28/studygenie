import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/genieguide.css';
import { 
  Brain, 
  Map, 
  Book, 
  Pencil, 
  Calculator, 
  Globe, 
  Lightbulb,
  Compass,
  GraduationCap,
  Atom
} from 'lucide-react';

function FloatingIcon({ Icon, delay }: { Icon: React.ElementType, delay: number }) {
  return (
    <div 
      className="gg-floating-icon animate-float"
      style={{ 
        animationDelay: `${delay}s`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`
      }}
    >
            <Icon size={32} />
    </div>
  );
}

function OptionCard({ 
  title, 
  icon: Icon, 
  imageUrl,
  description,
  onClick
}: { 
  title: string; 
  icon: React.ElementType;
  imageUrl: string;
  description: string;
  onClick?: () => void;
}) {
  return (
    <div className="gg-card" onClick={onClick}>
      <div className="gg-card-overlay" />
      <div className="gg-card-content">
        <div className="gg-icon-wrapper">
          <Icon className="gg-icon" />
        </div>
        <div className="gg-image-container">
          <div className="gg-image-overlay" />
          <img 
            src={imageUrl} 
            alt={title}
            className="gg-card-image"
          />
        </div>
        <h3 className="gg-card-title">
          {title}
        </h3>
        <p className="gg-card-description">
          {description}
        </p>
      </div>
    </div>
  );
}

function App() {
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const floatingIcons = [
    Book, Pencil, Calculator, Globe, Lightbulb, Compass, GraduationCap, Atom
  ];

  return (
    <div className="gg-app-wrapper">
      {/* Floating Background Icons */}
      {mounted && floatingIcons.map((Icon, index) => (
        <FloatingIcon key={index} Icon={Icon} delay={index * 2} />
      ))}

      {/* Main Content */}
      <div className="gg-content">
        <div className="gg-header animate-fade-in">
          <h1 className="gg-title bg-animate">
            GenieGuide
          </h1>
          <p className="gg-subtitle animate-slide-up">
            "Transform your learning journey with intelligent guidance"
          </p>
        </div>

        <div className="gg-grid">
          <OptionCard
            title="Roadmap Generator"
            icon={Map}
            imageUrl="https://images.unsplash.com/photo-1542626991-cbc4e32524cc?auto=format&fit=crop&q=80&w=1200"
            description="Create personalized learning paths with step-by-step guidance to achieve your goals"
            onClick={() => handleNavigation('/roadmap')}
          />
          <OptionCard
            title="Mindmap Generator"
            icon={Brain}
            imageUrl="https://images.unsplash.com/photo-1565843708714-52ecf69ab81f?auto=format&fit=crop&q=80&w=1200"
            description="Visualize concepts and connections to enhance understanding and retention"
            onClick={() => handleNavigation('/mindmap')}
          />
        </div>
      </div>
    </div>
  );
}

export default App;