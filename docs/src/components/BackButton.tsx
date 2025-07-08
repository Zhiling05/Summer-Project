// docs/src/components/BackButton.tsx
import { useNavigate } from 'react-router-dom';

export default function BackButton() {
  const navigate = useNavigate();
  return (
    <button
      className="back-button"
      style={{
        position: 'fixed',
        top: '70px',   // header 大概 60px 高，再留点空隙
        left: '16px',
        zIndex: 1000,
      }}
      onClick={() => navigate(-1)}
    >
      ← Go back
    </button>
  );
}
