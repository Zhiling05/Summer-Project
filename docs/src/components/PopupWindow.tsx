import "../styles/popupwindow.css";

interface PopupWindowProps {
  open: boolean;
  onContinue: () => void;
  onRestart: () => void;
  onClose?: () => void;
  title?: string;
  description?: string;
  continueText?: string;
  restartText?: string;
}

/**
 * PopupWindow - Modal component for unfinished assessments
 * - Allows user to either continue or restart an incomplete assessment
 * - Clicking outside will trigger onClose if provided
 */
export default function PopupWindow({
  open,
  onContinue,
  onRestart,
  onClose,
  title = "Unfinished Assessment",
  description = "Unfinished assessment detected. Would you like to continue or start over?",
  continueText = "Continue",
  restartText = "Restart",
}: PopupWindowProps) {
  if (!open) return null;

  return (
    <div className="cm-overlay" onClick={onClose}>
      <div
        className="cm-container"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="cm-title">{title}</h2>
        <p className="cm-desc">{description}</p>
        <div className="cm-actions">
          <button className="btn-primary" onClick={onContinue}>
            {continueText}
          </button>
          <button className="btn-outline" onClick={onRestart}>
            {restartText}
          </button>
        </div>
      </div>
    </div>
  );
}
