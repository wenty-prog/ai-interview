"use client";

import Link from "next/link";
import { useState } from "react";
import { useApiKey } from "@/lib/apiKeyStorage";
import {
  API_KEY_HEADER,
  DEFAULT_QUESTIONS,
  MAX_ANSWER_LENGTH,
  MAX_JOB_LENGTH,
  MAX_QUESTIONS,
  MIN_JOB_LENGTH,
  MIN_QUESTIONS,
  isValidQuestionCount,
  type InterviewEvaluation,
  type InterviewQuestion,
  type InterviewResponse,
  type InterviewTurn,
} from "@/lib/interview";

const EXAMPLE_JOB =
  "前端工程師：負責公司電商網站的開發與維護，使用 React、TypeScript 和 Next.js。需要與設計師、後端工程師協作，重視網站效能與使用者體驗。要求 2 年以上前端開發經驗，有 API 串接和效能優化經驗者佳。";

// 共用的樣式，顏色都來自 globals.css 的色票，深色模式會自動切換
const card = "rounded-3xl border border-line bg-surface p-6 shadow-[0_24px_48px_-32px_rgba(22,20,15,0.35)] sm:p-8";
const fieldLabel = "font-mono text-xs uppercase tracking-[0.18em] text-muted";
const textarea =
  "w-full resize-y rounded-2xl border border-line bg-paper px-4 py-3 leading-7 text-ink placeholder:text-muted/70 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15";
const primaryButton =
  "inline-flex items-center gap-2 self-start rounded-full bg-ink px-7 py-3.5 font-semibold text-paper transition hover:opacity-90 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40";

// 呼叫 /api/interview，把使用者自己的 API key 放在 header 帶上；失敗時丟出後端回傳的錯誤訊息
async function callInterview(
  apiKey: string,
  jobDescription: string,
  totalQuestions: number,
  history: InterviewTurn[],
): Promise<InterviewResponse> {
  const res = await fetch("/api/interview", {
    method: "POST",
    headers: { "Content-Type": "application/json", [API_KEY_HEADER]: apiKey },
    body: JSON.stringify({ jobDescription, totalQuestions, history }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
  return data;
}

// 面試結束後的評分畫面
function EvaluationReport({ evaluation, history }: { evaluation: InterviewEvaluation; history: InterviewTurn[] }) {
  return (
    <article className={`flex flex-col gap-8 ${card}`}>
      <div className="flex flex-col gap-6 border-b border-line pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className={fieldLabel}>面試總分</p>
          <p className="mt-2 text-7xl font-black leading-none tabular-nums text-accent">{evaluation.score}</p>
        </div>
        <span className="self-start rounded-full border border-line bg-paper px-4 py-1.5 font-semibold sm:self-auto">
          {evaluation.verdict}
        </span>
      </div>

      <p className="text-lg leading-8">{evaluation.summary}</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-ok-soft p-5">
          <h3 className="font-semibold text-ok">表現好的地方</h3>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-6 text-ink/85">
            {evaluation.strengths.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl bg-accent-soft p-5">
          <h3 className="font-semibold text-accent">改進建議</h3>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-6 text-ink/85">
            {evaluation.improvements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h3 className={fieldLabel}>逐題回饋</h3>
        <ol className="mt-4 flex flex-col gap-4">
          {history.map((turn, index) => (
            <li key={turn.question} className="rounded-2xl border border-line bg-paper p-5">
              <p className="font-mono text-xs text-muted">第 {index + 1} 題</p>
              <p className="mt-1 font-semibold leading-7">{turn.question}</p>
              <p className="mt-3 whitespace-pre-wrap border-l-2 border-line pl-3 text-sm leading-6 text-muted">{turn.answer}</p>
              {evaluation.feedback[index] && (
                <>
                  <div className="mt-4 space-y-1.5 text-sm leading-6 text-ink/85">
                    <p>{evaluation.feedback[index].comment}</p>
                    <p>💡 {evaluation.feedback[index].tip}</p>
                  </div>
                  <div className="mt-4 rounded-xl border border-accent/30 bg-surface p-4">
                    <p className="text-sm font-semibold text-accent">示範回答</p>
                    <p className="mt-1.5 whitespace-pre-wrap text-sm leading-7 text-ink/85">
                      {evaluation.feedback[index].betterAnswer}
                    </p>
                  </div>
                </>
              )}
            </li>
          ))}
        </ol>
      </div>

      <p className="text-center text-xs leading-5 text-muted">
        評分和示範回答由 AI 依你的回答產生，僅供練習參考。示範回答可能加入你沒提過的做法或細節，〔〕標出的地方也要換成你自己的內容，面試時請只說你真的做過的事。
      </p>
    </article>
  );
}

// 輸入職缺和題數後開始面試：AI 依題數出題，答完後顯示評分、建議和示範回答
export default function InterviewSimulator() {
  // 使用者在設定頁存的 OpenAI API key；空字串代表還沒設定
  const apiKey = useApiKey();
  const hasKey = apiKey !== "";
  const [jobDescription, setJobDescription] = useState("");
  // 題數輸入框的文字；用字串存，使用者才能先清空再重打
  const [questionCount, setQuestionCount] = useState(String(DEFAULT_QUESTIONS));
  const [history, setHistory] = useState<InterviewTurn[]>([]);
  const [current, setCurrent] = useState<InterviewQuestion | null>(null);
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState<InterviewEvaluation | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const started = current !== null || evaluation !== null;
  const jobLength = jobDescription.trim().length;
  const totalQuestions = Number(questionCount);
  const countValid = questionCount.trim() !== "" && isValidQuestionCount(totalQuestions);
  const isLastQuestion = history.length === totalQuestions - 1;

  // 送出請求；成功才更新畫面，失敗時保留輸入內容，使用者可以直接再按一次
  async function advance(nextHistory: InterviewTurn[]) {
    setLoading(true);
    setError("");
    try {
      const result = await callInterview(apiKey, jobDescription, totalQuestions, nextHistory);
      setHistory(nextHistory);
      setAnswer("");
      if (result.type === "evaluation") {
        setCurrent(null);
        setEvaluation(result);
      } else {
        setCurrent(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  function start(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (hasKey && jobLength >= MIN_JOB_LENGTH && countValid && !loading) advance([]);
  }

  function submitAnswer(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!hasKey || !current || !answer.trim() || loading) return;
    advance([...history, { question: current.question, answer: answer.trim() }]);
  }

  function restart() {
    setHistory([]);
    setCurrent(null);
    setAnswer("");
    setEvaluation(null);
    setError("");
  }

  return (
    <div className="flex flex-col gap-6">
      {!hasKey && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-accent/40 bg-accent-soft px-5 py-4 text-sm">
          <p className="leading-6">需要先設定你自己的 OpenAI API key 才能開始面試，key 只會存在你的瀏覽器。</p>
          <Link href="/settings" className="shrink-0 font-semibold text-accent hover:underline">
            前往設定 →
          </Link>
        </div>
      )}

      {!started && (
        <form onSubmit={start} className={`flex flex-col gap-6 ${card}`}>
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <label htmlFor="job" className={fieldLabel}>
                職缺描述
              </label>
              <button
                type="button"
                onClick={() => setJobDescription(EXAMPLE_JOB)}
                className="text-sm font-medium text-accent hover:underline"
              >
                填入範例
              </button>
            </div>
            <textarea
              id="job"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={8}
              maxLength={MAX_JOB_LENGTH}
              placeholder="貼上職缺的工作內容和條件要求"
              className={textarea}
            />
            <span className="self-end font-mono text-xs tabular-nums text-muted">
              {jobLength} / {MAX_JOB_LENGTH} 字{jobLength < MIN_JOB_LENGTH && `（至少 ${MIN_JOB_LENGTH} 字）`}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <label htmlFor="question-count" className={fieldLabel}>
              題數
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <input
                id="question-count"
                type="number"
                inputMode="numeric"
                min={MIN_QUESTIONS}
                max={MAX_QUESTIONS}
                step={1}
                value={questionCount}
                onChange={(e) => setQuestionCount(e.target.value)}
                aria-describedby="question-count-hint"
                aria-invalid={!countValid}
                className="w-24 rounded-2xl border border-line bg-paper px-4 py-2.5 text-lg font-semibold tabular-nums text-ink focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 aria-invalid:border-red-500"
              />
              <span id="question-count-hint" className={`text-sm ${countValid ? "text-muted" : "text-red-600 dark:text-red-400"}`}>
                {MIN_QUESTIONS} 到 {MAX_QUESTIONS} 題，追問也算一題
              </span>
            </div>
          </div>

          <button type="submit" disabled={!hasKey || loading || jobLength < MIN_JOB_LENGTH || !countValid} className={primaryButton}>
            {loading ? "面試官準備中…" : "開始面試"}
            {!loading && <span aria-hidden>→</span>}
          </button>
        </form>
      )}

      {current && (
        <>
          {history.length > 0 && (
            <ol className="flex flex-col gap-3">
              {history.map((turn, index) => (
                <li key={turn.question} className="rounded-2xl border border-line bg-surface/60 p-5 text-sm leading-6">
                  <p className="font-mono text-xs text-muted">第 {index + 1} 題</p>
                  <p className="mt-1 font-semibold">{turn.question}</p>
                  <p className="mt-2 whitespace-pre-wrap text-muted">{turn.answer}</p>
                </li>
              ))}
            </ol>
          )}

          <form onSubmit={submitAnswer} className={`flex flex-col gap-5 ${card}`}>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <p className="font-mono text-xs text-muted">
                  第 {history.length + 1} / {totalQuestions} 題
                </p>
                {current.kind === "followup" && (
                  <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-semibold text-accent">追問</span>
                )}
              </div>
              {/* 進度條：已回答的題數佔總題數的比例 */}
              <div
                role="progressbar"
                aria-label="面試進度"
                aria-valuemin={0}
                aria-valuemax={totalQuestions}
                aria-valuenow={history.length}
                className="h-1 rounded-full bg-line"
              >
                <div
                  className="h-1 rounded-full bg-accent transition-[width] duration-500"
                  style={{ width: `${(history.length / totalQuestions) * 100}%` }}
                />
              </div>
            </div>
            <h2 className="text-xl font-semibold leading-8">{current.question}</h2>
            <label htmlFor="answer" className="sr-only">
              你的回答
            </label>
            <textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={6}
              maxLength={MAX_ANSWER_LENGTH}
              placeholder="輸入你的回答"
              className={textarea}
            />
            <button type="submit" disabled={!hasKey || loading || !answer.trim()} className={primaryButton}>
              {loading ? (isLastQuestion ? "面試官評分中…" : "面試官思考中…") : isLastQuestion ? "送出並查看評分" : "送出回答"}
            </button>
          </form>
        </>
      )}

      <div aria-live="polite" className="flex flex-col gap-6">
        {error && (
          <p className="rounded-2xl border border-red-300 bg-red-50 px-5 py-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            發生錯誤：{error}
          </p>
        )}
        {evaluation && <EvaluationReport evaluation={evaluation} history={history} />}
      </div>

      {started && (
        <button
          type="button"
          onClick={restart}
          disabled={loading}
          className="self-start text-sm font-medium text-muted transition hover:text-ink disabled:opacity-50"
        >
          ← 重新開始
        </button>
      )}
    </div>
  );
}
