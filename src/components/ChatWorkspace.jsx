import React, { useEffect, useRef } from 'react';

const ChatWorkspace = ({ messages, status, isEngineReady }) => {
  const messagesEndRef = useRef(null);

  // Auto-scroll to the bottom when a new message appears
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chat-workspace">
      {/* Main Chat Area */}
      <div className="chat-container">
        {messages.length === 0 ? (
          // 1. BRANDING FIX: Replaced Gemini greeting with Study-Lens Pro premium greeting
          <div className="empty-state">
            <div className="premium-logo-placeholder">🎯</div>
            <h2 className="greeting-text">
              <span className="premium-text">Welcome to Study-Lens Pro.</span>
            </h2>
            <p className="sub-greeting">Your hybrid AI study environment is ready. Upload materials or ask a question to begin.</p>
          </div>
        ) : (
          // Chat Bubbles
          <div className="messages-list">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`message-wrapper ${msg.role === 'user' ? 'user-message' : 'ai-message'}`}
              >
                {/* 2. ICON FIX: Changed the AI Avatar to a "Lens/Eye" design */}
                {msg.role === 'bot' && (
                  <div className="ai-avatar premium-avatar">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 4C7 4 2.73 7.11 1 12c1.73 4.89 6 8 11 8s9.27-3.11 11-8c-1.73-4.89-6-8-11-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
                    </svg>
                  </div>
                )}
                <div className="message-content">
                  {msg.text}
                </div>
              </div>
            ))}
            {/* Invisible div to help us scroll to the bottom */}
            <div ref={messagesEndRef} />
          </div>
        )}
        
        {/* 3. STATUS FIX: Updated to listen for our new Hybrid Engine status text! */}
        {!isEngineReady ? (
          <div className="engine-status loading">
            <span className="status-dot"></span>
            <span>{status}</span>
          </div>
        ) : status.includes("Thinking") ? ( // Now checks if the word "Thinking" is anywhere in the string!
          <div className="engine-status thinking">
            <span className="status-pulse"></span>
            <span>{status}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ChatWorkspace;