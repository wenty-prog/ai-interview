"use client";

import Link from "next/link";
import { useApiKey } from "@/lib/apiKeyStorage";

// 導覽列的「設定」連結；還沒設定 API key 時加上橙色圓點提醒
export default function SettingsLink() {
  const hasKey = useApiKey() !== "";
  return (
    <Link
      href="/settings"
      className="relative text-sm font-medium text-muted transition hover:text-ink"
      aria-label={hasKey ? "設定" : "設定（還沒設定 API key）"}
    >
      設定
      {!hasKey && <span aria-hidden className="absolute -right-2.5 -top-0.5 size-2 rounded-full bg-accent" />}
    </Link>
  );
}
