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

/** Normalize raw options into {label, value} objects */
const normalize = (opt: RawOption): { label: string; value: string } =>
  typeof opt === "string" ? { label: opt, value: opt } : opt;

/**
 * DynamicQuestion - Core component for dynamic assessment
 * - Displays the current question and options
 * - Saves answers and navigates to the next question or recommendation
 * - Submits completed assessments to the backend
 */
const DynamicQuestion = () => {
  const { questionId = "" } = useParams<{ questionId: string }>();
  const navigate = useNavigate();

  // All questions loaded from JSON config
  const questions = useMemo<Question[]>(() => {
    return Array.isArray((questionnaire as any).questions)
      ? (questionnaire as any).questions
      : (questionnaire as any);
  }, []);

  const currentQuestion = useMemo<Question | undefined>(() => {
    return questions.find((q) => q.id === questionId);
  }, [questionId, questions]);

  // Answer states
  const [singleAns, setSingleAns] = useState<string>("");
  const [multiAns, setMultiAns] = useState<string[]>([]);
  const [answerHistory, setAnswerHistory] = useState<AnswerHistory>({});
  const [errors, setErrors] = useState<string[]>([]);

  // On mount: restore answer history from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem("answerHistory");
    if (saved) {
      try { setAnswerHistory(JSON.parse(saved) as AnswerHistory); } catch {}
    }
  }, []);

  // Mark assessment as started and update last visited question
  useEffect(() => {
    sessionStorage.setItem("assessStarted", "true");
    sessionStorage.setItem("lastQuestionId", questionId);
    sessionStorage.removeItem("assessmentComplete");
  }, [questionId]);

  // Restore previous answers when revisiting a question
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

  /** Toggle option for multi-choice questions */
  const toggleOption = (value: string) => {
    setMultiAns(prev => 
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  // Check if the current question has been answered
  const hasAnswered = currentQuestion?.type === "single"
    ? singleAns !== ""
    : multiAns.length > 0;

  /**
   * Handle "Next" button click
   * - Validate answer
   * - Save answer to history
   * - Determine next question or recommendation
   * - Submit to backend if assessment is complete
   */
  const handleNext = async () => {
    if (!currentQuestion) return;

    // 1. Validate answer
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

    // 2. Get current answer
    const currentAnswer = currentQuestion.type === "single" ? singleAns : multiAns;

    // 3. Update answer history
    const updatedHistory = {
      ...answerHistory,
      [currentQuestion.id]: currentAnswer,
    };
    setAnswerHistory(updatedHistory);
    sessionStorage.setItem("answerHistory", JSON.stringify(updatedHistory));

    // 4. Determine next step
    let nextId = getNextId(currentQuestion.id, currentAnswer, updatedHistory);

    // Fallback to defaultNext if navigation fails
    if (!nextId && currentQuestion.navigation?.defaultNext) {
      nextId = currentQuestion.navigation.defaultNext;
    }
    if (!nextId) {
      console.error("Navigation error: No next question ID determined");
      return;
    }

    // 5. If reaching a recommendation
    if (!nextId.startsWith("Q")) {
      const answersArray = Object.entries(updatedHistory).map(([qid, ans]) => {
        const questionObj = questions.find(q => q.id === qid);
        return {
          questionId: qid,
          question: questionObj?.question || "",
          answer: Array.isArray(ans) ? ans.join(", ") : ans,
        };
      });

      try {
        const recommendation = nextId;
        const payload: CreateAssessmentRequest = {
          role: 'optometrist',
          recommendation,
          answers: answersArray,
        };
        const { id: assessmentId } = await createAssessment(payload);

        sessionStorage.setItem('suppressAssessModalOnce', '1');
        navigate(`/optometrist/assess/recommendations/${recommendation}/${assessmentId}`, {
          state: { assessmentId }
        });
      } catch (error) {
        console.error('Failed to save assessment:', error);
      }
      return;
    }

    // 6. Navigate to the next question
    sessionStorage.setItem('suppressAssessModalOnce', '1');
    navigate(`/optometrist/assess/questions/${nextId}`);
  };

  // Track visited question trail (for BackButton navigation)
  useEffect(() => {
    const raw = sessionStorage.getItem('questionTrail') || '[]';
    let trail: string[] = [];
    try { trail = JSON.parse(raw); } catch {}
    if (trail[trail.length - 1] !== questionId) {
      trail.push(questionId);
      sessionStorage.setItem('questionTrail', JSON.stringify(trail));
    }
  }, [questionId]);

  // Error state: question not found
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

  // Error state: question exists but not configured
  if (
    !currentQuestion.question?.trim() ||
    !currentQuestion.options ||
    currentQuestion.options.length === 0
  ) {
    return (
      <>
        <Header title="DIPP Assessment" showBack />
        <BackButton />
        <div className="nhsuk-width-container">
          <main id="maincontent" className="nhsuk-main-wrapper">
            <section className="question-box">
              <h1 className="nhsuk-heading-l">
                ⚠️ The question is not configured
              </h1>
              <p className="hint">
                The backend has not provided complete content for{" "}
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

  // Normal rendering
  const opts = currentQuestion.options.map(normalize);

  return (
    <>
      <Header title="DIPP Assessment" showBack />
      <BackButton />

      <div className="nhsuk-width-container">
        <main id="maincontent" className="nhsuk-main-wrapper">
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

            {errors.length > 0 && (
              <div className="error-block" style={{ color: "red", margin: "1rem 0" }}>
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

      <BottomNav />
    </>
  );
};

export default DynamicQuestion;
