// docs/src/pages/optometrist/assess/AssessRouter.tsx
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from "react"; // yj添加useState和useLocation、useNavigation

import StartPage             from './StartPage';
import DynamicQuestion       from './questions/DynamicQuestion';
import DynamicRecommendation from './recommendations/DynamicRecommendation';
import PreviewReport         from './recommendations/PreviewReport';   // ★ 新增

// 弹窗问题
import { useNavigationType } from 'react-router-dom';

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
    //     const path = location.pathname;
    //
    //     // 仅在问卷流程里考虑弹窗
    //     const inFlow =
    //         path.endsWith('/assess/start-page') ||
    //         path.includes('/assess/questions/');
    //
    //     if (!inFlow) {
    //         setShowModal(false);
    //         return;
    //     }
    //
    //     // 1) 刚点击了 Continue/Restart：本次不弹，并清除一次性标记
    //     if (sessionStorage.getItem('suppressAssessModalOnce') === '1') {
    //         sessionStorage.removeItem('suppressAssessModalOnce');
    //         setShowModal(false);
    //         return;
    //     }
    //
    //     // 2) 已完成一次评估：不弹
    //     if (sessionStorage.getItem('assessmentComplete') === 'true') {
    //         setShowModal(false);
    //         return;
    //     }
    //
    //     // 3) 仅当真的有“未完成进度”时才弹
    //     const started = sessionStorage.getItem('assessStarted') === 'true';
    //     const lastQ = sessionStorage.getItem('lastQuestionId');
    //     const progressed =
    //         !!lastQ ||
    //         (typeof hasProgress === 'function' && !!hasProgress());
    //
    //     if (started && progressed) {
    //         setShowModal(true);
    //     } else {
    //         setShowModal(false);
    //     }
    // }, [location.pathname]);
    const navType = useNavigationType();

    useEffect(() => {
        const path = location.pathname;
        const isStart    = path.endsWith('/assess/start-page');
        const isQuestion = path.includes('/assess/questions/');

        // 只对 StartPage / Questions 这两种路由生效
        if (!isStart && !isQuestion) {
            setShowModal(false);
            return;
        }

        // 已完成过一次就不再弹
        if (sessionStorage.getItem('assessmentComplete') === 'true') {
            setShowModal(false);
            return;
        }

        // 进度判断：必须开始过且有 lastQuestionId
        const started = sessionStorage.getItem('assessStarted') === 'true';
        const lastQ   = sessionStorage.getItem('lastQuestionId');
        if (!started || !lastQ) {
            setShowModal(false);
            return;
        }

        if (isQuestion) {
            // 在题目页，仅 POP（后退/返回）时弹
            if (navType === 'POP') {
                setShowModal(true);
            } else {
                setShowModal(false);
            }
        } else {
            // 在 StartPage，只要进度在（且没完成），无论 PUSH/POP 都弹
            setShowModal(true);
        }
    }, [location.pathname, navType]);




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
        sessionStorage.removeItem("assessmentComplete");//修复弹窗bug
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