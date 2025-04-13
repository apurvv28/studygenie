import React from 'react';
import { Upload } from 'lucide-react';
import '../styles/Nova.css';

const FileUpload = ({ onFileUpload }) => {
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="file-upload-container">
      <label className="file-upload-label">
        <div className="file-upload-content">
          <Upload className="upload-icon" />
          <span className="upload-text">
            Drop files to get summarized output
          </span>
          <span className="upload-subtext">
            PDF and text files supported
          </span>
        </div>
        <input
          type="file"
          className="file-upload-input"
          accept=".pdf,.txt,.docx"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};

export default FileUpload;
