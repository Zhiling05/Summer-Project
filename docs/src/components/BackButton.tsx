// BackButton.tsx
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/theme.css';

interface BackButtonProps {
  className?: string;
}

/**
 * BackButton - provides navigation back behavior
 * - On assessment question pages: goes to the previous question if available, otherwise back to start page
 * - On other pages: simply navigates back in history
 */
export default function BackButton({ className = '' }: BackButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Detect if user is currently in assessment question flow
  const isAssessQuestion = location.pathname.includes('/optometrist/assess/questions/');
  const text = isAssessQuestion ? '← Previous' : '← Go back';

  const onClick = () => {
    if (isAssessQuestion) {
      try {
        const raw = sessionStorage.getItem('questionTrail') || '[]';
        const trail: string[] = JSON.parse(raw);

        if (Array.isArray(trail) && trail.length > 1) {
          trail.pop(); // Remove current question
          const prev = trail[trail.length - 1]; // Get previous question
          sessionStorage.setItem('questionTrail', JSON.stringify(trail));
          sessionStorage.setItem('suppressAssessModalOnce', '1');
          navigate(`/optometrist/assess/questions/${prev}`, { replace: true });
          return;
        }
      } catch (err) {
        console.error("Failed to parse questionTrail:", err);
      }
      // If no previous question, return to start page
      navigate('/optometrist/assess/start-page', { replace: true });
      return;
    }

    // Default: navigate back in history
    navigate(-1);
  };

  return (
    <button className={`back-button ${className}`} onClick={onClick}>
      {text}
    </button>
  );
}
