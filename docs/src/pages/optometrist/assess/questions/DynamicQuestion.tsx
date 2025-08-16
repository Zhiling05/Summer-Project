/* docs/src/pages/optometrist/assess/questions/DynamicQuestion.tsx */
import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../../../styles/question.css";

import BackButton from '../../../../components/BackButton';
import BottomNav from "../../../../components/BottomNav";
import Header from "../../../../components/Header"; // ycl2

import questionnaire from "../../../../data/questionnaire.json";
import { getNextId, AnswerHistory } from "../../../../utils/NavigationLogic.ts";
import { validateByType } from "../../../../utils/ValidationLogic"; // ycl
import { createAssessment, type CreateAssessmentRequest } from "../../../../api";                // 新增：保存 assessment

// 后端的report.js和doc.js已经实现了完整的报告生成逻辑
// function buildLocalText(recCode: string, role = 'optometrist', answers: any[] = []) {
//   // 提取症状（模拟后端的 extractSymptoms）
//   const symptoms = answers
//     .filter(a => a.answer !== 'No' && a.answer !== 'None of the above')
//     .map(a => `- ${a.answer}`);

//   // 使用与后端相同的格式
//   const lines = [
//     'ASSESSMENT REPORT (LOCAL PREVIEW)',
//     '=================================',
//     '',
//     `Date: ${new Date().toLocaleString('en-GB', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     })}`,
//     '',
//     'SYMPTOMS:',
//     ...symptoms.length ? symptoms : ['No symptoms recorded.'],
//     '',
//     'RECOMMENDATION:',
//     getRecommendationText(recCode), // 转换为可读文本
//     '',
//     '--- LOCAL PREVIEW ONLY ---'
//   ];
  
//   return lines.join('\n');
// }


/* ---------- 类型声明 ---------- */
import { Question, RawOption } from "../../../../types/assessment.ts"; // zkx

/* ---------- 工具函数 ---------- */
const normalize = (opt: RawOption): { label: string; value: string } =>
  typeof opt === "string" ? { label: opt, value: opt } : opt;

const DynamicQuestion = () => {

  // yj新增：等用户进入任一道题时，记录一下评估已经开始了，方便后面记录进度
  useEffect(() => {
    sessionStorage.setItem("assessStarted", "true");
  }, []);


  /* ——— 路由 & 参数 ——— */
  const { questionId = "" } = useParams<{ questionId: string }>();
  const navigate = useNavigate();

  // ─── 记录用户最后看到的题目 ID ───（yj添加）
  useEffect(() => {
    sessionStorage.setItem("lastQuestionId", questionId);
    }, [questionId]);

  /* ——— 生成一次 patientId，整次问卷保持不变 ——— */
  const [patientId] = useState(() => `pid-${Date.now().toString(36)}`);

  /* ---------- ★ 修正：统一将题库摊平成数组 ---------- */
  const questionsList: Question[] = Array.isArray(
    (questionnaire as any).questions
  )
    ? (questionnaire as any).questions
    : (questionnaire as any);

  /* ——— 当前题目 ——— */
  const currentQuestion = useMemo<Question | undefined>(() => {
    /**
     * questionnaire 可能是 [{…}] 或 { questions: [{…}] }
     * 统一取出 Question[] 列表
     */
    return questionsList.find((q) => q.id === questionId);
  }, [questionId]);
  // 上面这里要改一下下
  // const currentQuestion = useMemo<Question | undefined>(
  //     () => (questionnaire.questions as Question[]).find((q) => q.id === questionId),
  //     [questionId, questionnaire]
  // );

  /* ——— 答案状态 ——— */
  const [singleAns, setSingleAns] = useState("");
  const [multiAns, setMultiAns] = useState<string[]>([]);
  // 姚璟添加：这里应该加入一个记录历史选择的功能，为了逻辑跳转/修改选项功能
  const [answerHistory, setAnswerHistory] = useState<AnswerHistory>({});
  const [errors, setErrors] = useState<string[]>([]); // ycl

  /* 题目切换时重置答案 */
  useEffect(() => {
    setSingleAns("");
    setMultiAns([]);
    setErrors([]); // ycl
  }, [questionId]);

  /* 已作答？ */
  const answered =
    currentQuestion?.type === "single"
      ? singleAns !== ""
      : multiAns.length > 0;

  /* 多选切换 */
  const toggle = (val: string) =>
    setMultiAns((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );

  /* ---------- 跳转下一步 ---------- */
  const handleNext = async () => {
    if (!currentQuestion) return;

    // 1) 校验逻辑 // ycl
    const selections =
      currentQuestion.type === "single" ? [singleAns] : multiAns;
    const validationErrors = validateByType(
      currentQuestion.type,
      selections,
      currentQuestion.options.length
    );
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return; // ycl
    }
    setErrors([]); // ycl

    const answerPayload =
      currentQuestion.type === "single" ? singleAns : multiAns;

    // 姚璟添加：更新答题历史
    const updatedHistory: AnswerHistory = {
      ...answerHistory,
      [currentQuestion.id]: answerPayload,
    };
    setAnswerHistory(updatedHistory);

    /* ① 让 NavigationLogic 判断（若有更复杂逻辑） */
    let nextId = getNextId?.(
      currentQuestion.id,
      answerPayload,
      updatedHistory
    );

    /* ② fallback：按 navigation.defaultNext */
    if (!nextId && currentQuestion.navigation?.defaultNext) {
      nextId = currentQuestion.navigation.defaultNext;
    }

    if (!nextId) return; // 配置错误

    /* =========================================================
     * 如果 nextId 是推荐页（不是 Q 开头）——先保存 assessment
     * ======================================================= */
    if (!nextId.startsWith("Q")) {
      const answersArr = Object.entries(updatedHistory).map(([qid, ans]) => {
        const qObj = questionsList.find((q) => q.id === qid) ?? {};
        return {
          questionId: qid,
          question: (qObj as any).question ?? "",
          answer: Array.isArray(ans) ? ans.join(", ") : ans,
        };
      });

      const contentStr = answersArr
          .map(a => `${a.questionId}: ${a.answer}`)
          .join("; ");

      try {
  // ① 你算好的推荐代码（要与 recommendations.json 里的 id 一致）
  const recCode = nextId; // lsy改
  const payload: CreateAssessmentRequest = {
    role: 'optometrist',
    recommendation: recCode, // 保存推荐结果
    answers: answersArr,     // ← 你收集的答案数组
    content: contentStr, //lsy添加
  };

  // ③ 创建记录，拿到 newId（业务/数据库ID）
  const { id: newId } = await createAssessment(payload);

  // ④ 跳 “转诊建议页”，而不是直接预览；把 newId 带过去
  navigate(`/optometrist/assess/recommendations/${recCode}/${newId}`, {
    state: { assessmentId: newId },
  });

} catch (e) {
  console.error('Save failed:', e);

  const recCode  = nextId;   // 你已有的最终建议代码
  // const localTxt = buildLocalText(recCode, 'optometrist', answersArr);

  // 组一个给预览页用的简版对象（你也可以更完整）
  const previewObj = {
  id: `LOCAL-${Date.now()}`,
  createdAt: new Date().toISOString(),
  role: 'optometrist',
  symptoms: answersArr.map(a => a.answer),
  recommendation: recCode,
};
// 这三个 key 里任选其一与你的 PreviewReport.tsx 对应（你现在用的是 assessmentForPreview）
localStorage.setItem("assessmentForPreview", JSON.stringify(previewObj));

  navigate(`/optometrist/assess/recommendations/${recCode}/LOCAL`, {
    state: {
      assessmentId: 'LOCAL',
      text: localTxt,               // ★ 带上本地生成的纯文本
      recommendation: recCode,      // ★ 带上建议代码（预览页配色/标题用）
    },
  });
}

      return;
    }


    /* ---------- 普通题目：继续问卷流程 ---------- */
    navigate(`/optometrist/assess/questions/${nextId}`, {
      state: { patientId },
    });
  };

  /* ——— 题目不存在 —— */
  if (!currentQuestion)
    return (
      <>
        <Header title="DIPP Assessment" showBack /> {/* ycl-sprint2.2 */}
        <BackButton />
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Question not found: {questionId}</h2>
      </div>
      </>
    );

  /* ---------------------------------------------------------------
   *  题目存在，但缺少 question / options 配置
   * ------------------------------------------------------------- */
  if (
    !currentQuestion.question?.trim() ||
    !currentQuestion.options ||
    currentQuestion.options.length === 0
  ) {
    return (
      <>
        <Header title="DIPP Assessment" showBack /> {/* ycl-sprint2.2 */}
        <BackButton />

        <div className="nhsuk-width-container">
          <main id="maincontent" className="nhsuk-main-wrapper">
            <section className="question-box">
              <h1 className="nhsuk-heading-l">
                ⚠️ The question is not configured
              </h1>
              <p className="hint">
                The backend has not configured complete content for{" "}
                <strong>{currentQuestion.id}</strong>.
              </p>
              <button className="continue-button" onClick={handleNext}>
                Skip
              </button>
            </section>
          </main>
        </div>

        <BottomNav />
      </>
    );
  }

  /* ——— 渲染 —— */
  const opts = currentQuestion.options.map(normalize);

  return (
    <>
      <Header title="DIPP Assessment" showBack /> {/* ycl-sprint2.2 */}
      <BackButton />

      <div className="nhsuk-width-container">
        <main id="maincontent" className="nhsuk-main-wrapper">
          {/* 已移除手写 header，使用统一 Header 组件 // ycl-sprint2.2 */}
          <section className="question-box">
            <h1 className="nhsuk-heading-l">{currentQuestion.question}</h1>
            {currentQuestion.hint && (
              <p className="hint">{currentQuestion.hint}</p>
            )}

            <ul className="radio-list">
              {opts.map((o) => {
                const checked =
                  currentQuestion.type === "single"
                    ? singleAns === o.value
                    : multiAns.includes(o.value);

                return (
                  <li key={o.value}>
                    <label className="radio-label">
                      <input
                        type={
                          currentQuestion.type === "single"
                            ? "radio"
                            : "checkbox"
                        }
                        name={currentQuestion.id}
                        value={o.value}
                        checked={checked}
                        onChange={() =>
                          currentQuestion.type === "single"
                            ? setSingleAns(o.value)
                            : toggle(o.value)
                        }
                      />
                      {o.label}
                    </label>
                  </li>
                );
              })}
            </ul>

            {/* 错误提示 */}
            {errors.length > 0 && (
              <div
                className="error-block"
                style={{ color: "red", margin: "1rem 0" }}
              >
                <ul>
                  {errors.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </div>
            )}

            <button
              className="continue-button"
              disabled={!answered}
              onClick={handleNext}
            >
              Next
            </button>
          </section>
        </main>
      </div>

      {/* 底部导航 */}
      <BottomNav />
    </>
  );
};

export default DynamicQuestion;