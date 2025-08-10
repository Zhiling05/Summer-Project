// components/SkipGuideButton.tsx
import { useNavigate } from 'react-router-dom';

export default function SkipGuideButton({ target = '/assess' }) { //后续页面开发完成后在这里替换路径！！zkx
  const navigate = useNavigate();

  return (
    <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
      <button
        onClick={() => navigate(target)}
        style={{
          background: 'transparent',
          color: '#005eb8',
          border: 'none',
          fontSize: '0.9rem',
          textDecoration: 'underline',
          cursor: 'pointer'
        }}
      >
        Skip Guide
      </button>
    </div>
  );
}
