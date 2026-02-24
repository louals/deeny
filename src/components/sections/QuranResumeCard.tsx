import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, BookOpen } from "lucide-react";

interface QuranProgress {
    surah: number;
    ayah: number;
    surahName: string;
    timestamp: number;
}

export function QuranResumeCard() {
    const [progress, setProgress] = useState<QuranProgress | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("quran_progress");

        requestAnimationFrame(() => {
            setMounted(true);
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    if (parsed && parsed.surahName) {
                        setProgress(parsed);
                    }
                } catch (e) {
                    console.error("Corrupted progress data", e);
                }
            }
        });
    }, []);

    // Prevent hydration mismatch (server vs client content difference)
    if (!mounted || !progress) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="px-6 max-w-md mx-auto"
        >
            <Link
                to={`/quran/${progress.surah}`}
                className="group flex items-center justify-between w-full glass border-emerald-500/10 hover:border-emerald-500/30 rounded-[24px] px-5 py-4 transition-all active:scale-[0.98] hover:bg-emerald-500/5"
            >
                <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full glass border-white/5 flex items-center justify-center shrink-0">
                        <BookOpen className="w-5 h-5 text-emerald-400" />
                    </div>

                    <div className="text-left">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 group-hover:text-emerald-400 transition-colors mb-0.5">
                            Continue Reading
                        </p>
                        <p className="text-white font-bold text-sm leading-tight">
                            {progress.surahName}
                        </p>
                        <p className="text-zinc-500 text-[11px] font-medium">
                            Ayah {progress.ayah + 1}
                        </p>
                    </div>
                </div>

                <div className="w-11 h-11 rounded-full glass border-white/5 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/5 transition-all">
                    <ChevronRight className="w-5 h-5 text-emerald-400" />
                </div>
            </Link>
        </motion.div>
    );
}