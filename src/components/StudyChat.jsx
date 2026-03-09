import React from 'react';

const StudyChat = ({ messages, userInput, setUserInput, handleSend, isEngineReady }) => {
  return (
    <main className="chat-window">
      <div className="message-area">
        {messages.length === 0 ? (
          <div className="welcome-msg">
            <h2>Welcome, Appu! 🎓</h2>
            <p>I'm ready to teach you like a fresher. Upload your Banking or Taxation II syllabus to begin.</p>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`msg ${m.role}`}>
              <div className="avatar">{m.role === 'user' ? '👤' : '🤖'}</div>
              <div className="text">{m.text}</div>
            </div>
          ))
        )}
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
        <button 
          className="next-topic-btn"
          onClick={() => { setUserInput('Next'); handleSend(); }}
          disabled={!isEngineReady}
        >
          Next Topic ⏭️
        </button>
        <button className="send-btn" onClick={handleSend} disabled={!isEngineReady}>Send</button>
      </div>
    </main>
  );
};

export default StudyChat;