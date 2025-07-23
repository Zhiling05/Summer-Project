// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Header from '../../../components/Header';
// import BottomNav from '../../../components/BottomNav';

// export default function GuideHome() {
//   const [selectedCard, setSelectedCard] = useState<string | null>(null);
//   const [hoveredCard, setHoveredCard] = useState<string | null>(null);
//   const navigate = useNavigate();

//   const handleCardClick = (cardType: string) => {
//     setSelectedCard(cardType);
//     console.log(`Selected: ${cardType}`);
//     // 待添加：导航逻辑
//     // if (cardType === 'tutorial') {
//     //   navigate('/tutorial');
//     // } else if (cardType === 'gallery') {
//     //   navigate('/gallery');
//     // }
//   };

//   return (
//     <>
//       <Header title="Guide" />
      
//       <div
//         style={{
//           background: '#f0f4f5',
//           width: '100vw',
//           marginLeft: 'calc(-50vw + 50%)',
//           minHeight: 'calc(100vh - 120px)',
//           boxSizing: 'border-box',
//           paddingTop: '3rem',
//           paddingBottom: 'calc(64px + 2rem)',
//         }}
//       >
//         <div 
//           style={{ 
//             maxWidth: '900px', 
//             margin: '0 auto', 
//             padding: '0 2rem',
//           }}
//         >
//           <div style={{
//             display: 'flex',
//             flexDirection: 'column',
//             gap: '1.5rem',
//           }}>
            
//             {/* App Tutorial */}
//             <div
//               style={{
//                 background: selectedCard === 'tutorial' 
//                   ? 'linear-gradient(135deg, #005eb8 0%, #41b6e6 100%)' 
//                   : hoveredCard === 'tutorial'
//                     ? '#ffffff'
//                     : '#ffffff',
//                 borderRadius: '25px',
//                 padding: '2rem 2.5rem',
//                 cursor: 'pointer',
//                 transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
//                 boxShadow: selectedCard === 'tutorial' 
//                   ? '0 12px 30px rgba(0, 94, 184, 0.3)' 
//                   : hoveredCard === 'tutorial'
//                     ? '0 8px 25px rgba(0, 0, 0, 0.1)'
//                     : '0 4px 15px rgba(0, 0, 0, 0.05)',
//                 transform: selectedCard === 'tutorial' 
//                   ? 'translateY(-5px)' 
//                   : hoveredCard === 'tutorial'
//                     ? 'translateY(-3px)'
//                     : 'translateY(0)',
//                 border: selectedCard === 'tutorial' 
//                   ? '2px solid rgba(255, 255, 255, 0.2)' 
//                   : '2px solid transparent',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '2rem',
//                 position: 'relative',
//                 overflow: 'hidden',
//               }}
//               onClick={() => handleCardClick('tutorial')}
//               onMouseEnter={() => setHoveredCard('tutorial')}
//               onMouseLeave={() => setHoveredCard(null)}
//             >
//               {/* 左侧图标 */}
//               <div style={{
//                 width: '80px',
//                 height: '80px',
//                 background: selectedCard === 'tutorial' 
//                   ? 'rgba(255, 255, 255, 0.2)' 
//                   : 'linear-gradient(135deg, #005eb8 10%, #41b6e6 90%)',
//                 borderRadius: '20px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 flexShrink: 0,
//                 transition: 'all 0.3s ease',
//               }}>
//                 <svg 
//                   width="36" 
//                   height="36" 
//                   viewBox="0 0 24 24" 
//                   fill="none" 
//                   stroke="white" 
//                   strokeWidth="2"
//                   strokeLinecap="round" 
//                   strokeLinejoin="round"
//                 >
//                   <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
//                 </svg>
//               </div>

//               {/* 文字内容 */}
//               <div style={{ flex: 1 }}>
//                 <h2 style={{
//                   fontSize: '1.6rem',
//                   fontWeight: '700',
//                   color: selectedCard === 'tutorial' ? '#ffffff' : '#1a1a1a',
//                   marginBottom: '0.5rem',
//                   lineHeight: '1.3',
//                 }}>
//                   App Tutorial
//                 </h2>
//                 <p style={{
//                   fontSize: '1rem',
//                   color: selectedCard === 'tutorial' ? 'rgba(255, 255, 255, 0.9)' : '#64748b',
//                   margin: 0,
//                   lineHeight: '1.5',
//                 }}>
//                   Learn how to navigate and use all features
//                 </p>
//               </div>

//               {/* 选中指示器 */}
//               {selectedCard === 'tutorial' && (
//                 <div style={{
//                   width: '32px',
//                   height: '32px',
//                   background: 'rgba(255, 255, 255, 0.2)',
//                   borderRadius: '50%',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   flexShrink: 0,
//                 }}>
//                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
//                     <polyline points="20,6 9,17 4,12"/>
//                   </svg>
//                 </div>
//               )}

//               {/* 箭头 */}
//               {selectedCard !== 'tutorial' && (
//                 <div style={{
//                   opacity: hoveredCard === 'tutorial' ? 1 : 0.3,
//                   transition: 'opacity 0.3s ease',
//                 }}>
//                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#005eb8" strokeWidth="2">
//                     <path d="M5 12h14M12 5l7 7-7 7"/>
//                   </svg>
//                 </div>
//               )}
//             </div>

//             {/* Reference Image Gallery */}
//             <div
//               style={{
//                 background: selectedCard === 'gallery' 
//                   ? 'linear-gradient(135deg, #005eb8 0%, #41b6e6 100%)' 
//                   : hoveredCard === 'gallery'
//                     ? '#ffffff'
//                     : '#ffffff',
//                 borderRadius: '25px',
//                 padding: '2rem 2.5rem',
//                 cursor: 'pointer',
//                 transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
//                 boxShadow: selectedCard === 'gallery' 
//                   ? '0 12px 30px rgba(0, 94, 184, 0.3)' 
//                   : hoveredCard === 'gallery'
//                     ? '0 8px 25px rgba(0, 0, 0, 0.1)'
//                     : '0 4px 15px rgba(0, 0, 0, 0.05)',
//                 transform: selectedCard === 'gallery' 
//                   ? 'translateY(-5px)' 
//                   : hoveredCard === 'gallery'
//                     ? 'translateY(-3px)'
//                     : 'translateY(0)',
//                 border: selectedCard === 'gallery' 
//                   ? '2px solid rgba(255, 255, 255, 0.2)' 
//                   : '2px solid transparent',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '2rem',
//                 position: 'relative',
//                 overflow: 'hidden',
//               }}
//               onClick={() => handleCardClick('gallery')}
//               onMouseEnter={() => setHoveredCard('gallery')}
//               onMouseLeave={() => setHoveredCard(null)}
//             >
//               {/* 左侧图标 */}
//               <div style={{
//                 width: '80px',
//                 height: '80px',
//                 background: selectedCard === 'gallery' 
//                   ? 'rgba(255, 255, 255, 0.2)' 
//                   : 'linear-gradient(135deg, #005eb8 10%, #41b6e6 90%)',
//                 borderRadius: '20px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 flexShrink: 0,
//                 transition: 'all 0.3s ease',
//               }}>
//                 <svg 
//                   width="36" 
//                   height="36" 
//                   viewBox="0 0 24 24" 
//                   fill="none" 
//                   stroke="white" 
//                   strokeWidth="2"
//                   strokeLinecap="round" 
//                   strokeLinejoin="round"
//                 >
//                   <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
//                   <circle cx="8.5" cy="8.5" r="1.5"/>
//                   <path d="M21 15l-5-5L5 21"/>
//                 </svg>
//               </div>

//               {/* 文字内容 */}
//               <div style={{ flex: 1 }}>
//                 <h2 style={{
//                   fontSize: '1.6rem',
//                   fontWeight: '700',
//                   color: selectedCard === 'gallery' ? '#ffffff' : '#1a1a1a',
//                   marginBottom: '0.5rem',
//                   lineHeight: '1.3',
//                 }}>
//                   Reference Image Gallery
//                 </h2>
//                 <p style={{
//                   fontSize: '1rem',
//                   color: selectedCard === 'gallery' ? 'rgba(255, 255, 255, 0.9)' : '#64748b',
//                   margin: 0,
//                   lineHeight: '1.5',
//                 }}>
//                   Visual references and diagnostic imaging examples
//                 </p>
//               </div>

//               {/* 选中指示器 */}
//               {selectedCard === 'gallery' && (
//                 <div style={{
//                   width: '32px',
//                   height: '32px',
//                   background: 'rgba(255, 255, 255, 0.2)',
//                   borderRadius: '50%',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   flexShrink: 0,
//                 }}>
//                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
//                     <polyline points="20,6 9,17 4,12"/>
//                   </svg>
//                 </div>
//               )}

//               {/* 箭头 */}
//               {selectedCard !== 'gallery' && (
//                 <div style={{
//                   opacity: hoveredCard === 'gallery' ? 1 : 0.3,
//                   transition: 'opacity 0.3s ease',
//                 }}>
//                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#005eb8" strokeWidth="2">
//                     <path d="M5 12h14M12 5l7 7-7 7"/>
//                   </svg>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <BottomNav />
//     </>
//   );
// }


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