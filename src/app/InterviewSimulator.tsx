"use client";

import { useState } from "react";
import {
  MAX_ANSWER_LENGTH,
  MAX_JOB_LENGTH,
  MIN_JOB_LENGTH,
  TOTAL_QUESTIONS,
  type InterviewEvaluation,
  type InterviewQuestion,
  type InterviewResponse,
  type InterviewTurn,
} from "@/lib/interview";

const EXAMPLE_JOB =
  "前端工程師：負責公司電商網站的開發與維護，使用 React、TypeScript 和 Next.js。需要與設計師、後端工程師協作，重視網站效能與使用者體驗。要求 2 年以上前端開發經驗，有 API 串接和效能優化經驗者佳。";

const card = "rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900";
const textarea =
  "w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 leading-7 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100";
const primaryButton =
  "self-start rounded-full bg-indigo-600 px-8 py-3 font-semibold text-white transition hover:bg-indigo-500 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50";

// 呼叫 /api/interview，失敗時丟出後端回傳的錯誤訊息
async function callInterview(jobDescription: string, history: InterviewTurn[]): Promise<InterviewResponse> {
  const res = await fetch("/api/interview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jobDescription, history }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
  return data;
}

// 面試結束後的評分畫面
function EvaluationReport({ evaluation, history }: { evaluation: InterviewEvaluation; history: InterviewTurn[] }) {
  return (
    <article className={`flex flex-col gap-6 ${card}`}>
      <div className="text-center">
        <p className="text-sm font-medium text-zinc-500">面試總分</p>
        <p className="mt-2 text-6xl font-black tabular-nums text-indigo-600 dark:text-indigo-400">{evaluation.score}</p>
        <p className="mt-2 text-lg font-semibold">{evaluation.verdict}</p>
        <p className="mx-auto mt-4 max-w-xl leading-7 text-zinc-600 dark:text-zinc-300">{evaluation.summary}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-emerald-50 p-4 dark:bg-emerald-950">
          <h3 className="font-semibold text-emerald-700 dark:text-emerald-300">表現好的地方</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
            {evaluation.strengths.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl bg-amber-50 p-4 dark:bg-amber-950">
          <h3 className="font-semibold text-amber-700 dark:text-amber-300">改進建議</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
            {evaluation.improvements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h3 className="font-semibold">逐題回饋</h3>
        <ol className="mt-3 flex flex-col gap-4">
          {history.map((turn, index) => (
            <li key={turn.question} className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800">
              <p className="font-medium">
                第 {index + 1} 題：{turn.question}
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-500 dark:text-zinc-400">{turn.answer}</p>
              {evaluation.feedback[index] && (
                <div className="mt-3 space-y-1 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                  <p>{evaluation.feedback[index].comment}</p>
                  <p>💡 {evaluation.feedback[index].tip}</p>
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>

      <p className="text-center text-xs text-zinc-400">評分由 AI 依你的回答產生，僅供練習參考。</p>
    </article>
  );
}

// 輸入職缺後開始面試：AI 問三題，答完後顯示評分和建議
export default function InterviewSimulator() {
  const [jobDescription, setJobDescription] = useState("");
  const [history, setHistory] = useState<InterviewTurn[]>([]);
  const [current, setCurrent] = useState<InterviewQuestion | null>(null);
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState<InterviewEvaluation | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const started = current !== null || evaluation !== null;
  const jobLength = jobDescription.trim().length;
  const isLastQuestion = history.length === TOTAL_QUESTIONS - 1;

  // 送出請求；成功才更新畫面，失敗時保留輸入內容，使用者可以直接再按一次
  async function advance(nextHistory: InterviewTurn[]) {
    setLoading(true);
    setError("");
    try {
      const result = await callInterview(jobDescription, nextHistory);
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
    if (jobLength >= MIN_JOB_LENGTH && !loading) advance([]);
  }

  function submitAnswer(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!current || !answer.trim() || loading) return;
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
      {!started && (
        <form onSubmit={start} className={`flex flex-col gap-4 ${card}`}>
          <label htmlFor="job" className="font-medium">
            職缺描述
          </label>
          <textarea
            id="job"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={8}
            maxLength={MAX_JOB_LENGTH}
            placeholder="貼上職缺的工作內容和條件要求"
            className={textarea}
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setJobDescription(EXAMPLE_JOB)}
              className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
            >
              填入範例
            </button>
            <span className="text-xs tabular-nums text-zinc-500">
              {jobLength} / {MAX_JOB_LENGTH} 字{jobLength < MIN_JOB_LENGTH && `（至少 ${MIN_JOB_LENGTH} 字）`}
            </span>
          </div>
          <button type="submit" disabled={loading || jobLength < MIN_JOB_LENGTH} className={primaryButton}>
            {loading ? "面試官準備中…" : "開始面試"}
          </button>
        </form>
      )}

      {current && (
        <>
          {history.length > 0 && (
            <ol className="flex flex-col gap-3">
              {history.map((turn, index) => (
                <li key={turn.question} className="rounded-xl bg-zinc-100 p-4 text-sm leading-6 dark:bg-zinc-900">
                  <p className="font-medium">
                    第 {index + 1} 題：{turn.question}
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-zinc-500 dark:text-zinc-400">{turn.answer}</p>
                </li>
              ))}
            </ol>
          )}

          <form onSubmit={submitAnswer} className={`flex flex-col gap-4 ${card}`}>
            <p className="text-sm font-medium text-zinc-500">
              第 {history.length + 1} / {TOTAL_QUESTIONS} 題{current.kind === "followup" && "・追問"}
            </p>
            <h2 className="text-lg font-semibold leading-8">{current.question}</h2>
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
            <button type="submit" disabled={loading || !answer.trim()} className={primaryButton}>
              {loading ? (isLastQuestion ? "面試官評分中…" : "面試官思考中…") : isLastQuestion ? "送出並查看評分" : "送出回答"}
            </button>
          </form>
        </>
      )}

      <div aria-live="polite" className="flex flex-col gap-6">
        {error && (
          <p className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
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
          className="self-start text-sm text-zinc-500 hover:text-zinc-900 disabled:opacity-50 dark:hover:text-zinc-100"
        >
          ← 重新開始
        </button>
      )}
    </div>
  );
}
