import React, { useState } from 'react';
// We will create the CSS for this later in Phase 3
// import './Sidebar.css'; 

const Sidebar = ({ 
  isOpen, 
  toggleSidebar, 
  chatHistory, 
  onNewChat, 
  onSelectChat, 
  onOpenSettings 
}) => {
  // Local state to handle expanding/collapsing the recent chats section
  const [showRecent, setShowRecent] = useState(true);

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      
      {/* Top Section: Hamburger & Branding */}
      <div className="sidebar-top">
        <button className="menu-btn" onClick={toggleSidebar} title="Collapse Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
        </button>
        {isOpen && <span className="brand-logo">Study-Lens Pro</span>}
      </div>

      {/* New Chat Button */}
      <div className="new-chat-wrapper">
        <button className="new-chat-btn" onClick={onNewChat}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          {isOpen && <span className="new-chat-text">New chat</span>}
        </button>
      </div>

      {/* Middle Section: Chat History */}
      <div className="sidebar-middle">
        {isOpen && (
          <div className="recent-header" onClick={() => setShowRecent(!showRecent)}>
            <span>Recent</span>
            <svg 
              className={`chevron ${showRecent ? 'expanded' : ''}`} 
              width="16" height="16" viewBox="0 0 24 24" fill="currentColor"
            >
              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
            </svg>
          </div>
        )}
        
        {isOpen && showRecent && (
          <div className="chat-history-list">
            {chatHistory && chatHistory.length > 0 ? (
              chatHistory.map((chat) => (
                <button 
                  key={chat.id} 
                  className="history-item" 
                  onClick={() => onSelectChat(chat.id)}
                  title={chat.title}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                  </svg>
                  <span className="history-title">{chat.title}</span>
                </button>
              ))
            ) : (
              <p className="no-history-msg">No recent studies</p>
            )}
          </div>
        )}
      </div>

      {/* Bottom Section: Settings and Help */}
      <div className="sidebar-bottom">
        <button className="bottom-item-btn" onClick={onOpenSettings}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.06-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.73,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.06,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 C9.77,21.83,9.96,22,10.2,22h3.84c0.24,0,0.43-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.49-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
          </svg>
          {isOpen && <span className="bottom-item-text">Settings and help</span>}
        </button>

        {/* Offline/Online Indicator */}
        <div className="profile-section">
          <div className="status-indicator online"></div>
          {isOpen && <span className="profile-text">Online Mode</span>}
        </div>
      </div>

    </div>
  );
};

export default Sidebar;