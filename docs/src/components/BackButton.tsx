// BackButton.tsx
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/backbutton.css';

interface BackButtonProps {
  className?: string;
}

export default function BackButton({ className = '' }: BackButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isAssessQuestion = location.pathname.includes('/optometrist/assess/questions/');
  const text = isAssessQuestion ? 'Previous' : 'Go back';

  const onClick = () => {
    if (isAssessQuestion) {
      try {
        const raw = sessionStorage.getItem('questionTrail') || '[]';
        const trail: string[] = JSON.parse(raw);

        if (Array.isArray(trail) && trail.length > 1) {
          trail.pop();
          const prev = trail[trail.length - 1];
          sessionStorage.setItem('questionTrail', JSON.stringify(trail));
          sessionStorage.setItem('suppressAssessModalOnce', '1');
          navigate(`/optometrist/assess/questions/${prev}`, { replace: true });
          return;
        }
      } catch (err) {
        console.error("Failed to parse questionTrail:", err);
      }
      navigate('/optometrist/assess/start-page', { replace: true });
      return;
    }
    navigate(-1);
  };

  return (
    <button className={`back-button ${className}`} onClick={onClick}>
      <span className="back-arrow">←</span>
      <span className="back-text">{text}</span>
    </button>
  );
}
