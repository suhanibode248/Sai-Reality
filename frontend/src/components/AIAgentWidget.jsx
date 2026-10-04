import React, { useState, useRef, useEffect } from 'react';

export default function AIAgentWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [userPreferences, setUserPreferences] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  
  // Track if sound has been played to prevent double-play
  const soundPlayedRef = useRef(false);

  const playPing = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.2);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.2);
    } catch(e) {
      console.warn('Audio play failed', e);
    }
  };

  // Automatically pop up the AI agent after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen && !soundPlayedRef.current) {
        setIsOpen(true);
        playPing();
        soundPlayedRef.current = true;
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Initial Greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          sender: 'ai',
          text: "Hi! I am Vaishu. How can I help you find your dream property today? Please select the type of property you are looking for:"
        }
      ]);
    }
  }, [messages]);

  // Scroll to bottom when messages or typing indicator updates
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, currentStep, isTyping]);

  const addAiMessageWithTyping = (msgObj, delay = 1200) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, msgObj]);
    }, delay);
  };

  const handleOptionClick = (option) => {
    setMessages(prev => [...prev, { sender: 'user', text: option }]);

    if (currentStep === 0) {
      setUserPreferences(prev => ({ ...prev, type: option }));
      setCurrentStep(1);
      addAiMessageWithTyping({ 
        sender: 'ai', 
        text: `Great choice! You are looking for a ${option}. What is your budget?` 
      });
    } 
    else if (currentStep === 1) {
      setUserPreferences(prev => ({ ...prev, budget: option }));
      setCurrentStep(2);
      const type = userPreferences.type || 'property';
      addAiMessageWithTyping({ 
        sender: 'ai', 
        text: `Got it. A ${type} under ${option}. Where would you like it to be located?` 
      });
    }
    else if (currentStep === 2) {
      setUserPreferences(prev => ({ ...prev, location: option }));
      setCurrentStep(3);
      addAiMessageWithTyping({ 
        sender: 'ai', 
        text: `Perfect! Before I show you the matching properties, please enter your Phone Number so our senior agent can send you the brochures directly:` 
      });
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    // Check if we are waiting for phone number
    if (currentStep === 3) {
      // Basic phone validation (at least 7 digits)
      const phoneRegex = /\d{7,}/;
      if (!phoneRegex.test(inputValue)) {
        setMessages(prev => [...prev, { sender: 'user', text: inputValue }]);
        setInputValue('');
        addAiMessageWithTyping({ 
          sender: 'ai', 
          text: `That doesn't look like a valid phone number. Please enter a valid number so we can assist you better.` 
        }, 800);
        return;
      }

      setMessages(prev => [...prev, { sender: 'user', text: inputValue }]);
      setInputValue('');
      setUserPreferences(prev => ({ ...prev, phone: inputValue }));
      setCurrentStep(4);
      
      const type = userPreferences.type || 'property';
      const budget = userPreferences.budget || '';
      const location = userPreferences.location || '';
      
      addAiMessageWithTyping({ 
        sender: 'ai', 
        text: `Thank you! Searching for ${type} properties under ${budget} in ${location}...` 
      });
      
      // Simulate backend search delay
      setTimeout(() => {
         const searchParams = new URLSearchParams(userPreferences).toString();
         addAiMessageWithTyping({
           sender: 'ai',
           text: "I found some great matches for you based on your exact criteria!",
           isLink: true,
           linkUrl: `/projects_all.html?${searchParams}`
         });
      }, 2500);
    } else {
      // If user types randomly during option selection phases
      setMessages(prev => [...prev, { sender: 'user', text: inputValue }]);
      setInputValue('');
      addAiMessageWithTyping({ 
        sender: 'ai', 
        text: `Please select one of the options above, or provide your phone number if requested.` 
      }, 800);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const getOptionsForStep = () => {
    if (currentStep === 0) return ['1 BHK', '2 BHK', '3 BHK', 'Commercial Shop', 'Plot'];
    if (currentStep === 1) return ['Under 50 Lacs', '50 Lacs - 1 Cr', '1 Cr - 2 Cr', 'Above 2 Cr'];
    if (currentStep === 2) return ['Wagholi / Kharadi', 'Viman Nagar / Dhanori', 'Hinjewadi / Wakad', 'Central Pune', 'Any Location'];
    return []; // No options for step 3 (Phone number) and 4 (Results)
  };

  const currentOptions = getOptionsForStep();
  const themeColor = '#0f4c81'; 
  
  const styles = {
    container: {
      position: 'fixed',
      top: '50%',
      right: '30px',
      transform: 'translateY(-50%)',
      zIndex: 999999,
      fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    bubbleBtn: {
      width: '65px',
      height: '65px',
      borderRadius: '50%',
      backgroundColor: themeColor,
      backgroundImage: 'url("/vaishu.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      border: '3px solid white',
      boxShadow: '0 8px 24px rgba(15, 76, 129, 0.4)',
      cursor: 'pointer',
      transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      display: isOpen ? 'none' : 'block',
      transform: 'scale(1)'
    },
    header: {
      background: `linear-gradient(135deg, ${themeColor} 0%, #1e3a8a 100%)`,
      color: 'white',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      zIndex: 10,
      flexShrink: 0
    },
    headerInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    headerAvatarContainer: {
      position: 'relative'
    },
    headerAvatar: {
      width: '45px',
      height: '45px',
      borderRadius: '50%',
      backgroundImage: 'url("/vaishu.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      border: '2px solid rgba(255,255,255,0.8)'
    },
    statusDot: {
      position: 'absolute',
      bottom: '0',
      right: '0',
      width: '12px',
      height: '12px',
      backgroundColor: '#4ade80',
      borderRadius: '50%',
      border: '2px solid white'
    },
    headerText: {
      display: 'flex',
      flexDirection: 'column'
    },
    headerName: {
      fontWeight: '700',
      fontSize: '16px',
      letterSpacing: '0.3px'
    },
    headerStatusText: {
      fontSize: '12px',
      opacity: 0.9,
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    headerActions: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center'
    },
    iconBtn: {
      background: 'rgba(255,255,255,0.15)',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background 0.2s',
      textDecoration: 'none'
    },
    closeBtn: {
      background: 'transparent',
      border: 'none',
      color: 'rgba(255,255,255,0.8)',
      cursor: 'pointer',
      fontSize: '24px',
      padding: 0,
      marginLeft: '5px',
      lineHeight: 1
    },
    messagesContainer: {
      flex: 1,
      padding: '20px',
      overflowY: 'auto',
      backgroundColor: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    messageRowAi: {
      display: 'flex',
      gap: '10px',
      alignItems: 'flex-end',
      maxWidth: '90%'
    },
    smallAvatar: {
      width: '28px',
      height: '28px',
      borderRadius: '50%',
      backgroundImage: 'url("/vaishu.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      flexShrink: 0
    },
    messageBubbleAi: {
      backgroundColor: 'white',
      padding: '14px 18px',
      borderRadius: '20px 20px 20px 4px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
      fontSize: '14.5px',
      lineHeight: '1.5',
      color: '#334155'
    },
    messageBubbleUser: {
      backgroundColor: themeColor,
      color: 'white',
      padding: '14px 18px',
      borderRadius: '20px 20px 4px 20px',
      maxWidth: '80%',
      alignSelf: 'flex-end',
      fontSize: '14.5px',
      lineHeight: '1.5',
      boxShadow: `0 2px 8px rgba(15, 76, 129, 0.25)`
    },
    optionsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      marginTop: '8px',
      paddingLeft: '38px' 
    },
    optionButton: {
      backgroundColor: 'white',
      border: `1.5px solid ${themeColor}`,
      color: themeColor,
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '13.5px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
      boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
    },
    linkButton: {
      display: 'inline-block',
      marginTop: '12px',
      padding: '10px 20px',
      backgroundColor: themeColor,
      color: 'white',
      textDecoration: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      fontSize: '14px',
      textAlign: 'center',
      width: '100%',
      boxSizing: 'border-box'
    },
    inputArea: {
      padding: '15px',
      backgroundColor: 'white',
      borderTop: '1px solid #eee',
      display: currentStep >= 3 && currentStep < 4 ? 'flex' : 'none',
      gap: '10px',
      flexShrink: 0
    },
    input: {
      flex: 1,
      padding: '12px 15px',
      borderRadius: '25px',
      border: '1px solid #ddd',
      outline: 'none',
      fontSize: '14px'
    },
    sendBtn: {
      backgroundColor: themeColor,
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '42px',
      height: '42px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontSize: '16px'
    },
    footer: {
      padding: '12px 20px',
      backgroundColor: 'white',
      borderTop: '1px solid #f1f5f9',
      textAlign: 'center',
      fontSize: '12px',
      color: '#94a3b8',
      display: currentStep === 4 ? 'block' : 'none',
      flexShrink: 0
    },
    typingIndicator: {
      display: 'flex',
      gap: '4px',
      padding: '6px 4px',
      alignItems: 'center'
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes popUp {
            from { opacity: 0; transform: translateY(-50%) scale(0.85); }
            to { opacity: 1; transform: translateY(-50%) scale(1); }
          }
          @keyframes slideUpMobile {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes blink {
            0%, 100% { opacity: 0.2; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.1); }
          }
          .option-btn:hover {
            background-color: ${themeColor} !important;
            color: white !important;
          }
          .typing-dot {
            width: 6px;
            height: 6px;
            background-color: #888;
            border-radius: 50%;
            animation: blink 1.4s infinite both;
          }
          .typing-dot:nth-child(1) { animation-delay: 0s; }
          .typing-dot:nth-child(2) { animation-delay: 0.2s; }
          .typing-dot:nth-child(3) { animation-delay: 0.4s; }

          /* Default Chat Window Desktop */
          .ai-chat-window {
            width: 360px;
            height: 600px;
            max-height: 85vh;
            border-radius: 24px;
            top: 50%;
            right: 30px;
            position: fixed;
            animation: popUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards !important;
          }

          /* Mobile Responsiveness */
          @media (max-width: 600px) {
            .ai-chat-window {
              width: 100vw !important;
              height: 100dvh !important;
              max-height: 100dvh !important;
              top: 0 !important;
              right: 0 !important;
              transform: none !important;
              border-radius: 0 !important;
              box-shadow: none !important;
              animation: slideUpMobile 0.3s ease-out forwards !important;
            }
            .ai-widget-container {
              top: auto !important;
              bottom: 20px !important;
              transform: none !important;
              right: 20px !important;
            }
          }
        `}
      </style>
      <div style={styles.container} className="ai-widget-container">
        {/* Floating Avatar Button */}
        <div 
          style={styles.bubbleBtn} 
          onClick={() => { setIsOpen(true); playPing(); }}
          title="Chat with Vaishu"
        />

        {/* Chat Window */}
        <div 
          className="ai-chat-window"
          style={{
            backgroundColor: '#ffffff',
            boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
            display: isOpen ? 'flex' : 'none',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '1px solid rgba(0,0,0,0.05)',
            zIndex: 9999999
          }}
        >
          <div style={styles.header}>
            <div style={styles.headerInfo}>
              <div style={styles.headerAvatarContainer}>
                <div style={styles.headerAvatar}></div>
                <div style={styles.statusDot}></div>
              </div>
              <div style={styles.headerText}>
                <div style={styles.headerName}>Vaishu</div>
                <div style={styles.headerStatusText}>
                  We typically reply instantly
                </div>
              </div>
            </div>
            
            <div style={styles.headerActions}>
              <a href="https://wa.me/919222445513" target="_blank" rel="noreferrer" style={styles.iconBtn} title="WhatsApp">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                </svg>
              </a>
              <a href="tel:919222445513" style={styles.iconBtn} title="Call Now">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
                </svg>
              </a>
              <button style={styles.closeBtn} onClick={() => setIsOpen(false)} title="Close">
                &times;
              </button>
            </div>
          </div>

          <div style={styles.messagesContainer}>
            <div style={{ textAlign: 'center', fontSize: '11px', color: '#94a3b8', margin: '10px 0' }}>
              Today
            </div>
            
            {messages.map((msg, index) => {
              if (msg.sender === 'ai') {
                return (
                  <div key={index} style={styles.messageRowAi}>
                    <div style={styles.smallAvatar} />
                    <div style={styles.messageBubbleAi}>
                      {msg.isLink ? (
                        <div>
                          {msg.text.split('[Click')[0]}
                          <br />
                          <a href={msg.linkUrl} style={styles.linkButton}>View Matching Properties</a>
                        </div>
                      ) : (
                        msg.text
                      )}
                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={index} style={styles.messageBubbleUser}>
                    {msg.text}
                  </div>
                );
              }
            })}

            {isTyping && (
              <div style={styles.messageRowAi}>
                <div style={styles.smallAvatar} />
                <div style={{...styles.messageBubbleAi, padding: '10px 14px'}}>
                  <div style={styles.typingIndicator}>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              </div>
            )}

            {currentOptions.length > 0 && isOpen && !isTyping && (
              <div style={styles.optionsContainer}>
                {currentOptions.map((opt, idx) => (
                  <button 
                    key={idx} 
                    className="option-btn"
                    style={styles.optionButton}
                    onClick={() => handleOptionClick(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <div style={styles.inputArea}>
            <input 
              type="text" 
              placeholder="Enter your Phone Number..." 
              style={styles.input}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button style={styles.sendBtn} onClick={handleSend}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path d="M15.854.146a.5.5 0 0 0-.11-.06.5.5 0 0 0-.144-.06.5.5 0 0 0-.18-.02.5.5 0 0 0-.18.02l-15 6a.5.5 0 0 0-.256.772l4.896 5.508 1.488-6.198 6.786-5.43-5.43 6.786-1.576 6.565a.5.5 0 0 0 .195.534.5.5 0 0 0 .573.018l8.5-5.5a.5.5 0 0 0 .227-.478l-1.5-9.5a.5.5 0 0 0-.194-.35z"/>
              </svg>
            </button>
          </div>

          <div style={styles.footer}>
            Powered by Sai Reality AI
          </div>
        </div>
      </div>
    </>
  );
}
