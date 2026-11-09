// AI 面試模擬器的共用設定和型別，前端和 /api/interview 都用這一份，限制才不會對不起來。

// 一場面試的題數：使用者開始前可以自己設定，範圍和預設值在這裡改
export const MIN_QUESTIONS = 1;
export const MAX_QUESTIONS = 10;
export const DEFAULT_QUESTIONS = 3;
// 職缺描述的字數限制
export const MIN_JOB_LENGTH = 20;
export const MAX_JOB_LENGTH = 4000;
// 單一回答和單一題目的字數限制
export const MAX_ANSWER_LENGTH = 2000;
export const MAX_QUESTION_LENGTH = 1000;

// 檢查題數是不是範圍內的整數
export const isValidQuestionCount = (value: unknown): value is number =>
  typeof value === "number" && Number.isInteger(value) && value >= MIN_QUESTIONS && value <= MAX_QUESTIONS;

// 一組已經回答的問答
export type InterviewTurn = {
  question: string;
  answer: string;
};

// POST /api/interview 的 request body；history 是空陣列時代表要出第一題
export type InterviewRequest = {
  jobDescription: string;
  totalQuestions: number;
  history: InterviewTurn[];
};

// 面試官的下一題；kind 是 followup 代表針對上一題追問，new 代表換主題
export type InterviewQuestion = {
  type: "question";
  kind: "new" | "followup";
  question: string;
};

// 單一題目的回饋：評論、改進方向，以及一段示範回答
export type QuestionFeedback = {
  comment: string;
  tip: string;
  betterAnswer: string;
};

// 全部題目答完後的評分和建議
export type InterviewEvaluation = {
  type: "evaluation";
  score: number;
  verdict: "建議錄取" | "可以考慮" | "暫不建議";
  summary: string;
  strengths: string[];
  improvements: string[];
  feedback: QuestionFeedback[];
};

export type InterviewResponse = InterviewQuestion | InterviewEvaluation;
