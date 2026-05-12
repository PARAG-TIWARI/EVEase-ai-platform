import { Link } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import './Assistant.css';

export default function Assistant() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hello! I am your EV.ai Assistant. I can help diagnose battery health, optimize your daily charging habits, or recommend vehicle maintenance. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const newMessages = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    // Mock AI Response
    setTimeout(() => {
      setMessages([...newMessages, { role: 'ai', text: "Based on the telematics data you've provided, I recommend keeping your charge limit to 80% for daily commuting to preserve battery longevity. I have also verified that your nearest CCS2 fast charger is fully operational." }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="assistant-layout">
      <Sidebar />

      <main className="main-content assistant-content">
        <div className="chat-container">
          <div className="chat-header">
            <div>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className="status-dot"></div> EV.ai Intelligent Consultant
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Real-time vehicle diagnostics and advisory</p>
            </div>
            <div className="ai-model-badge">Model: Opus-EV 4.0</div>
          </div>

          <div className="chat-window">
            {messages.map((msg, index) => (
              <div key={index} className={`message-wrapper ${msg.role === 'ai' ? 'ai-wrapper' : 'user-wrapper'}`}>
                {msg.role === 'ai' && (
                  <div className="message-avatar ai-avatar">
                    <i className="fas fa-robot"></i>
                  </div>
                )}
                <div className={`message-bubble ${msg.role === 'ai' ? 'ai-bubble' : 'user-bubble'}`}>
                  {msg.text}
                </div>
                {msg.role === 'user' && (
                  <div className="message-avatar user-avatar">
                    <i className="fas fa-user"></i>
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="message-wrapper ai-wrapper">
                <div className="message-avatar ai-avatar">
                  <i className="fas fa-robot"></i>
                </div>
                <div className="message-bubble ai-bubble typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
          </div>

          <div className="chat-input-area">
            <form onSubmit={handleSend} className="chat-form">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about battery degradation, road trip charging strategies, etc..." 
                className="chat-input"
              />
              <button type="submit" className="chat-submit" disabled={!input.trim()}>
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

