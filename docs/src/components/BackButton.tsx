// backbutton.tsx
import { useNavigate } from 'react-router-dom';
import '../styles/theme.css';

interface BackButtonProps {
    className?: string;
}

export default function BackButton({ className = '' }: BackButtonProps) {
    const navigate = useNavigate();
    return (
        <button 
            className={`back-button ${className}`} 
            onClick={() => navigate(-1)}
        >
            ← Go back
        </button>
    );
}