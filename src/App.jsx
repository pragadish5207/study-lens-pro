import React, { useState, useEffect } from 'react';
import { extractTextFromPDF } from './components/PdfReader';
import { extractTextFromImage } from './components/ImageReader';
import { initEngine, getAIResponse } from './components/Engine';
import ExamHall from './components/ExamHall';
import StudyChat from './components/StudyChat';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('chat'); // This tracks if we are in 'chat' or 'memory' mode
  const [status, setStatus] = useState('Loading AI Brain (Wait for 100%)...');
  const [files, setFiles] = useState([]);
  const [messages, setMessages] = useState([{ role: 'bot', text: 'Welcome! I am downloading my brain now. Once it reaches 100%, we can start.' }]);
  const [userInput, setUserInput] = useState('');
  const [isEngineReady, setIsEngineReady] = useState(false);
  const [memories, setMemories] = useState([]); // This stores your 'forever' notes
  const [mockPaper, setMockPaper] = useState(null); // This holds the generated Gujarat University style exam

  useEffect(() => {
    initEngine((p) => {
      // This line captures the percentage and updates the UI
      setStatus(`Downloading AI: ${Math.round(p.progress * 100)}%`);
      if (p.progress === 1) {
        setIsEngineReady(true);
        setStatus("Ready to Study");
      }
    });
  }, []);

  const handleSend = async () => {
    if (!userInput.trim() || !isEngineReady) return;
    
    const newMessages = [...messages, { role: 'user', text: userInput }];
    setMessages(newMessages);
    setUserInput('');
    setStatus("Thinking... 🤔");

    const studyContext = files.map(f => f.content).join("\n");
    const aiText = await getAIResponse(newMessages.map(m => ({ role: m.role, content: m.text })), studyContext);
    
    setMessages(prev => [...prev, { role: 'bot', text: aiText }]);
    setStatus("Ready");
  };

  // ... (keep handleFileUpload from previous step)
  const handleFileUpload = async (e) => {
    const newFiles = Array.from(e.target.files);
    setStatus("Reading files... ⏳");
    for (let file of newFiles) {
      let text = file.type === "application/pdf" ? await extractTextFromPDF(file) : await extractTextFromImage(file);
      setFiles(prev => [...prev, { name: file.name, content: text }]);
    }
    setStatus("Ready to Study");
  };

  return (
    <div className="app-container">
     <header>
        <h1>Study-Lens Pro 📚</h1>
        <div className="nav-tabs">
          <button className={activeTab === 'chat' ? 'active' : ''} onClick={() => setActiveTab('chat')}>Study Chat</button>
          <button className={activeTab === 'memory' ? 'active' : ''} onClick={() => setActiveTab('memory')}>Memory Bank 🧠</button>
          <button className={activeTab === 'exam' ? 'active' : ''} onClick={() => setActiveTab('exam')}>Exam Hall 🏛️</button>
        </div>
        {!isEngineReady && (
          <div className="progress-bg">
            <div className="progress-fill" style={{ width: `${status.match(/\d+/)?. [0] || 0}%` }}></div>
          </div>
        )}
      </header>

      {/* This is where the magic happens: Switching the screens */}
      {activeTab === 'chat' ? (
        <StudyChat 
          messages={messages} 
          userInput={userInput} 
          setUserInput={setUserInput} 
          handleSend={handleSend} 
          isEngineReady={isEngineReady} 
        />
      ) : activeTab === 'memory' ? (
        <div className="memory-bank-area">
          <h2>Memory Bank 🧠</h2>
          <div className="memory-input-group">
            <input type="text" placeholder="Type a formula..." id="mem-input" />
            <button onClick={() => {
              const val = document.getElementById('mem-input').value;
              if(val) { setMemories([...memories, val]); document.getElementById('mem-input').value = ''; }
            }}>Save to Memory</button>
          </div>
          <div className="memory-list">
            {memories.map((m, i) => (
              <div key={i} className="memory-item">
                <span>📌 {m}</span>
                <button className="delete-mem-btn" onClick={() => setMemories(memories.filter((_, idx) => idx !== i))}>Remove</button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <ExamHall mockPaper={mockPaper} setMockPaper={setMockPaper} isEngineReady={isEngineReady} />
      )}

      <label className="upload-btn">+ Add Materials<input type="file" multiple onChange={handleFileChange} style={{display: 'none'}}/></label>
    </div>
  );
}

export default App;