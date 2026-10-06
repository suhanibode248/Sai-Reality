import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AIAgentWidget from '../components/AIAgentWidget';
import EMICalculatorModal from '../components/EMICalculatorModal';
import BookVisitModal from '../components/BookVisitModal';
import VirtualTourModal from '../components/VirtualTourModal';

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    // Hide overflow on body to prevent double scrollbars
    document.body.style.overflow = 'hidden';
    document.body.style.margin = '0';
    document.body.style.padding = '0';

    const handleMessage = (e) => {
        if (e.data === 'go_to_login') {
            sessionStorage.removeItem('cp_logged_in');
            sessionStorage.removeItem('cp_user');
            navigate('/login');
        } else if (e.data === 'go_to_dashboard') {
            navigate('/dashboard/leads/all');
        }
    };
    window.addEventListener('message', handleMessage);
    
    return () => {
        window.removeEventListener('message', handleMessage);
        document.body.style.overflow = 'auto'; // Restore on unmount
    };
  }, [navigate]);

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
      <iframe 
          src="/home_clone.html" 
          style={{ width: '100vw', height: '100vh', border: 'none', margin: 0, padding: 0, display: 'block' }} 
          title="Sai Reality Homepage"
      />
      <AIAgentWidget />
      <EMICalculatorModal />
      <BookVisitModal />
      <VirtualTourModal />
    </div>
  );
}

export default Home;
