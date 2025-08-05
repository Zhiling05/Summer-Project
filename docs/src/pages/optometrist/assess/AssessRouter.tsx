// docs/src/pages/optometrist/assess/AssessRouter.tsx
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from "react"; // yj添加useState和useLocation、useNavigation

import StartPage             from './StartPage';
import DynamicQuestion       from './questions/DynamicQuestion';
import DynamicRecommendation from './recommendations/DynamicRecommendation';
import PreviewReport         from './recommendations/PreviewReport';   // ★ 新增

// ← 你的弹窗组件
import PopupWindow from "../../../components/PopupWindow";

// ← 如果还没导入，从 flow.ts 拿这几个函数
import {
    hasProgress,
    resetAssessment,
    getFirstUnanswered,
} from "../../../Core/flow";

export default function AssessRouter(): JSX.Element {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // useEffect(() => {
    //     const started = sessionStorage.getItem("assessStarted") === "true";
    //     const visited = sessionStorage.getItem("assessVisited") === "true";
    //
    //     if (started && visited) {
    //         setShowModal(true);
    //     }
    //     // 始终标记“访问过”，下一次 AssessRouter 重新挂载时才会弹窗
    //     sessionStorage.setItem("assessVisited", "true");
    // }, []); // ← 空数组，只有第一次挂载时执行
    useEffect(() => {
        const path = location.pathname;
        const inFlow =
            /\/assess\/start-page$/.test(path) ||
            /\/assess\/questions\//.test(path);

        if (!inFlow) {
            setShowModal(false);
            return;
        }

        // ⬇️ 一次性抑制：如果刚点击了 Continue/Restart，则本次不再弹窗
        if (sessionStorage.getItem('suppressAssessModalOnce') === '1') {
            sessionStorage.removeItem('suppressAssessModalOnce');
            setShowModal(false);
            return;
        }

        const started = sessionStorage.getItem('assessStarted') === 'true';
        const visited = sessionStorage.getItem('assessVisited') === 'true';

        if (started && visited) setShowModal(true);

        // 只在问卷流程里标记已访问
        sessionStorage.setItem('assessVisited', 'true');
    }, [location.pathname]);



    const handleContinue = () => {
        // const nextQ = getFirstUnanswered() ?? "Q1";
        const last = sessionStorage.getItem("lastQuestionId");
        const nextQ = last ?? getFirstUnanswered() ?? "Q1";

        sessionStorage.setItem('suppressAssessModalOnce', '1');

        setShowModal(false);
        // ← 用绝对路径，避免按当前路径再 append
        navigate(`/optometrist/assess/questions/${nextQ}`, { replace: true });
    };

    const handleRestart = () => {
        resetAssessment();
        sessionStorage.removeItem("assessStarted");
        sessionStorage.removeItem("assessVisited");
        sessionStorage.removeItem("lastQuestionId");
        sessionStorage.setItem('suppressAssessModalOnce', '1');
        setShowModal(false);
        // ← 同样改成绝对路径
        navigate(`/optometrist/assess/start-page`, { replace: true });
    };

    return (
        <>
            <PopupWindow
                open={showModal}
                onContinue={handleContinue}
                onRestart={handleRestart}
            />

            <Routes>
                <Route path=""           element={<Navigate to="start-page" replace />} />
                <Route path="start-page" element={<StartPage />} />
                <Route path="questions/:questionId" element={<DynamicQuestion />} />
                <Route
                    path="recommendations/report-preview/:id"
                    element={<PreviewReport />}
                />
                <Route
                    path="recommendations/:resultId/:assessmentId"
                    element={<DynamicRecommendation />}  //yj添加/:assessmentId传参
                />
            </Routes>
        </>
    );
}