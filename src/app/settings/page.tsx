import type { Metadata } from "next";
import ApiKeySettings from "./ApiKeySettings";

export const metadata: Metadata = {
  title: "設定",
  description: "輸入你自己的 OpenAI API key，key 只會存在你的瀏覽器。",
};

// 設定頁：使用者輸入自己的 OpenAI API key（BYOK）
export default function SettingsPage() {
  return (
    <main className="relative flex-1">
      <div className="bg-grid pointer-events-none absolute inset-x-0 top-0 h-80" />
      <div className="relative mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 pb-24 pt-12 sm:px-6 sm:pt-16">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">設定</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">OpenAI API key</h1>
          <p className="mt-3 leading-7 text-muted">
            Interview Lab 使用你自己的 OpenAI API key 呼叫 AI，費用會算在你的 OpenAI 帳號。key 可以到 OpenAI 後台的 API keys 頁面建立。
          </p>
        </div>
        <ApiKeySettings />
      </div>
    </main>
  );
}
