// docs/src/pages/optometrist/assess/StartPage.tsx
import { useNavigate } from 'react-router-dom';
//import '../../../styles/question.css';ZSA 0811 注释掉，因为这个文件已经被融合进theme.css
import '../../../styles/theme.css'; // ZSA 0811 确保引入主题
import '../../../styles/startpage.css'; // ✅ 新增 StartPage 独立样式
import Header from '../../../components/Header';
import BottomNav from '../../../components/BottomNav';

export default function StartPage() {
    const navigate = useNavigate();

    return (
        <div className="startpage-page">
            {/* Header */}
            <Header title="Assessment" />

            {/* Main Content */}
            <main className="startpage-main">
                <div className="startpage-container">
                    <h1 className="nhsuk-heading-l startpage-title">Assessment</h1>
                    <p className="startpage-desc">
                        This assessment can help determine appropriate referral recommendations based on the patient's symptoms.
                    </p>
                    <button
                        className="continue-button startpage-button"
                        onClick={() => navigate('../questions/Q1')}
                    >
                        Start now
                    </button>
                </div>
            </main>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
}
