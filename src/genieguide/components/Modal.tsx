import React, { useEffect, useState, useRef } from 'react';
import { X, Brain, Volume2, VolumeX, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { jsPDF } from 'jspdf';
import '../styles/Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  theory: string;
  imageUrl: string;
  loading?: boolean;
  examTips?: string[];
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  theory,
  imageUrl,
  loading = false,
  examTips = [],
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Check if speech synthesis is supported
    if ('speechSynthesis' in window) {
      speechSynthesisRef.current = window.speechSynthesis;
    }
    return () => {
      if (speechSynthesisRef.current && utteranceRef.current) {
        speechSynthesisRef.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      if (speechSynthesisRef.current && utteranceRef.current) {
        speechSynthesisRef.current.cancel();
        setIsSpeaking(false);
      }
      setSpeechError(null); // Clear any error when modal closes
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleSpeech = () => {
    if (!speechSynthesisRef.current) {
      setSpeechError('Speech synthesis is not supported in your browser');
      return;
    }

    if (isSpeaking) {
      // Stop speaking
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
      setSpeechError(null);
    } else {
      // Start speaking
      try {
        // Remove markdown syntax and clean up the text for speech
        const cleanText = theory
          .replace(/[#*`]/g, '') // Remove markdown symbols
          .replace(/\n+/g, ' ') // Replace multiple newlines with space
          .replace(/\s+/g, ' ') // Normalize spaces
          .trim();

        // Split text into smaller chunks if it's too long (max ~4000 characters)
        const maxChunkLength = 4000;
        const textChunks = cleanText.length > maxChunkLength
          ? cleanText.match(new RegExp(`.{1,${maxChunkLength}}(\\s|$)`, 'g')) || []
          : [cleanText];

        utteranceRef.current = new SpeechSynthesisUtterance(textChunks[0]);

        // Configure speech settings
        utteranceRef.current.rate = 0.9;
        utteranceRef.current.pitch = 1.3; // Slightly higher pitch for a teen male voice
        utteranceRef.current.volume = 1;

        // Get available voices and set a teen male voice if available
        const voices = speechSynthesisRef.current.getVoices();
        const preferredVoice = voices.find(voice =>
          (voice.name.toLowerCase().includes('teen') && voice.name.toLowerCase().includes('male')) || // Look for teen male voice
          (voice.name.toLowerCase().includes('male') && voice.lang === 'en-US') // Fallback to general male voice
        );

        if (preferredVoice) {
          utteranceRef.current.voice = preferredVoice;
        } else {
          console.warn('No teen male voice found. Using default voice.');
        }

        utteranceRef.current.onend = () => {
          setIsSpeaking(false);
          setSpeechError(null);
        };

        utteranceRef.current.onerror = (event) => {
          console.error('Speech synthesis error:', event);
          setIsSpeaking(false);
        };

        speechSynthesisRef.current.cancel(); // Cancel any ongoing speech
        speechSynthesisRef.current.speak(utteranceRef.current);
        setIsSpeaking(true);
        setSpeechError(null);
      } catch (error) {
        console.error('Speech synthesis setup error:', error);
        setIsSpeaking(false);
        setSpeechError('An error occurred while setting up speech synthesis');
      }
    }
  };

  const downloadScenarioAsPDF = () => {
    const pdf = new jsPDF();
    const margin = 10;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const textWidth = pageWidth - margin * 2;
    const headerHeight = 20; // Space reserved for the header
    let yPosition = headerHeight + 10; // Initial Y position for content (after header)
  
    // Add the "StudyGenie" header
    const addHeader = (pageNumber: number) => {
      pdf.setFontSize(14);
      pdf.setTextColor(100);
      pdf.text("StudyGenie", margin, 15); // Add "StudyGenie" at the top-left corner
      pdf.setFontSize(10);
      pdf.text(`Page ${pageNumber}`, pageWidth - margin - 20, 15); // Add page number at the top-right corner
      pdf.setDrawColor(200);
      pdf.line(margin, 18, pageWidth - margin, 18); // Add a horizontal line below the header
    };
  
    let pageNumber = 1;
    addHeader(pageNumber); // Add header to the first page
  
    // Add the title
    pdf.setFontSize(16);
    pdf.text(title, margin, yPosition);
    yPosition += 10;
  
    // Add the image if available
    if (imageUrl) {
      const imgWidth = pageWidth - margin * 2; // Fit the image within the page width
      const imgHeight = (imgWidth * 9) / 16; // Maintain a 16:9 aspect ratio
      if (yPosition + imgHeight > pageHeight - margin) {
        pdf.addPage(); // Add a new page if the image doesn't fit
        pageNumber++;
        addHeader(pageNumber); // Add header to the new page
        yPosition = headerHeight + 10; // Reset Y position after adding a new page
      }
      pdf.addImage(imageUrl, 'JPEG', margin, yPosition, imgWidth, imgHeight);
      yPosition += imgHeight + 10; // Add some space after the image
    }
  
    // Add the theory text
    pdf.setFontSize(12);
    const lines = pdf.splitTextToSize(theory, textWidth);
    lines.forEach((line: string) => {
      if (yPosition + 10 > pageHeight - margin) {
        pdf.addPage(); // Add a new page if the text doesn't fit
        pageNumber++;
        addHeader(pageNumber); // Add header to the new page
        yPosition = headerHeight + 10; // Reset Y position after adding a new page
      }
      pdf.text(line, margin, yPosition);
      yPosition += 10; // Line height
    });
  
    // Save the PDF
    pdf.save(`${title.replace(/\s+/g, '_')}_Scenario.pdf`);
  };

  if (!isOpen) return null;

  const formattedTheory = theory.split('\n\n').map((paragraph, index) => {
    if (paragraph.startsWith('- ')) {
      return paragraph;
    }
    return `${index === 0 ? '' : '\n\n'}${paragraph}`;
  }).join('\n\n');

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <div className="modal-controls">
            <button
              onClick={toggleSpeech}
              className="modal-control-btn"
              title={isSpeaking ? "Stop speaking" : "Start speaking"}
              disabled={loading || !('speechSynthesis' in window)}
            >
              {isSpeaking ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
            <button
              onClick={downloadScenarioAsPDF}
              className="modal-control-btn"
              title="Download Scenario as PDF"
            >
              <Download size={24} />
            </button>
            <button onClick={onClose} className="modal-close">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="mm-modal-content">
          {loading ? (
            <div className="modal-loading">
              <div className="loading-spinner" />
              <p className="loading-text">Generating educational visualization...</p>
            </div>
          ) : (
            <div className="modal-fade-in">
              {speechError && (
                <div className="text-red-500 mb-4 px-4 py-2 bg-red-100 rounded">
                  {speechError}
                </div>
              )}
              <div className="visual-guide">
                <div className="content-wrapper">
                  <img 
                    src={imageUrl} 
                    alt={title} 
                    className="concept-image"
                  />
                  <div className="theory-content">
                    <ReactMarkdown className="theory-text">
                      {formattedTheory}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>

              {examTips && examTips.length > 0 && (
                <div className="exam-cheats">
                  <h3 className="exam-cheats-title">
                    <Brain className="inline-block mr-2" size={20} />
                    Key Takeaways
                  </h3>
                  <div className="cheats-grid">
                    {examTips.map((tip, index) => (
                      <div key={index} className="cheat-card">
                        <span className="cheat-number">{index + 1}</span>
                        <div className="cheat-content">
                          <p className="cheat-text">{tip}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;