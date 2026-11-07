// AI 面試模擬器的共用設定和型別，前端和 /api/interview 都用這一份，限制才不會對不起來。

// 一場面試總共問幾題
export const TOTAL_QUESTIONS = 3;
// 職缺描述的字數限制
export const MIN_JOB_LENGTH = 20;
export const MAX_JOB_LENGTH = 4000;
// 單一回答和單一題目的字數限制
export const MAX_ANSWER_LENGTH = 2000;
export const MAX_QUESTION_LENGTH = 1000;

// 一組已經回答的問答
export type InterviewTurn = {
  question: string;
  answer: string;
};

// POST /api/interview 的 request body；history 是空陣列時代表要出第一題
export type InterviewRequest = {
  jobDescription: string;
  history: InterviewTurn[];
};

// 面試官的下一題；kind 是 followup 代表針對上一題追問，new 代表換主題
export type InterviewQuestion = {
  type: "question";
  kind: "new" | "followup";
  question: string;
};

// 三題結束後的評分和建議
export type InterviewEvaluation = {
  type: "evaluation";
  score: number;
  verdict: "建議錄取" | "可以考慮" | "暫不建議";
  summary: string;
  strengths: string[];
  improvements: string[];
  feedback: { comment: string; tip: string }[];
};

export type InterviewResponse = InterviewQuestion | InterviewEvaluation;
