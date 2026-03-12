import React, { useEffect, useRef } from 'react';

const ChatWorkspace = ({ messages, status, isEngineReady }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 👈 THE NEW TRANSLATOR: Converts **text** to bold and \n to line breaks!
  const formatText = (text) => {
    if (!text) return null;
    let htmlText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--accent-alt); text-shadow: 0 0 5px rgba(176, 38, 255, 0.2);">$1</strong>') // Makes it bold and glowing purple!
      .replace(/\n/g, '<br />'); // Fixes the spacing so it isn't one giant paragraph
      
    return <span dangerouslySetInnerHTML={{ __html: htmlText }} />;
  };

  return (
    <div className="chat-workspace">
      <div className="chat-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="premium-logo-placeholder">🎯</div>
            <h2 className="greeting-text">
              <span className="premium-text">Welcome to Study-Lens Pro.</span>
            </h2>
            <p className="sub-greeting">Your hybrid AI study environment is ready. Upload materials or ask a question to begin.</p>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`message-wrapper ${msg.role === 'user' ? 'user-message' : 'ai-message'}`}
              >
                {msg.role === 'bot' && (
                  <div className="ai-avatar premium-avatar">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 4C7 4 2.73 7.11 1 12c1.73 4.89 6 8 11 8s9.27-3.11 11-8c-1.73-4.89-6-8-11-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
                    </svg>
                  </div>
                )}
                {/* 👈 USING THE TRANSLATOR HERE */}
                <div className="message-content">
                  {msg.role === 'bot' ? formatText(msg.text) : msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
        
        {!isEngineReady ? (
          <div className="engine-status loading">
            <span className="status-dot"></span>
            <span>{status}</span>
          </div>
        ) : status.includes("Thinking") ? ( 
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