import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../../../styles/question.css";

import BackButton from '../../../../components/BackButton';
import BottomNav from "../../../../components/BottomNav";
import Header from "../../../../components/Header"; 

import questionnaire from "../../../../data/questionnaire.json";
import { getNextId, AnswerHistory } from "../../../../utils/NavigationLogic.ts";
import { validateByType } from "../../../../utils/ValidationLogic";
import { createAssessment, type CreateAssessmentRequest } from "../../../../api"; 
import { Question, RawOption } from "../../../../types/assessment.ts";

/**
 * 将原始选项格式标准化为 {label, value} 对象
 */
const normalize = (opt: RawOption): { label: string; value: string } =>
  typeof opt === "string" ? { label: opt, value: opt } : opt;

/**
 * DynamicQuestion - 动态评估问题组件
 * 
 * 负责:
 * 1. 显示当前问题和选项
 * 2. 收集用户答案
 * 3. 导航到下一个问题或推荐结果页
 * 4. 在评估完成时保存数据到后端
 */
const DynamicQuestion = () => {


  const { questionId = "" } = useParams<{ questionId: string }>();
  const navigate = useNavigate();

  // 问题数据: 使用useMemo缓存整个问题列表，不需要让问题列表在组件渲染时每次都重新计算
  const questions = useMemo<Question[]>(() => {
    return Array.isArray((questionnaire as any).questions)
      ? (questionnaire as any).questions
      : (questionnaire as any);
  }, []);

  const currentQuestion = useMemo<Question | undefined>(() => {
    return questions.find((q) => q.id === questionId);
  }, [questionId, questions]);

  // 答案状态
  const [singleAns, setSingleAns] = useState<string>("");
  const [multiAns, setMultiAns] = useState<string[]>([]);
  const [answerHistory, setAnswerHistory] = useState<AnswerHistory>({});
  const [errors, setErrors] = useState<string[]>([]);

  // 首次挂载：从 sessionStorage 恢复答题记录
      useEffect(() => {
          const saved = sessionStorage.getItem("answerHistory");
          if (saved) {
             try { setAnswerHistory(JSON.parse(saved) as AnswerHistory); } catch {}
          }
      }, []);


  useEffect(() => {
    // 把两个合并了，记录评估开始和记录最后访问的问题
    sessionStorage.setItem("assessStarted", "true");
    sessionStorage.setItem("lastQuestionId", questionId);
    sessionStorage.removeItem("assessmentComplete"); //一旦进入题目，标记为未完成
  }, [questionId]);

   // 现在返回之前的问题能看到之前的回答，而不是必须重新选择
  useEffect(() => {
    if (currentQuestion) {
      const previousAnswer = answerHistory[currentQuestion.id];
      if (previousAnswer !== undefined) {
        if (currentQuestion.type === "single") {
          setSingleAns(previousAnswer as string);
        } else {
          setMultiAns(Array.isArray(previousAnswer) ? previousAnswer : [previousAnswer]);
        }
      } else {
        setSingleAns("");
        setMultiAns([]);
      }
    }
    
    setErrors([]);
  }, [questionId, answerHistory, currentQuestion]);

  /* 多选切换 */
  const toggleOption = (value: string) => {
    setMultiAns(prev => 
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };
  // 判断是否已回答
  const hasAnswered = currentQuestion?.type === "single"
    ? singleAns !== ""
    : multiAns.length > 0;

  // ===== 主要处理逻辑 =====
  /**
   * 处理下一步按钮点击
   * - 验证回答
   * - 保存回答
   * - 确定下一个问题
   * - 若完成评估，提交数据到后端
   */
  const handleNext = async () => {
    if (!currentQuestion) return;

    // 1. 验证答案
    const selections = currentQuestion.type === "single" ? [singleAns] : multiAns;
    const validationErrors = validateByType(
      currentQuestion.type,
      selections,
      currentQuestion.options.length
    );

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors([]);

    // 2. 获取当前答案值
    const currentAnswer = currentQuestion.type === "single" ? singleAns : multiAns;

    // 3. 更新答案历史
    const updatedHistory = {
      ...answerHistory,
      [currentQuestion.id]: currentAnswer,
    };
    setAnswerHistory(updatedHistory);
    sessionStorage.setItem("answerHistory", JSON.stringify(updatedHistory));


    // 4. 确定下一步
    let nextId = getNextId(
      currentQuestion.id,
      currentAnswer,
      updatedHistory
    );

    // 防御机制：回退到默认值
    if (!nextId && currentQuestion.navigation?.defaultNext) {
      nextId = currentQuestion.navigation.defaultNext;
    }

    if (!nextId) {
      console.error("Navigation error: No next question ID determined");
      return;
    }

    // 5. 判断是否到达推荐页面
    if (!nextId.startsWith("Q")) {
      // 6. 准备提交数据
      const answersArray = Object.entries(updatedHistory).map(([qid, ans]) => {
        const questionObj = questions.find(q => q.id === qid);
        return {
          questionId: qid,
          question: questionObj?.question || "",
          answer: Array.isArray(ans) ? ans.join(", ") : ans,
        };
      });

      try {
        // 7. 调用API保存评估
        const recommendation = nextId;
        const payload: CreateAssessmentRequest = {
          role: 'optometrist',
          recommendation,
          answers: answersArray,
        };
        const { id: assessmentId } = await createAssessment(payload);

        // 8. 成功后跳转
        sessionStorage.setItem('suppressAssessModalOnce', '1');
        navigate(`/optometrist/assess/recommendations/${recommendation}/${assessmentId}`, {
          state: { assessmentId }
        });
      } catch (error) {
          console.error('Failed to save assessment:', error);
  // 临时显示详细错误信息
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorDetails = `
  错误: ${errorMessage}
  URL: ${window.location.href}
  时间: ${new Date().toISOString()}
  API地址: ${import.meta.env.VITE_API_BASE || '/api'}
  `;
  alert(errorDetails);
  console.error('Full error:', error);
      }
      return;
    }

    // 10. 导航到下一个问题
    sessionStorage.setItem('suppressAssessModalOnce', '1');
    navigate(`/optometrist/assess/questions/${nextId}`);
  };



  // 记录题目访问轨迹，用于 BackButton 智能回退
  useEffect(() => {
    const raw = sessionStorage.getItem('questionTrail') || '[]';
    let trail: string[] = [];
    try { trail = JSON.parse(raw); } catch {}
    if (trail[trail.length - 1] !== questionId) {
      trail.push(questionId);
      sessionStorage.setItem('questionTrail', JSON.stringify(trail));
    }
  }, [questionId]);


  // ===== 错误状态处理 =====
  /* ——— 题目不存在 —— */
  if (!currentQuestion)
    return (
      <>
        <Header title="DIPP Assessment" showBack /> 
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
                            : toggleOption(o.value)
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
              disabled={!hasAnswered}
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