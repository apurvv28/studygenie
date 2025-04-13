import React from 'react';
import { UserCircle2Icon, Brain, Map, Code, Heart, Award, MessageSquare } from 'lucide-react';
import '../styles/about.css';

const About = () => {
  return (
    <div className="about-container">
      {/* Header Section */}
      <header className="about-header">
        
        <h1 className="about-title">About StudyGenie</h1>
        <div className="about-description">
        <a href="/dashboard" className="back-to-dashboard">
        <i className="fas fa-arrow-left"></i> Back to Dashboard   </a>
          <p>
            StudyGenie is an innovative platform designed to transform the learning experience for students 
            stepping into the world of technical education. This AI-driven system is specifically tailored 
            to assist students transitioning from their 10th or 12th grades, a phase where they often face 
            uncertainties about the technical fields they will explore.
          </p>
        </div>
      </header>

      {/* Feature Boxes */}
      <div className="features-container">
        <div className="features-grid">
          {/* NOVA AI */}
          <div className="feature-box">
            <div className="feature-icon">
              <MessageSquare size={28} />
            </div>
            <h3 className="feature-title">NOVA AI</h3>
            <p className="feature-description">
              A standout feature of StudyGenie is its NOVA AI, a chat-based virtual companion that supports 
              students throughout their education. NOVA AI is equipped to handle queries, provide insights, 
              and assist students in overcoming challenges.
            </p>
          </div>

          {/* Machine Learning Model */}
          <div className="feature-box">
            <div className="feature-icon">
              <Brain size={28} />
            </div>
            <h3 className="feature-title">Machine Learning Model</h3>
            <p className="feature-description">
              At the heart of StudyGenie lies its advanced machine learning model, which identifies and 
              predicts each student's unique study style. Recognizing that every student learns differently, 
              StudyGenie offers personalized study recommendations.
            </p>
          </div>

          {/* GenieGuide */}
          <div className="feature-box">
            <div className="feature-icon">
              <Map size={28} />
            </div>
            <h3 className="feature-title">GenieGuide</h3>
            <p className="feature-description">
              Another groundbreaking feature is GenieGuide, an AI-powered roadmap generator that helps 
              students navigate various technical subjects. By providing structured paths and step-by-step 
              guidance, GenieGuide ensures clarity for every educational endeavour.
            </p>
          </div>

          {/* Tech Stack */}
          <div className="feature-box">
            <div className="feature-icon">
              <Code size={28} />
            </div>
            <h3 className="feature-title">Tech Stack</h3>
            <p className="feature-description">
              The platform is built using a robust tech stack, including MERN (MongoDB, Express.js, React.js, Node.js) 
              for seamless interactivity and Python libraries like Pandas, NumPy, OpenCV, Dlib, FastAPI, and 
              Scikit-Learn for advanced analytics and AI functionalities.
            </p>
          </div>

          {/* Mental Health Integration */}
          <div className="feature-box">
            <div className="feature-icon">
              <Heart size={28} />
            </div>
            <h3 className="feature-title">Mental Health Integration</h3>
            <p className="feature-description">
              Understanding the growing concerns around mental health in academics, StudyGenie also integrates 
              stress detection and rehabilitation mechanisms. By using facial recognition and survey-driven insights, 
              the platform identifies stress levels and offers actionable solutions.
            </p>
          </div>

          {/* Hackathon Inspiration */}
          <div className="feature-box">
            <div className="feature-icon">
              <Award size={28} />
            </div>
            <h3 className="feature-title">Hackathon Inspiration</h3>
            <p className="feature-description">
              Inspired by problem statements from various different Hackathons, StudyGenie addresses critical 
              challenges faced by students in the educational sector. It is designed not just to provide academic 
              support but also to foster resilience and confidence.
            </p>
          </div>
        </div>
      </div>

      {/* Developers Section */}
      <div className="developers-section">
        <div className="developers-container">
          <h2 className="developers-title">Developed By</h2>
          <div className="developers-grid">
            {[
              "Apurv Saktepar",
              "Nisha Pragane",
              "Viraj Desai",
              "Vaishnavi Thorbole"
            ].map((developer, index) => (
              <div key={index} className="developer">
                <div className="developer-icon">
                  <UserCircle2Icon size={36} />
                </div>
                <p className="developer-name">{developer}</p>
              </div>
            ))}
          </div>
          <p className="developers-note">All are third-year students of Government Polytechnic, Pune.</p>
          
          {/* Social Media Icons */}
            <div className="social-media-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://www.snapchat.com/add/vaish_t2242?share_id=JnBe3vtzA-0&locale=en-GB" target="_blank" rel="noopener noreferrer" className="social-icon">
                <i className="fab fa-snapchat-ghost"></i>
            </a>
            <a href="https://www.instagram.com/apurvvvv.28?igsh=Y2dzdGJ0NXRqd2tq" target="_blank" rel="noopener noreferrer" className="social-icon">
                <i className="fab fa-instagram"></i>
            </a>
            <a href="https://www.linkedin.com/in/nisha-pragane-a056a0290?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="social-icon">
                <i className="fab fa-linkedin-in"></i>
            </a>
            </div>
        </div>
      </div>
    </div>
  );
};

export default About;