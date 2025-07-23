import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header';
import BottomNav from '../../../components/BottomNav';
import '../../../styles/card.css';

export default function GuideHome() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCardClick = (cardType: string) => {
    setSelectedCard(cardType);
    console.log(`Selected: ${cardType}`);
    if (cardType === 'gallery') {
      navigate('gallery');
    } else if (cardType === 'tutorial') {
      navigate('tutorial');
    }
  };

  const cards = [
    {
      id: 'gallery',
      title: 'Reference Image Gallery',
      description: 'Visual references and diagnostic imaging examples for assessment',
      icon: (
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="white" 
          strokeWidth="2"
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <path d="M21 15l-5-5L5 21"/>
        </svg>
      )
    },
    {
      id: 'tutorial',
      title: 'App Tutorial for Optometrists',
      description: 'Learn how to navigate and use all features',
      icon: (
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="white" 
          strokeWidth="2"
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
        </svg>
      )
    }
  ];

  return (
    <>
      <Header title="Guide" />
      
      <div style={{ 
        minHeight: 'calc(100vh - 80px - 64px)', 
        display: 'flex', 
        flexDirection: 'column'
      }}>
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{ 
            maxWidth: '960px', 
            margin: '0 auto', 
            padding: '0 1.5rem',
            width: '100%'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem',
              width: '100%',
              alignItems: 'center'
            }}>
              {cards.map((card) => (
                <div
                  key={card.id}
                  className="base-card"
                  onClick={() => handleCardClick(card.id)}
                  style={{
                    padding: '1.5rem 2rem',
                    width: '80vw',
                    maxWidth: '50rem',
                    minWidth: '20rem'
                  }}
                >
                  <div className="card-content">
                    <h3 className="card-title card-title--with-description">
                      {card.title}
                    </h3>
                    <p className="card-description">
                      {card.description}
                    </p>
                  </div>
                  <div className="card-arrow-container">
                    <div className="card-arrow-circle">
                      {card.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </>
  );
}