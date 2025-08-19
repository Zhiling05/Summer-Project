// docs/src/pages/optometrist/assess/AssessRouter.tsx
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from "react"; // yj添加useState和useLocation、useNavigation

import StartPage             from './StartPage';
import DynamicQuestion       from './questions/DynamicQuestion';
import DynamicRecommendation from './recommendations/DynamicRecommendation';
import PopupWindow from "../../../components/PopupWindow";

// // ← 如果还没导入，从 flow.ts 拿这几个函数
// import {
//     hasProgress,
//     resetAssessment,
//     getFirstUnanswered,
// } from "../../../Core/flow";

export default function AssessRouter(): JSX.Element {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // const navType = useNavigationType();

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
        // if (sessionStorage.getItem('assessmentComplete') === 'true') {
        //     setShowModal(false);
        //     return;
        // }

        // 进度判断：必须开始过且有 lastQuestionId
        const started = sessionStorage.getItem('assessStarted') === 'true';
        const lastQ   = sessionStorage.getItem('lastQuestionId');
        if (!started || !lastQ) {
            setShowModal(false);
            return;
        }

        //一次性抑制
        const suppressOnce = sessionStorage.getItem('suppressAssessModalOnce') === '1';
        if (suppressOnce) {
            sessionStorage.removeItem('suppressAssessModalOnce');
            setShowModal(false);
            return;
        }

    //     if (isQuestion) {
    //         // 在题目页，仅 POP（后退/返回）时弹
    //         if (navType === 'POP') {
    //             setShowModal(true);
    //         } else {
    //             setShowModal(false);
    //         }
    //     } else {
    //         // 在 StartPage，只要进度在（且没完成），无论 PUSH/POP 都弹
    //         setShowModal(true);
    //     }
    // }, [location.pathname, navType]);
        // —— 触发策略 ——
        // StartPage：有进度就弹；Question 页：不在 lastQ 才弹
        if (isStart) { setShowModal(true); return; }
        const atLast = path.endsWith(`/assess/questions/${lastQ}`);
        setShowModal(!atLast);
    }, [location.pathname]);



// 继续作答
    const handleContinue = () => {
        const lastQ = sessionStorage.getItem('lastQuestionId');
        if (!lastQ) return;
        sessionStorage.setItem('suppressAssessModalOnce', '1'); // 避免刚跳转又弹
        setShowModal(false);
        navigate(`/optometrist/assess/questions/${lastQ}`);
    };

// 重新开始
    const handleRestart = () => {
        sessionStorage.removeItem('assessStarted');
        sessionStorage.removeItem('lastQuestionId');
        sessionStorage.removeItem('assessmentComplete');
        setShowModal(false);
        navigate('/optometrist/assess/start-page');
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
                    path="recommendations/:resultId/:assessmentId"
                    element={<DynamicRecommendation />}  //yj添加/:assessmentId传参
                />
            </Routes>
        </>
    );
}