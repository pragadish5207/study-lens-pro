import React, { useState, useEffect } from 'react';
import { extractTextFromPDF } from './components/PdfReader';
import { extractTextFromImage } from './components/ImageReader';
import { initEngine, getAIResponse } from './components/Engine';
import './App.css';

function App() {
  const [status, setStatus] = useState('Loading AI Brain (Wait for 100%)...');
  const [files, setFiles] = useState([]);
  const [messages, setMessages] = useState([{ role: 'bot', text: 'Welcome! I am downloading my brain now. Once it reaches 100%, we can start.' }]);
  const [userInput, setUserInput] = useState('');
  const [isEngineReady, setIsEngineReady] = useState(false);

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
  <div className="status-container">
    <span className="status-tag">{status}</span>
    {/* This is your new visual progress bar */}
    {!isEngineReady && (
      <div className="progress-bg">
        <div className="progress-fill" style={{ width: status.match(/\d+/) ? `${status.match(/\d+/)[0]}%` : '0%' }}></div>
      </div>
    )}
  </div>
</header>
      <div className="file-shelf">{files.map((f, i) => (<div key={i} className="file-chip">📄 {f.name}</div>))}</div>
      <main className="chat-window">
        <div className="message-area">{messages.map((m, i) => (<div key={i} className={`msg ${m.role}`}>{m.text}</div>))}</div>
        <div className="input-panel">
          <div className="level-selector">
  <button onClick={() => { setUserInput('Give me an Easy sum'); handleSend(); }}>Easy 🟢</button>
  <button onClick={() => { setUserInput('Give me a Medium sum'); handleSend(); }}>Medium 🟡</button>
  <button onClick={() => { setUserInput('Give me a Hard sum'); handleSend(); }}>Hard 🔴</button>
</div>
          <div className="chat-controls">
  <input 
    type="text" 
    className="text-input" 
    placeholder={isEngineReady ? "Ask about your syllabus..." : "Wait for AI to load..."} 
    value={userInput} 
    onChange={(e) => setUserInput(e.target.value)} 
    onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
    disabled={!isEngineReady} 
  />
  {/* This is the new button for your "Next" rule */}
  <button 
    className="next-topic-btn" 
    onClick={() => { setUserInput('Next'); handleSend(); }} 
    disabled={!isEngineReady}
  >
    Next Topic ⏭️
  </button>
  <button className="send-btn" onClick={handleSend} disabled={!isEngineReady}>Send</button>
</div>
          <label className="upload-btn">+ Add Materials<input type="file" multiple onChange={handleFileUpload} hidden /></label>
        </div>
      </main>
    </div>
  );
}

export default App;