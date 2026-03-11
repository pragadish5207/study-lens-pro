import React, { useEffect, useRef } from 'react';
// import './ChatWorkspace.css'; // We will style this in Phase 3

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
          // Empty State (Gemini Style Greeting)
          <div className="empty-state">
            <h2 className="greeting-text">
              <span className="gradient-text">Hello, Student.</span>
            </h2>
            <p className="sub-greeting">How can I help you study today?</p>
          </div>
        ) : (
          // Chat Bubbles
          <div className="messages-list">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`message-wrapper ${msg.role === 'user' ? 'user-message' : 'ai-message'}`}
              >
                {/* AI Avatar Icon */}
                {msg.role === 'bot' && (
                  <div className="ai-avatar">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
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
        
        {/* Status Indicator (Loading / Thinking) */}
        {!isEngineReady ? (
          <div className="engine-status loading">
            <span className="status-dot"></span>
            <span>{status}</span>
          </div>
        ) : status === "Thinking... 🤔" ? (
          <div className="engine-status thinking">
            <span className="status-pulse"></span>
            <span>Thinking...</span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ChatWorkspace;