import React from "react";
import "../styles/popupwindow.css";

interface PopupWindowProps {
    open: boolean;
    onContinue: () => void;
    onRestart: () => void;
}

export default function PopupWindow({
                                         open,
                                         onContinue,
                                         onRestart,
                                     }: PopupWindowProps) {
    if (!open) return null;
    return (
        <div className="cm-overlay">
            <div className="cm-container">
                <h2 className="cm-title">Unfinished Assessment</h2>
                <p className="cm-desc">
                    Unfinished assessment detected. Would you like to continue or start over?
                </p>
                <div className="cm-actions">
                    <button className="btn-primary" onClick={onContinue}>
                        Continue
                    </button>
                    <button className="btn-outline" onClick={onRestart}>
                        Restart
                    </button>
                </div>
            </div>
        </div>
    );
}