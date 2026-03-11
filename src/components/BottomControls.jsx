import React, { useState } from 'react';
// import './BottomControls.css'; // We will style this in Phase 3

const BottomControls = ({
  userInput,
  setUserInput,
  handleSend,
  isEngineReady,
  handleFileUpload,
  files,
  studyMode,
  setStudyMode,
  onOpenTools
}) => {
  // State to manage the open/close status of the Mode Dropdown
  const [isModeMenuOpen, setIsModeMenuOpen] = useState(false);

  // Universal Study Modes
  const modes = [
    { id: 'standard', label: '⚖️ Standard Mode', desc: 'Detailed, step-by-step explanations.' },
    { id: 'exam', label: '🎯 Exam Mode', desc: 'Focus on high-weightage topics and past papers.' },
    { id: 'revision', label: '⚡ Quick Revision', desc: 'Short summaries and key formulas only.' },
    { id: 'cheat', label: '🔥 Cheat Mode', desc: 'Direct answers and easy scoring tips.' }
  ];

  const currentModeDetails = modes.find(m => m.id === studyMode) || modes[0];

  // Allow sending messages by pressing Enter
  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bottom-controls-wrapper">
      {/* Mini File Shelf (Shows uploaded files above the input) */}
      {files && files.length > 0 && (
        <div className="mini-file-shelf">
          {files.map((f, i) => (
            <span key={i} className="mini-file-chip">
              📄 {f.name}
            </span>
          ))}
        </div>
      )}

      {/* Main Input Area */}
      <div className="input-container">
        <textarea
          className="chat-input"
          placeholder="Ask a question, paste a syllabus, or upload materials..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={!isEngineReady}
          rows={1}
        />
        <button 
          className="send-btn" 
          onClick={handleSend} 
          disabled={!userInput.trim() || !isEngineReady}
          title="Send Message"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>

      {/* Tools and Modes Row (Below the input box) */}
      <div className="action-row">
        <div className="left-actions">
          {/* Tools / Exam Hall Button */}
          <button className="action-icon-btn" onClick={onOpenTools} title="Study Tools & Exam Hall">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.5 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
            </svg>
            <span className="action-label">Tools</span>
          </button>

          {/* Upload File Button */}
          <label className="action-icon-btn" title="Upload Syllabus or Image">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            <span className="action-label">Add PDF/Image</span>
            <input type="file" accept=".pdf,image/*" multiple onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>
        </div>

        {/* Mode Selector Dropdown (Bottom Right) */}
        <div className="right-actions relative">
          <button 
            className={`mode-selector-btn ${studyMode}`}
            onClick={() => setIsModeMenuOpen(!isModeMenuOpen)}
          >
            {currentModeDetails.label}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 10l5 5 5-5z"/>
            </svg>
          </button>

          {isModeMenuOpen && (
            <div className="mode-dropdown-menu">
              {modes.map(mode => (
                <div 
                  key={mode.id} 
                  className={`mode-option ${studyMode === mode.id ? 'active' : ''}`}
                  onClick={() => {
                    setStudyMode(mode.id);
                    setIsModeMenuOpen(false); // Close menu after selecting
                  }}
                >
                  <div className="mode-option-title">{mode.label}</div>
                  <div className="mode-option-desc">{mode.desc}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BottomControls;