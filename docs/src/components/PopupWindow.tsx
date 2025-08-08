import React from "react";
import "../styles/PopupWindow.css";

interface ConfirmModalProps {
    open: boolean;
    onContinue: () => void;
    onRestart: () => void;
}

export default function ConfirmModal({
                                         open,
                                         onContinue,
                                         onRestart,
                                     }: ConfirmModalProps) {
    if (!open) return null;
    return (
        <div className="cm-overlay">
            <div className="cm-container">
                <h2 className="cm-title">Unfinished Assessmemt</h2>
                <p className="cm-desc">
                    Unfinished assessment detected. Would you like to continue or start over?
                </p>
                <div className="cm-actions">
                    <button className="btn-primary" onClick={onContinue}>
                        continue
                    </button>
                    <button className="btn-outline" onClick={onRestart}>
                        restart
                    </button>
                </div>
            </div>
        </div>
    );
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/Jing-develop
