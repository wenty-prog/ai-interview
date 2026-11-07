import InterviewSimulator from "./InterviewSimulator";

export default function Home() {
  return (
    <div className="flex flex-1 justify-center bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-zinc-100">
      <main className="flex w-full max-w-2xl flex-col gap-8 px-4 py-16">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">AI 面試模擬器</h1>
          <p className="mt-2 text-zinc-500">貼上職缺描述，AI 面試官會問你三題，答完後給你評分和建議。</p>
        </div>
        <InterviewSimulator />
      </main>
    </div>
  );
}
