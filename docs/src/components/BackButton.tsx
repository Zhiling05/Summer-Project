// docs/src/components/BackButton.tsx
import { useNavigate } from 'react-router-dom';

export default function BackButton() {
  const navigate = useNavigate();
  return (
    <button
      className="back-button"
      style={{
        position: 'absolute', // 改为绝对定位（相对于父容器）
        top: '13%',          // 垂直居中于gap区域
        left: '20%',
        transform: 'translateY(-50%)', // 精确垂直居中
        border: 'none',
        background: 'transparent',
        zIndex: 900, // 低于遮罩层
        padding: '20px 40px',
        fontSize: '25px',  // 增大字体
        fontWeight: '600', // 加粗
        borderRadius: '4px'
      }}
      onClick={() => navigate(-1)}
    >
      ← Go back
    </button>
  );
}
