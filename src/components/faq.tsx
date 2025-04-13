import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Instagram, Facebook, Linkedin, MessageSquare } from 'lucide-react';
import '../styles/faq.css'; // Import the CSS file

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is StudyGenie?",
      answer: "StudyGenie is an AI-driven educational platform designed to help students transitioning from 10th or 12th grades into technical education. It provides personalized learning experiences, study recommendations, and guidance through various technical subjects."
    },
    {
      question: "How does NOVA AI help students?",
      answer: "NOVA AI is a chat-based virtual companion that supports students by answering queries, providing insights, and helping overcome educational challenges. It serves as a 24/7 learning assistant throughout your educational journey."
    },
    {
      question: "What makes StudyGenie's learning approach unique?",
      answer: "StudyGenie uses an advanced machine learning model that identifies each student's unique study style and provides personalized recommendations. This ensures that learning is tailored to individual needs rather than following a one-size-fits-all approach."
    },
    {
      question: "What is GenieGuide and how does it work?",
      answer: "GenieGuide is an AI-powered roadmap generator that creates structured learning paths for various technical subjects. It provides step-by-step guidance to help students navigate complex topics with clarity and confidence."
    },
    {
      question: "How does StudyGenie address mental health concerns?",
      answer: "StudyGenie integrates stress detection and rehabilitation mechanisms using facial recognition and survey-driven insights. It identifies stress levels and offers actionable solutions to help students maintain good mental health while studying."
    },
    {
      question: "What technologies power StudyGenie?",
      answer: "StudyGenie is built using the MERN stack (MongoDB, Express.js, React.js, Node.js) for the platform interface, and Python libraries like Pandas, NumPy, OpenCV, Dlib, FastAPI, and Scikit-Learn for its advanced analytics and AI functionalities."
    },
    {
      question: "Who developed StudyGenie?",
      answer: "StudyGenie was developed by four third-year students from Government Polytechnic, Pune: Apurv Saktepar, Nisha Pragane, Viraj Desai, and Vaishnavi Thorbole."
    },
    {
      question: "Is StudyGenie suitable for all types of students?",
      answer: "Yes, StudyGenie is designed to adapt to different learning styles and needs. Its personalized approach makes it suitable for various types of learners, especially those transitioning into technical education."
    },
    {
      question: "How can StudyGenie help with career decisions?",
      answer: "By providing structured roadmaps and personalized insights into technical subjects, StudyGenie helps students make informed decisions about their educational and career paths in technical fields."
    },
    {
      question: "What inspired the creation of StudyGenie?",
      answer: "StudyGenie was inspired by problem statements from various hackathons addressing critical challenges in the educational sector. It aims to provide academic support while fostering resilience and confidence in students."
    }
  ];

  return (
    <div className="faq-container">
      {/* Header Section */}
      <header className="faq-header">
        <div className="faq-header-content">
          <HelpCircle size={40} className="faq-icon" />
          <h1 className="faq-title">Frequently Asked Questions</h1>
        </div>
        <div className="faq-description">
          <p>Find answers to common questions about StudyGenie and how it can transform your learning experience.</p>
        </div>
      </header>

      {/* FAQ Section */}
      <div className="faq-section">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <button className="faq-question" onClick={() => toggleQuestion(index)}>
              <span>{faq.question}</span>
              {openIndex === index ? (
                <ChevronUp className="faq-icon" />
              ) : (
                <ChevronDown className="faq-icon" />
              )}
            </button>
            {openIndex === index && (
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contact Section */}
      <div className="faq-contact">
        <div className="faq-contact-content">
          <h2>Still have questions?</h2>
          <p>If you couldn't find the answer to your question, feel free to reach out to our team directly.</p>
          <button className="faq-contact-button">Contact Us</button>
          
          {/* Social Media Links */}
          <div className="faq-social-media">
            <h3>Connect with us on social media</h3>
            <div className="faq-social-icons">
              <a href="https://www.instagram.com/apurvvvv.28?igsh=Y2dzdGJ0NXRqd2tq" target="_blank" rel="noopener noreferrer">
                <Instagram size={32} />
                <span>Instagram</span>
              </a>
              <a href="https://www.snapchat.com/add/vaish_t2242?share_id=JnBe3vtzA-0&locale=en-GB" target="_blank" rel="noopener noreferrer">
                <MessageSquare size={32} />
                <span>Snapchat</span>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <Facebook size={32} />
                <span>Facebook</span>
              </a>
              <a href="https://www.linkedin.com/in/nisha-pragane-a056a0290?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer">
                <Linkedin size={32} />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;