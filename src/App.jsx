import React, { useState, useEffect, useRef } from 'react';
import { extractTextFromPDF } from './components/PdfReader';
import { extractTextFromImage } from './components/ImageReader';
import { initEngine, getAIResponse } from './components/Engine';
import ExamHall from './components/ExamHall';
import StudyChat from './components/StudyChat';
import './App.css';

// Feature 3 & 4: Core Personality and Dynamic Rules
const STUDY_TIME_INSTRUCTIONS = `
- Tutor for B.Com Sem 4. Explain like teaching a fresher.
- Theory: Very Hard. Practice: 3 sums (Easy, Med, Hard).
- Give one sum at a time. Verify before next.
- NEVER move to next topic without 'Next' or 'Next Topic' command.
- If Exam Near: Prioritize easy, high-weightage content.
`;

function App() {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState('chat');
  const [status, setStatus] = useState('0'); // Numeric for progress bar
  const [isEngineReady, setIsEngineReady] = useState(false);
  const [isExamNear, setIsExamNear] = useState(false);
  
  // Feature 2: Syllabus Context
  const [files, setFiles] = useState([]);
  
  // Feature 1 & 3: Chat Workspace
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Ready to study! Upload your Banking or Taxation syllabus to start.' }
  ]);
  const [userInput, setUserInput] = useState('');

  // Feature 5, 6 & 11: Memory, Pins, and Revision
  const [memories, setMemories] = useState([]);
  const [pinnedNotes, setPinnedNotes] = useState([]);
  const [revisionSummary, setRevisionSummary] = useState('');

  // Feature 7 & 8: Exam Logic
  const [mockPaper, setMockPaper] = useState(null);

  // Feature 12: Pomodoro Timer State
  const [timer, setTimer] = useState(25 * 60);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Feature 9: Progress Tracking (Units 1-4)
  const [progress, setProgress] = useState({
    unit1: 0, unit2: 0, unit3: 0, unit4: 0
  });

  // --- ENGINE INITIALIZATION ---
  useEffect(() => {
    initEngine((p) => {
      const pct = Math.round(p.progress * 100);
      setStatus(pct.toString());
      if (p.progress === 1) {
        setIsEngineReady(true);
        setStatus("100");
      }
    });
  }, []);

  // --- FEATURE 12: POMODORO LOGIC ---
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else if (timer === 0) {
      clearInterval(interval);
      alert("Break time, Appu! Step away for a bit.");
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  // --- FEATURE 1 & 3: CHAT LOGIC ---
  const handleSend = async () => {
    if (!userInput.trim() || !isEngineReady) return;

    const userMsg = { role: 'user', text: userInput };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setUserInput('');
    setStatus("Thinking... 🤔");

    // Feature 2: Prepare Syllabus Context
    const studyContext = files.map(f => f.content).join("\n");
    
    // Feature 4 & 11: Dynamic Personality Injection
    let systemPrompt = isExamNear 
      ? STUDY_TIME_INSTRUCTIONS + "\n- EXAM MODE: Focus on high-weightage topics." 
      : STUDY_TIME_INSTRUCTIONS;

    const aiMessages = [
      { role: 'system', content: systemPrompt }, 
      ...updatedMessages.map(m => ({
        role: m.role === 'bot' ? 'assistant' : 'user',
        content: m.text
      }))
    ];

    try {
      const response = await engine.chat(aiMessages, studyContext);
      setMessages(prev => [...prev, { role: 'bot', text: response }]);
      
      // Feature 9: Auto-detect progress (Simple keyword check for B.Com Units)
      if (userInput.toLowerCase().includes('done') || userInput.toLowerCase().includes('next')) {
        updateProgress();
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "Error! Let's try that again." }]);
    } finally {
      setStatus(isEngineReady ? "100" : "Ready");
    }
  };

  // --- FEATURE 2 & 10: FILE & IMAGE UPLOAD ---
  const handleFileUpload = async (e) => {
    const newFiles = Array.from(e.target.files);
    setStatus("Reading... ⏳");
    
    for (let file of newFiles) {
      let text = "";
      if (file.type === "application/pdf") {
        text = await extractTextFromPDF(file); // Feature 2
      } else if (file.type.startsWith("image/")) {
        text = await extractTextFromImage(file); // Feature 10: Textbook Explainer
      }
      setFiles(prev => [...prev, { name: file.name, content: text }]);
    }
    setStatus("100");
  };

  // Feature 9: Progress Tracking Logic
  const updateProgress = () => {
    setProgress(prev => ({
      ...prev,
      unit1: Math.min(prev.unit1 + 25, 100) // Simple increment for demo
    }));
  };
// --- RENDER APPLICATION ---
  return (
    <div className="app-container">
      {/* --- TOP NAVIGATION & HEADER --- */}
      <header className="main-header">
        <div className="logo-section">
          <h1>Study-Lens Pro 📚</h1>
          
          {/* Feature 12: Pomodoro Timer UI */}
          <div className="pomodoro-timer">
            <span className="timer-display">
              ⏱️ {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
            </span>
            <button 
              className={`pomodoro-btn ${isTimerActive ? 'active' : ''}`}
              onClick={() => setIsTimerActive(!isTimerActive)}
            >
              {isTimerActive ? 'Pause' : 'Start Focus'}
            </button>
          </div>
        </div>

        {/* AI Loading Bar / Engine Status */}
        {!isEngineReady && (
          <div className="loading-container">
            <span className="pct-text">{status}% Ready</span>
            <div className="progress-bar">
              <div className="fill" style={{width: `${status}%`}}></div>
            </div>
          </div>
        )}

        {/* Main Navigation Tabs */}
        <nav className="nav-pills">
          <button className={activeTab === 'chat' ? 'active' : ''} onClick={() => setActiveTab('chat')}>Study Chat</button>
          <button className={activeTab === 'memory' ? 'active' : ''} onClick={() => setActiveTab('memory')}>Memory 🧠</button>
          <button className={activeTab === 'exam' ? 'active' : ''} onClick={() => setActiveTab('exam')}>Exam Hall 🏛️</button>
          <button className={activeTab === 'progress' ? 'active' : ''} onClick={() => setActiveTab('progress')}>Syllabus Tracker 📊</button>
        </nav>
      </header>

      <section className="workspace">
        {/* --- FEATURE 1 & 2: CHAT AND FILE SHELF --- */}
        {activeTab === 'chat' && (
          <div className="chat-wrapper">
            {/* Feature 2: Visual File Shelf */}
            <div className="file-shelf">
              {files.length > 0 ? (
                files.map((f, i) => (
                  <div key={i} className="file-chip">
                    <span className="file-icon">📄</span>
                    <span className="file-name">{f.name}</span>
                    <button 
                      className="remove-file-btn" 
                      onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                    >×</button>
                  </div>
                ))
              ) : (
                <p className="no-files-msg">Upload Banking or Taxation II syllabus to begin.</p>
              )}
            </div>

            {/* Main Study Chat Component */}
            <StudyChat 
              messages={messages} 
              userInput={userInput} 
              setUserInput={setUserInput} 
              handleSend={handleSend} 
              isEngineReady={isEngineReady} 
            />

            {/* Feature 4 & 10: Gemini-Style Bottom Controls */}
            <div className="bottom-controls">
              <button 
                className={`mode-pill ${isExamNear ? 'exam' : ''}`} 
                onClick={() => setIsExamNear(!isExamNear)}
              >
                {isExamNear ? "🔥 Cheat Mode" : "⚖️ Normal Mode"}
              </button>
              <label className="upload-pill">
                + Add PDF/Image
                <input type="file" accept=".pdf,image/*" multiple onChange={handleFileUpload} style={{display:'none'}}/>
              </label>
              {/* Feature 11: Quick Revision Trigger */}
              <button 
                className="quick-revision-btn" 
                onClick={() => { setUserInput("Give me a 1-page quick revision of the current topic."); handleSend(); }}
                disabled={!isEngineReady}
              >
                ⚡ Quick Revision
              </button>
            </div>
          </div>
        )}

{/* --- FEATURE 5 & 6: MEMORY BANK & PINNED NOTES --- */}
        {activeTab === 'memory' && (
          <div className="memory-bank-area">
            <div className="memory-header">
              <h2>🧠 Memory Bank & Pinned Notes</h2>
              <p>Save complex formulas for Industrial Statistics here.</p>
            </div>
            
            <div className="memory-input-group">
              <input type="text" placeholder="Type a formula, rule, or shortcut..." id="mem-input" />
              <button onClick={() => {
                const val = document.getElementById('mem-input').value;
                if(val) { 
                  // Default new memories to unpinned
                  setMemories([...memories, { text: val, isPinned: false }]); 
                  document.getElementById('mem-input').value = ''; 
                }
              }}>Save to Memory</button>
            </div>

            {/* Feature 6: High-Priority Pinned Notes */}
            <div className="pinned-section">
              <h3 className="section-title">📌 Pinned for Internals</h3>
              {memories.filter(m => m.isPinned).length === 0 && <p className="empty-msg">No pinned notes yet.</p>}
              {memories.filter(m => m.isPinned).map((m, i) => (
                <div key={`pin-${i}`} className="memory-item pinned">
                  <span>{m.text}</span>
                  <div className="mem-actions">
                    <button onClick={() => setMemories(memories.map(item => item.text === m.text ? { ...item, isPinned: false } : item))}>Unpin</button>
                    <button className="del-btn" onClick={() => setMemories(memories.filter(item => item.text !== m.text))}>❌</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Feature 5: Standard Memory List */}
            <div className="standard-section">
              <h3 className="section-title">🧠 General Memories</h3>
              {memories.filter(m => !m.isPinned).map((m, i) => (
                <div key={`mem-${i}`} className="memory-item">
                  <span>{m.text}</span>
                  <div className="mem-actions">
                    <button onClick={() => setMemories(memories.map(item => item.text === m.text ? { ...item, isPinned: true } : item))}>Pin 📌</button>
                    <button className="del-btn" onClick={() => setMemories(memories.filter(item => item.text !== m.text))}>❌</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- FEATURE 7 & 8: GU PAPER MIMIC & PDF EXPORT --- */}
        {activeTab === 'exam' && (
          // Passing 'files' makes it dynamic based on your uploads!
          <ExamHall 
            mockPaper={mockPaper} 
            setMockPaper={setMockPaper} 
            isEngineReady={isEngineReady} 
            files={files} 
          />
        )}

        {/* --- FEATURE 9: SYLLABUS PROGRESS TRACKER --- */}
        {activeTab === 'progress' && (
          <div className="progress-tracker-area">
            <h2>📊 Semester 4 Progress</h2>
            <p>Your completion stats based on study sessions.</p>
            <div className="unit-grid">
              {['unit1', 'unit2', 'unit3', 'unit4'].map((unit, idx) => (
                <div key={idx} className="unit-card">
                  <h3>Unit {idx + 1}</h3>
                  <div className="progress-bar track-bar">
                    <div className="fill" style={{width: `${progress[unit]}%`}}></div>
                  </div>
                  <p className="pct-label">{progress[unit]}% Mastered</p>
                </div>
              ))}
            </div>
          </div>
        )}

</section>
    </div>
  );
}

export default App;