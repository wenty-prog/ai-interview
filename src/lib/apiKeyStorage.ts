"use client";

// BYOK：使用者的 OpenAI API key 只存在自己瀏覽器的 localStorage，不會存到我們的伺服器。
// 用 useSyncExternalStore 讓所有用到 key 的元件（導覽列、設定頁、面試頁）同步更新。

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "interview-lab:openai-api-key";
// 同一個分頁裡修改 key 時發出的事件；其他分頁修改會觸發瀏覽器內建的 storage 事件
const CHANGE_EVENT = "interview-lab:api-key-change";

// 無痕模式或封鎖網站資料時 localStorage 可能會丟錯，所以都包在 try/catch 裡
export function getStoredApiKey(): string {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

// 儲存成功回傳 true；瀏覽器不允許儲存時回傳 false
export function saveApiKey(key: string): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, key);
    window.dispatchEvent(new Event(CHANGE_EVENT));
    return true;
  } catch {
    return false;
  }
}

export function clearApiKey(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // 沒辦法存取 localStorage 時本來就沒有 key，不用處理
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === STORAGE_KEY) onChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

// 伺服器端渲染時沒有 localStorage，先當成沒有 key，瀏覽器載入後會自動更新
const getServerSnapshot = () => "";

// 讀取目前儲存的 key，沒設定時是空字串
export function useApiKey(): string {
  return useSyncExternalStore(subscribe, getStoredApiKey, getServerSnapshot);
}

// 遮住中間的字元，畫面上只顯示頭尾，例如 sk-pro…a1B2
export function maskApiKey(key: string): string {
  return key.length <= 12 ? "•".repeat(key.length) : `${key.slice(0, 6)}…${key.slice(-4)}`;
}
