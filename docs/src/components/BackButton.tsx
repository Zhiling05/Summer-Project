// backbutton.tsx
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/theme.css';

interface BackButtonProps {
    className?: string;
}

export default function BackButton({ className = '' }: BackButtonProps) {
//     const navigate = useNavigate();
//     return (
//         <button
//             className={`back-button ${className}`}
//             onClick={() => navigate(-1)}
//         >
//             ← Go back
//         </button>
//     );
// }


  const navigate = useNavigate();
  const location = useLocation();
  const isAssessQuestion = location.pathname.includes('/optometrist/assess/questions/');
  const text = isAssessQuestion ? '← Previous' : '← Go back';

      const onClick = () => {
        const path = location.pathname;
        // 仅在题目页生效；其余页面仍用历史回退
        //     if (path.includes('/optometrist/assess/questions/')) {
          if (isAssessQuestion) {
              try {
                    const raw = sessionStorage.getItem('questionTrail') || '[]';
                    const trail: string[] = JSON.parse(raw);
                    if (Array.isArray(trail) && trail.length > 1) {
                          trail.pop();                          // 去掉当前题
                          const prev = trail[trail.length - 1]; // 上一题
                          sessionStorage.setItem('questionTrail', JSON.stringify(trail));
                          sessionStorage.setItem('suppressAssessModalOnce', '1');
                          navigate(`/optometrist/assess/questions/${prev}`, { replace: true });
                          return;
                        }
                  } catch {}
              // 没有上一题则回到开始页
                  navigate('/optometrist/assess/start-page', { replace: true });
              return;
            }
        navigate(-1);
      };

      return (
        // <button className={`back-button ${className}`} onClick={onClick}>
        //       ← Go back
        //     </button>
          <button className={`back-button ${className}`} onClick={onClick}>{text}</button>
      );
}