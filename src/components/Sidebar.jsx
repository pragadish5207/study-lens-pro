import React, { useState } from 'react';

const Sidebar = ({ 
  isOpen, 
  toggleSidebar, 
  chatHistory, 
  onNewChat, 
  onSelectChat, 
  onOpenSettings,
  onRenameChat,
  onPinChat,
  onDeleteChat
}) => {
  const [showRecent, setShowRecent] = useState(true);
  
  // State for handling the renaming input field
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const handleEditStart = (e, chat) => {
    e.stopPropagation(); // Stops the chat from opening when you click the edit button
    setEditingId(chat.id);
    setEditTitle(chat.title);
  };

  const handleEditSave = (e, id) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onRenameChat(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleEditKeyDown = (e, id) => {
    if (e.key === 'Enter') handleEditSave(e, id);
    if (e.key === 'Escape') setEditingId(null);
  };

  // Sort the history so Pinned chats stay at the very top!
  const sortedHistory = [...chatHistory].sort((a, b) => {
    if (a.pinned === b.pinned) return 0;
    return a.pinned ? -1 : 1; // Pinned goes up
  });

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
            <span>Recent Studies</span>
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
            {sortedHistory && sortedHistory.length > 0 ? (
              sortedHistory.map((chat) => (
                <div key={chat.id} className="history-item-container" style={{ display: 'flex', alignItems: 'center', marginBottom: '4px', paddingRight: '10px' }}>
                  
                  {/* The actual chat button */}
                  <button 
                    className="history-item" 
                    onClick={() => onSelectChat(chat.id)}
                    title={chat.title}
                    style={{ flex: 1, borderLeft: chat.pinned ? '3px solid var(--accent-color)' : '3px solid transparent' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.7 }}>
                      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                    </svg>
                    
                    {/* Switch between text and input field when editing */}
                    {editingId === chat.id ? (
                      <input 
                        type="text" 
                        value={editTitle} 
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => handleEditKeyDown(e, chat.id)}
                        onBlur={(e) => handleEditSave(e, chat.id)}
                        autoFocus
                        style={{ background: 'var(--bg-secondary)', color: 'white', border: '1px solid var(--accent-color)', borderRadius: '4px', padding: '2px 6px', width: '120px', marginLeft: '8px', fontSize: '0.85rem' }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span className="history-title">{chat.title}</span>
                    )}
                  </button>

                  {/* Action Icons (Pin, Edit, Delete) */}
                  <div className="chat-actions" style={{ display: 'flex', gap: '6px' }}>
                    {/* Pin Button */}
                    <button onClick={(e) => { e.stopPropagation(); onPinChat(chat.id); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px', color: chat.pinned ? 'var(--accent-color)' : 'var(--text-secondary)' }} title="Pin Chat">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/></svg>
                    </button>
                    {/* Edit Button */}
                    <button onClick={(e) => handleEditStart(e, chat)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--text-secondary)' }} title="Rename Chat">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                    </button>
                    {/* Delete Button */}
                    <button onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--danger-color)' }} title="Delete Chat">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                    </button>
                  </div>

                </div>
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

        <div className="profile-section">
          <div className="status-indicator online"></div>
          {isOpen && <span className="profile-text">Online Mode</span>}
        </div>
      </div>

    </div>
  );
};

export default Sidebar;