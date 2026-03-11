import React, { useState } from 'react';
// import './SettingsDashboard.css'; // We will style this in Phase 3

const SettingsDashboard = ({ 
  isOpen, 
  onClose, 
  memories, 
  setMemories, 
  progress 
}) => {
  // Local state to toggle between Memory Bank and Tracker within settings
  const [activeTab, setActiveTab] = useState('memory');
  const [memoryInput, setMemoryInput] = useState('');

  // If the modal isn't open, render nothing
  if (!isOpen) return null;

  const handleSaveMemory = () => {
    if (memoryInput.trim()) {
      setMemories([...memories, { text: memoryInput, isPinned: false }]);
      setMemoryInput('');
    }
  };

  const togglePin = (textToToggle) => {
    setMemories(memories.map(m => 
      m.text === textToToggle ? { ...m, isPinned: !m.isPinned } : m
    ));
  };

  const deleteMemory = (textToDelete) => {
    setMemories(memories.filter(m => m.text !== textToDelete));
  };

  return (
    <div className="settings-overlay">
      <div className="settings-modal">
        {/* Modal Header */}
        <div className="settings-header">
          <h2>Settings & Study Tools</h2>
          <button className="close-btn" onClick={onClose} title="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        {/* Settings Body Layout (Left menu, Right content) */}
        <div className="settings-body">
          <div className="settings-sidebar">
            <button 
              className={activeTab === 'memory' ? 'active' : ''} 
              onClick={() => setActiveTab('memory')}
            >
              🧠 Memory Bank
            </button>
            <button 
              className={activeTab === 'tracker' ? 'active' : ''} 
              onClick={() => setActiveTab('tracker')}
            >
              📊 Syllabus Tracker
            </button>
          </div>

          {/* Content Area */}
          <div className="settings-content">
            
            {/* MEMORY BANK TAB */}
            {activeTab === 'memory' && (
              <div className="memory-section">
                <h3>Memory Bank & Pinned Notes</h3>
                <p className="desc">Save important formulas, rules, or shortcuts here for universal access.</p>
                
                <div className="memory-input-group">
                  <input 
                    type="text" 
                    placeholder="Type a formula or note..." 
                    value={memoryInput}
                    onChange={(e) => setMemoryInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveMemory()}
                  />
                  <button onClick={handleSaveMemory}>Save</button>
                </div>

                <div className="memory-lists">
                  <div className="pinned-list">
                    <h4>📌 Pinned</h4>
                    {memories.filter(m => m.isPinned).length === 0 && <span className="empty-text">No pinned notes.</span>}
                    {memories.filter(m => m.isPinned).map((m, i) => (
                      <div key={`pin-${i}`} className="memory-card pinned">
                        <span>{m.text}</span>
                        <div className="actions">
                          <button onClick={() => togglePin(m.text)}>Unpin</button>
                          <button onClick={() => deleteMemory(m.text)}>❌</button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="standard-list">
                    <h4>🧠 Standard Notes</h4>
                    {memories.filter(m => !m.isPinned).length === 0 && <span className="empty-text">No standard notes.</span>}
                    {memories.filter(m => !m.isPinned).map((m, i) => (
                      <div key={`std-${i}`} className="memory-card">
                        <span>{m.text}</span>
                        <div className="actions">
                          <button onClick={() => togglePin(m.text)}>Pin</button>
                          <button onClick={() => deleteMemory(m.text)}>❌</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SYLLABUS TRACKER TAB */}
            {activeTab === 'tracker' && (
              <div className="tracker-section">
                <h3>Syllabus Progress Tracker</h3>
                <p className="desc">Your automated completion stats based on study sessions.</p>
                
                <div className="unit-grid">
                  {Object.keys(progress).map((unitKey, idx) => (
                    <div key={idx} className="unit-card">
                      <h4>Unit {idx + 1}</h4>
                      <div className="progress-bar-bg">
                        <div 
                          className="progress-bar-fill" 
                          style={{width: `${progress[unitKey]}%`}}
                        ></div>
                      </div>
                      <span className="pct-text">{progress[unitKey]}% Mastered</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsDashboard;