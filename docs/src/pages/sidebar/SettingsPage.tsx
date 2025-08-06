import React, { useState } from "react";
import Header from '../../components/Header';    // 使用 Header 组件
import { useFontSize } from './FontSizeContext'; // 引用正确路径

export default function SettingsPage() {
  const { fontSize, setFontSize } = useFontSize(); // 获取当前字体大小和更新方法

  const handleFontSizeChange = (size: "13px" | "18px" | "24px") => {
    setFontSize(size);
  };

  return (
    <div>
      <Header title="Settings Page" showBack={true} /> {/* 使用 Header 中的返回按钮 */}
      <h1>Settings Page</h1>

      <section>
        <h2>Font Size</h2>
        <p>Choose your preferred font size:</p>
        <button onClick={() => handleFontSizeChange("13px")}>Small</button>
        <button onClick={() => handleFontSizeChange("18px")}>Medium</button>
        <button onClick={() => handleFontSizeChange("24px")}>Large</button>
      </section>
    </div>
  );
}
