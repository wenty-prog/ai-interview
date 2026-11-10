"use client";

import Link from "next/link";
import { useState } from "react";
import { clearApiKey, maskApiKey, saveApiKey, useApiKey } from "@/lib/apiKeyStorage";
import { MAX_API_KEY_LENGTH, isValidApiKeyFormat } from "@/lib/interview";

const card = "rounded-3xl border border-line bg-surface p-6 shadow-[0_24px_48px_-32px_rgba(22,20,15,0.35)] sm:p-8";
const fieldLabel = "font-mono text-xs uppercase tracking-[0.18em] text-muted";

// 輸入、儲存、清除 API key；key 只存在瀏覽器的 localStorage
export default function ApiKeySettings() {
  const storedKey = useApiKey();
  const [input, setInput] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const trimmed = input.trim();

  function save(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isValidApiKeyFormat(trimmed)) {
      setMessage({ ok: false, text: "格式不正確：OpenAI API key 應該是 sk- 開頭，而且不能有空白。" });
      return;
    }
    if (!saveApiKey(trimmed)) {
      setMessage({ ok: false, text: "瀏覽器不允許儲存資料（可能是無痕模式或封鎖了網站資料），請調整設定後再試。" });
      return;
    }
    setInput("");
    setShowKey(false);
    setMessage({ ok: true, text: "已儲存，可以開始面試了。" });
  }

  function remove() {
    clearApiKey();
    setMessage({ ok: true, text: "已從這個瀏覽器清除 API key。" });
  }

  return (
    <div className="flex flex-col gap-6">
      <section className={`flex flex-col gap-4 ${card}`}>
        <p className={fieldLabel}>目前狀態</p>
        {storedKey ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-center gap-2">
              <span aria-hidden className="size-2.5 rounded-full bg-ok" />
              已設定 <code className="rounded-md bg-paper px-2 py-0.5 font-mono text-sm">{maskApiKey(storedKey)}</code>
            </p>
            <div className="flex items-center gap-4 text-sm font-medium">
              <Link href="/interview" className="text-accent hover:underline">
                開始面試 →
              </Link>
              <button type="button" onClick={remove} className="text-muted transition hover:text-red-600">
                清除 key
              </button>
            </div>
          </div>
        ) : (
          <p className="flex items-center gap-2 text-muted">
            <span aria-hidden className="size-2.5 rounded-full bg-line" />
            還沒設定 API key
          </p>
        )}
      </section>

      <form onSubmit={save} className={`flex flex-col gap-4 ${card}`}>
        <label htmlFor="api-key" className={fieldLabel}>
          {storedKey ? "更換 API key" : "輸入 API key"}
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="api-key"
            type={showKey ? "text" : "password"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={MAX_API_KEY_LENGTH}
            autoComplete="off"
            spellCheck={false}
            placeholder="sk-..."
            className="min-w-0 flex-1 rounded-2xl border border-line bg-paper px-4 py-3 font-mono text-sm text-ink placeholder:text-muted/70 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15"
          />
          <button
            type="button"
            onClick={() => setShowKey((v) => !v)}
            className="rounded-2xl border border-line px-4 py-3 text-sm font-medium text-muted transition hover:text-ink"
          >
            {showKey ? "隱藏" : "顯示"}
          </button>
        </div>
        <button
          type="submit"
          disabled={!trimmed}
          className="inline-flex items-center gap-2 self-start rounded-full bg-ink px-7 py-3.5 font-semibold text-paper transition hover:opacity-90 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40"
        >
          儲存
        </button>
        <div aria-live="polite">
          {message && (
            <p className={`text-sm ${message.ok ? "text-ok" : "text-red-600 dark:text-red-400"}`}>{message.text}</p>
          )}
        </div>
      </form>

      <ul className="list-disc space-y-1.5 pl-5 text-sm leading-6 text-muted">
        <li>key 只存在這個瀏覽器的 localStorage，換瀏覽器或清除網站資料後要重新輸入。</li>
        <li>每次面試請求會把 key 帶到我們的伺服器，再轉送給 OpenAI；伺服器不會儲存或記錄你的 key。</li>
        <li>在共用電腦上使用後，記得按「清除 key」。建議在 OpenAI 後台替這把 key 設定用量上限。</li>
      </ul>
    </div>
  );
}
