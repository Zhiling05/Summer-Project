import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "/src/styles/sidebar.css";

/**
 * SideBar - collapsible sidebar navigation
 * - Toggles open/close with hamburger button
 * - Closes automatically when navigating to settings or contact page
 * - Can be closed by clicking outside
 */
const SideBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);

  const specialPages = ["/settings", "/contact-us"];

  useEffect(() => {
    const currentPath = location.pathname;
    const prevPath = prevPathRef.current;

    if (specialPages.includes(currentPath)) {
      setIsOpen(false); // close when entering special page
    } else if (specialPages.includes(prevPath)) {
      setIsOpen(true); // reopen when leaving special page
    }

    prevPathRef.current = currentPath;
  }, [location.pathname]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        isOpen &&
        e.target instanceof HTMLElement &&
        !e.target.closest(".sidebar") &&
        !e.target.closest(".hamburger-btn")
      ) {
        setIsOpen(false);
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [isOpen]);

  const shouldShowHamburger = !specialPages.includes(location.pathname);

  return (
    <>
      {shouldShowHamburger && (
        <button
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
          className={`hamburger-btn ${isOpen ? "active" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>
      )}

      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}

      <nav className={`sidebar ${isOpen ? "open" : ""}`}>
        <ul className="sidebar-links">
          <li><Link to="/settings">Settings</Link></li>
          <li><Link to="/contact-us">Contact Us</Link></li>
        </ul>
      </nav>
    </>
  );
};

export default SideBar;
