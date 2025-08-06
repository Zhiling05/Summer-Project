//docs/src/components/Header.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import NHSLogo from '../assets/NHS_LOGO.jpg';
import DIPPLogo from '../assets/DIPP_Study_logo.png';
import HumbugLogo from '../assets/humbug.png';  // 新增 Humbug Logo
import '../styles/header.css';

interface HeaderProps {
  title: string;
  showBack?: boolean; // 可选参数：显示'Go back'按钮
}

export default function Header({
  title,
  showBack = false,
}: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="nhs-header">
      <div className="nhs-header__left">
        <img className="humbug-logo" src={HumbugLogo} alt="Humbug logo" />
        <img className="nhs-logo" src={NHSLogo} alt="NHS logo" />
        <img className="dipp-logo" src={DIPPLogo} alt="DIPP Study logo" />
      </div>

      <div className="nhs-header__center">
        {title}
      </div>

      <div className="nhs-header__right">
        {showBack && (
          <button
            type="button"
            className="nhs-header__back"
            onClick={() => navigate(-1)}
          >
            <span className="back-arrow">←</span> {/* 显示为三角形箭头 */}
          </button>
        )}
      </div>
    </header>
  );
}
