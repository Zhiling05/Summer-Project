import React from "react";
import Header from '../../components/Header';
import { useFontSize } from './FontSizeContext';
import '../../styles/sidebar.css';
import '../../styles/settings.css';
import BackButton from '../../components/BackButton';

export default function SettingsPage() {
  const { fontSize, setFontSize } = useFontSize();

  /* Handle font size selection */
  const handleFontSizeChange = (size: "13px" | "18px" | "24px") => {
    setFontSize(size);
  };

  return (
    <div className="settings-page-container" style={{ fontSize }}>
      <Header title="Settings Page" showBack={true} />
      <BackButton />
      <div className="text-content">
        <h1>Settings Page</h1>

        <section>
          <h2>Font Size</h2>
          <p className="font-size-description">
            Click these buttons to choose your preferred font size:
          </p>
          <button onClick={() => handleFontSizeChange("13px")}>Small</button>
          <button onClick={() => handleFontSizeChange("18px")}>Medium</button>
          <button onClick={() => handleFontSizeChange("24px")}>Large</button>
        </section>
      </div>
    </div>
  );
}