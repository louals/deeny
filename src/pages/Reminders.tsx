import { DailyReminders } from "@/components/sections/DailyReminders";
import { BottomNav } from "@/components/layout/BottomNav";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function RemindersPage() {
    return (
        <main className="h-screen text-zinc-100 overflow-hidden font-sans flex flex-col">
            {/* iOS Style Background Elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full" />
            </div>

            {/* Header */}
            <div className="relative z-10 px-6 pt-12 pb-4 flex items-center gap-4">
                <Link
                    to="/"
                    className="w-10 h-10 rounded-full glass flex items-center justify-center text-white active:scale-90 transition-all"
                >
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-xl font-bold tracking-tight">All Reminders</h1>
            </div>

            <div className="relative flex-1 overflow-y-auto no-scrollbar">
                <DailyReminders preview={false} />
            </div>

            {/* Global Nav */}
            <BottomNav />
        </main>
    );
}
