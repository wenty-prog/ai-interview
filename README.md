This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 專案框架

| 項目 | 內容 |
| --- | --- |
| 框架 | Next.js 16.4.5，使用 App Router |
| 樣式 | Tailwind CSS 4 |
| 語言 | TypeScript |
| 程式碼檢查 | ESLint |
| 資料夾結構 | 程式碼放在 `src/`，頁面放在 `src/app/` |
| 套件管理 | npm |

## AI 面試模擬器

使用者貼上職缺描述後，AI 面試官會問三題，答完後給出評分和建議。頁面在首頁 `/`。

### 面試流程

1. 使用者輸入職缺描述（20 到 4000 字），按「開始面試」
2. AI 根據職缺出第 1 題
3. 使用者每答完一題，AI 會判斷要追問上一題，還是換主題出新題
4. 答完第 3 題後，顯示總分、錄取建議、表現好的地方、改進建議和逐題回饋

追問也算一題，所以一場面試總共是 3 個問題。

### 環境變數

在 `.env.local` 設定，修改後要重新啟動伺服器：

| 變數 | 必填 | 說明 |
| --- | --- | --- |
| `OPENAI_API_KEY` | 是 | OpenAI API key，只在後端使用，不會傳到瀏覽器 |
| `OPENAI_MODEL` | 否 | 使用的模型，預設 `gpt-4o-mini` |

### API：`POST /api/interview`

這支 API 不存資料。前端每次都把職缺和已回答的問答一起送來，後端依 `history` 的題數決定下一步：少於 3 筆就回傳下一題，滿 3 筆就回傳評分。

Request body，`history` 是空陣列時代表要出第一題：

```json
{
  "jobDescription": "職缺描述",
  "history": [
    { "question": "面試官的題目", "answer": "使用者的回答" }
  ]
}
```

回傳下一題，`kind` 是 `followup` 代表追問，`new` 代表換主題：

```json
{
  "type": "question",
  "kind": "followup",
  "question": "下一個問題"
}
```

回傳評分，`verdict` 是「建議錄取」、「可以考慮」或「暫不建議」，`feedback` 依題目順序各一筆：

```json
{
  "type": "evaluation",
  "score": 75,
  "verdict": "可以考慮",
  "summary": "整體表現總結",
  "strengths": ["表現好的地方"],
  "improvements": ["改進建議"],
  "feedback": [
    { "comment": "這題的評論", "tip": "可以怎麼答得更好" }
  ]
}
```

失敗時回傳 `{ "error": "錯誤訊息" }`：

| 狀態碼 | 情況 |
| --- | --- |
| 400 | 職缺描述太短或太長，或 `history` 格式不正確 |
| 422 | AI 拒絕回答 |
| 500 | `OPENAI_API_KEY` 沒設定 |
| 502 | 連線 OpenAI 失敗（逾時 60 秒）或沒有回傳內容 |
| 其他 | OpenAI 回傳的錯誤，例如 key 失效、額度不足，狀態碼和訊息會直接轉給前端 |

一場面試會呼叫 OpenAI 4 次：出 3 題和評分各一次。

### 修改設定

題數和字數限制都寫在 `src/lib/interview.ts`，前後端共用。面試官的指示和評分標準寫在 `src/app/api/interview/route.ts` 的 `questionPrompt` 和 `EVALUATION_PROMPT`。

### 相關檔案

| 檔案 | 用途 |
| --- | --- |
| `src/app/page.tsx` | 首頁 |
| `src/app/InterviewSimulator.tsx` | 面試流程和評分畫面 |
| `src/app/api/interview/route.ts` | 檢查輸入並呼叫 OpenAI 的 API |
| `src/lib/interview.ts` | 前後端共用的設定和型別 |

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
