import React, { useState } from "react";
import Header from '../../components/Header';    // 使用 Header 组件
import { useFontSize } from './FontSizeContext'; // 引用正确路径
import '../../styles/sidebar.css';
import '../../styles/settings.css';
import BackButton from '../../components/BackButton';//zkx

export default function SettingsPage() {
  const { fontSize, setFontSize } = useFontSize(); // 获取当前字体大小和更新方法

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
          Click these buttons to choose your preferred font size:</p>
          <button onClick={() => handleFontSizeChange("13px")}>Small</button>
          <button onClick={() => handleFontSizeChange("18px")}>Medium</button>
          <button onClick={() => handleFontSizeChange("24px")}>Large</button>
        </section>
      </div>
    </div>
  );
}
