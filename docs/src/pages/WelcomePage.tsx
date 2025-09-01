import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/welcome.css';
import NHSLogo from '../assets/NHS_LOGO.jpg';
import DIPPLogo from '../assets/DIPP_Study_logo.png';

/**
 * WelcomePage - splash screen with animated transition
 * - Zoom → Hold → Fadeout phases
 * - Redirects to role selection after animation
 */
export default function WelcomePage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'zooming'|'hold'|'fadeout'>('zooming');

  useEffect(() => {
    // Sequence: zoom → hold → fadeout → navigate
    const t1 = setTimeout(() => {
      setPhase('hold');
      const t2 = setTimeout(() => {
        setPhase('fadeout');
        const t3 = setTimeout(() => {
          navigate('/select-role');
        }, 200);
        return () => clearTimeout(t3);
      }, 2000);
      return () => clearTimeout(t2);
    }, 1000);

    return () => clearTimeout(t1);
  }, [navigate]);

  return (
    <div className={`welcome-screen ${phase}`}>
      <div className="logo-group">
        <img src={NHSLogo} alt="NHS logo" className="logo logo-small" />
        <img src={DIPPLogo} alt="DIPP Study logo" className="logo logo-large" />
      </div>
    </div>
  );
}
