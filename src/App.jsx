import React, { useState, useEffect } from 'react';
import { extractTextFromPDF } from './components/PdfReader';
import { extractTextFromImage } from './components/ImageReader';
import { initEngine, getAIResponse } from './components/Engine'; // Ensure this matches your Engine file
import Sidebar from './components/Sidebar';
import ChatWorkspace from './components/ChatWorkspace';
import BottomControls from './components/BottomControls';
import SettingsDashboard from './components/SettingsDashboard';
import ExamHall from './components/ExamHall';
import './App.css';

// Universal AI Tutor Instructions (Generalized for any student)
const UNIVERSAL_INSTRUCTIONS = `
- You are an expert AI study assistant and tutor.
- Explain every topic clearly, as if teaching a beginner.
- If the user asks for theory, provide a detailed, comprehensive explanation.
- If the user asks for practice, provide 3 levels of questions: Easy, Medium, and Hard.
- Give only one question at a time and verify the answer before moving on.
- NEVER move to the next topic or unit until the user explicitly says "Next topic" or "Next".
`;

function App() {
  // --- UI STATE ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false); // For Exam Hall overlay
  
  // --- CORE CHAT STATE ---
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [status, setStatus] = useState('0'); // Engine loading percentage
  const [isEngineReady, setIsEngineReady] = useState(false);
  const [files, setFiles] = useState([]);
  const [studyMode, setStudyMode] = useState('standard');

  // --- HISTORY STATE ---
  const [chatHistory, setChatHistory] = useState([
    { id: 1, title: 'Exam Planning' },
    { id: 2, title: 'Unit 1: Fundamentals' }
  ]);
  const [currentChatId, setCurrentChatId] = useState(1);

  // --- SETTINGS STATE (Memory & Tracker) ---
  const [memories, setMemories] = useState([]);
  const [progress, setProgress] = useState({
    unit1: 0, unit2: 0, unit3: 0, unit4: 0
  });

  // --- MOCK PAPER STATE (For Tools/Exam Hall) ---
  const [mockPaper, setMockPaper] = useState(null);

  // --- INITIALIZE AI ENGINE ---
  useEffect(() => {
    initEngine((p) => {
      const pct = Math.round(p.progress * 100);
      setStatus(pct.toString());
      if (p.progress === 1) {
        setIsEngineReady(true);
        setStatus("Ready to study");
      }
    });
  }, []);

  // --- SIDEBAR HANDLERS ---
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  
  const handleNewChat = () => {
    const newId = chatHistory.length + 1;
    setChatHistory([{ id: newId, title: 'New Study Session' }, ...chatHistory]);
    setCurrentChatId(newId);
    setMessages([]); // Clear chat for new session
    setFiles([]); // Clear context
  };

  const handleSelectChat = (id) => {
    setCurrentChatId(id);
    // Future update: load messages specific to this session ID
  };

  // --- FILE UPLOAD HANDLER ---
  const handleFileUpload = async (e) => {
    const newFiles = Array.from(e.target.files);
    setStatus("Reading materials... ⏳");
    
    for (let file of newFiles) {
      let text = "";
      if (file.type === "application/pdf") {
        text = await extractTextFromPDF(file);
      } else if (file.type.startsWith("image/")) {
        text = await extractTextFromImage(file);
      }
      setFiles(prev => [...prev, { name: file.name, content: text }]);
    }
    setStatus(isEngineReady ? "Ready to study" : status);
  };

  // --- SEND MESSAGE LOGIC ---
  const handleSend = async () => {
    if (!userInput.trim() || !isEngineReady) return;

    const userMsg = { role: 'user', text: userInput };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setUserInput('');
    setStatus("Thinking...");

    // Prepare context
    const studyContext = files.map(f => f.content).join("\n");
    
    // Dynamic mode injection
    let modeInstructions = UNIVERSAL_INSTRUCTIONS;
    if (studyMode === 'exam') modeInstructions += "\n- EXAM MODE: Focus heavily on high-weightage topics and past paper patterns.";
    if (studyMode === 'revision') modeInstructions += "\n- REVISION MODE: Provide very short, 1-page summaries and bullet points.";
    if (studyMode === 'cheat') modeInstructions += "\n- CHEAT MODE: Give direct, easy-to-understand answers with scoring tips.";

    try {
      // NOTE: Using getAIResponse here. Ensure it matches your Engine.js exports.
      const response = await getAIResponse(userInput, modeInstructions, studyContext);
      setMessages(prev => [...prev, { role: 'bot', text: response }]);
      
      // Auto-progress tracker based on user saying 'next' or 'done'
      if (userInput.toLowerCase().includes('done') || userInput.toLowerCase().includes('next')) {
        setProgress(prev => ({ ...prev, unit1: Math.min(prev.unit1 + 25, 100) }));
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'bot', text: "Error connecting to AI. Please try again." }]);
    } finally {
      setStatus("Ready to study");
    }
  };
  return (
    <div className="app-container">
      {/* --- SIDEBAR COMPONENT --- */}
      <Sidebar 
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        chatHistory={chatHistory}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* --- MAIN WORKSPACE AREA --- */}
      <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        
        {/* Top Header (Useful for Mobile or Collapsed Sidebar) */}
        <header className="mobile-header">
          {!isSidebarOpen && (
            <button className="menu-btn" onClick={toggleSidebar}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
              </svg>
            </button>
          )}
          <span className="mobile-title">Study-Lens Pro</span>
        </header>

        {/* Middle: Chat Messages */}
        <ChatWorkspace 
          messages={messages}
          status={status}
          isEngineReady={isEngineReady}
        />

        {/* Bottom: Inputs & Gemini-Style Controls */}
        <BottomControls 
          userInput={userInput}
          setUserInput={setUserInput}
          handleSend={handleSend}
          isEngineReady={isEngineReady}
          handleFileUpload={handleFileUpload}
          files={files}
          studyMode={studyMode}
          setStudyMode={setStudyMode}
          onOpenTools={() => setIsToolsOpen(true)}
        />
      </div>

      {/* --- OVERLAYS & MODALS --- */}
      
      {/* Settings (Memory Bank & Tracker) */}
      <SettingsDashboard 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        memories={memories}
        setMemories={setMemories}
        progress={progress}
      />

      {/* Tools / Exam Hall Modal */}
      {isToolsOpen && (
        <div className="tools-overlay">
          <div className="tools-modal">
            <div className="tools-header">
              <h2>Exam Hall & Tools</h2>
              <button className="close-btn" onClick={() => setIsToolsOpen(false)} title="Close">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
            <div className="tools-content">
              <ExamHall 
                mockPaper={mockPaper}
                setMockPaper={setMockPaper}
                isEngineReady={isEngineReady}
                files={files}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;