import React, { createContext, useState, useContext } from "react";

// 定义字体大小类型
type FontSizeType = "13px" | "18px" | "24px";

// 创建上下文
const FontSizeContext = createContext<{
  fontSize: FontSizeType;
  setFontSize: React.Dispatch<React.SetStateAction<FontSizeType>>;
} | undefined>(undefined);

// FontSizeProvider 组件
export const FontSizeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontSize, setFontSize] = useState<FontSizeType>("18px"); // 默认字体大小为 16px

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
};

// 自定义 Hook 来访问字体大小和设置方法
export const useFontSize = () => {
  const context = useContext(FontSizeContext);
  if (!context) {
    throw new Error('useFontSize must be used within a FontSizeProvider');
  }
  return context;
};
