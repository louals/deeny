import { BottomNav } from "@/components/layout/BottomNav";
import { PrayerTimes } from "@/components/sections/PrayerTimes";
import { DailyReminders } from "@/components/sections/DailyReminders";
import { QuranResumeCard } from "@/components/sections/QuranResumeCard";

export default function Home() {
  return (
    <main className="h-screen text-zinc-100 overflow-hidden font-sans flex flex-col">
      {/* iOS Style Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-500/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative flex-1 max-w-4xl mx-auto w-full space-y-8 overflow-y-auto no-scrollbar pb-32">
        <PrayerTimes />
        <QuranResumeCard />
        <DailyReminders preview={true} />
      </div>

      {/* Global Nav */}
      <BottomNav />
    </main>
  );
}
