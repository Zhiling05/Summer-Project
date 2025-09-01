import { useNavigate, useLocation } from 'react-router-dom';
import NHSLogo from '../assets/NHS_LOGO.jpg';
import DIPPLogo from '../assets/DIPP_Study_logo.png';
import HumbugLogo from '../assets/humbug.png';
import '../styles/header.css';
import SideBar from './SideBar'; 

interface HeaderProps {
  title: string;
  showBack?: boolean; // Optional: display back button if true
}

/**
 * Header - Top navigation bar component
 * - Displays NHS, DIPP, and Humbug logos
 * - Shows page title in center
 * - Provides hamburger menu navigation to sidebar
 * - Back button logic exists but is currently disabled
 */
export default function Header({ title }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Show hamburger menu on most pages, except excluded routes
  const shouldShowHamburger = !['/settings', '/contact-us'].includes(location.pathname);

  return (
    <header className="nhs-header">
      <div className="nhs-header__left">
        {shouldShowHamburger && (
          <button
            id="hamburger-menu"
            aria-label="Open navigation"
            className="hamburger-btn"
            onClick={() => navigate('/sidebar')}
          >
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
          </button>
        )}
        <img className="humbug-logo" src={HumbugLogo} alt="Humbug logo" />
        <img className="nhs-logo" src={NHSLogo} alt="NHS logo" />
        <img className="dipp-logo" src={DIPPLogo} alt="DIPP Study logo" />
      </div>

      <div className="nhs-header__center">
        {title}
      </div>

      <div className="nhs-header__right"></div>
      <SideBar />
    </header>
  );
}
