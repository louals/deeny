import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, X, Star } from "lucide-react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { cn } from "@/lib/utils";

// 1. Precise Interfaces to replace "any"
interface Ayah {
    number: number;
    text: string;
    numberInSurah: number;
    juz: number;
    page: number;
}

interface SurahData {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    revelationType: string;
    numberOfAyahs: number;
    ayahs: Ayah[];
}

export default function SurahDetailPage() {
    const params = useParams();
    const navigate = useNavigate();
    const [surah, setSurah] = useState<SurahData | null>(null);
    const [loading, setLoading] = useState(true);
    const [ayahIndex, setAyahIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const surahId = parseInt(params.id as string);

    // 2. Fetch logic wrapped in useCallback to avoid cascading renders
    const loadSurah = useCallback(async (id: number) => {
        try {
            const res = await fetch(`https://api.alquran.cloud/v1/surah/${id}`);
            const data = await res.json();

            if (data.data) {
                setSurah(data.data);

                // Handle initial ayah index from localStorage
                const saved = localStorage.getItem("quran_progress");
                if (saved) {
                    const { surah: savedSurah, ayah: savedAyah } = JSON.parse(saved);
                    setAyahIndex(savedSurah === id ? savedAyah : 0);
                } else {
                    setAyahIndex(0);
                }
            }
        } catch (err) {
            console.error("Error fetching surah:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isNaN(surahId)) {
            setLoading(true);
            loadSurah(surahId);
        }
    }, [surahId, loadSurah]);

    // 3. Save progress logic
    useEffect(() => {
        if (surah && !loading) {
            localStorage.setItem("quran_progress", JSON.stringify({
                surah: surahId,
                ayah: ayahIndex,
                surahName: surah.englishName,
                timestamp: Date.now()
            }));
        }
    }, [surahId, ayahIndex, surah, loading]);

    const handleNext = () => {
        if (!surah) return;
        if (ayahIndex < surah.ayahs.length - 1) {
            setDirection(1);
            setAyahIndex(prev => prev + 1);
        } else if (surahId < 114) {
            setDirection(1);
            navigate(`/quran/${surahId + 1}`);
        }
    };

    const handlePrev = () => {
        if (!surah) return;
        if (ayahIndex > 0) {
            setDirection(-1);
            setAyahIndex(prev => prev - 1);
        } else if (surahId > 1) {
            setDirection(-1);
            navigate(`/quran/${surahId - 1}`);
        }
    };

    const handleDragEnd = (_: unknown, info: PanInfo) => {
        const threshold = 50;
        if (info.offset.x > threshold) {
            handlePrev();
        } else if (info.offset.x < -threshold) {
            handleNext();
        }
    };

    if (loading && !surah) {
        return (
            <div className="h-screen bg-[#0a0a0a] flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin" />
                <p className="text-zinc-500 font-black text-[10px] uppercase tracking-[0.2em]">Preparing Revelation</p>
            </div>
        );
    }

    const variants = {
        enter: (d: number) => ({
            x: d > 0 ? 280 : -280,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (d: number) => ({
            x: d < 0 ? 280 : -280,
            opacity: 0,
        })
    };

    const currentAyah = surah?.ayahs[ayahIndex];
    let displayText = currentAyah?.text || "";

    // Clean Bismillah logic
    if (ayahIndex === 0 && surah?.number !== 1 && surah?.number !== 9) {
        const bismillahAPI = "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ";
        if (displayText.startsWith(bismillahAPI)) {
            displayText = displayText.substring(bismillahAPI.length).trim();
        }
        const bismillahRegex = /^بِ?سۡ?مِ?\s+ٱ?للَّ?هِ?\s+ٱ?لرَّ?حۡ?مَ?ـٰ?نِ?\s+ٱ?لرَّ?حِ?یمِ?\s*/u;
        displayText = displayText.replace(bismillahRegex, "").trim();
    }

    return (
        <main className="h-screen bg-[#0a0a0a] text-zinc-100 overflow-hidden font-sans flex flex-col">
            <header className="relative z-20 px-6 pt-14 pb-4 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <motion.h1 key={`title-${surahId}`} className="text-lg font-black tracking-tight leading-none">
                            {surah?.englishName}
                        </motion.h1>
                    </div>

                    <div className="px-4 py-1.5 rounded-full glass border-emerald-500/20">
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none">
                            Ayah {ayahIndex + 1} / {surah?.numberOfAyahs}
                        </span>
                    </div>

                    <div className="text-right">
                        <span className="text-xl font-amiri font-bold text-white/50 block leading-none" dir="rtl">
                            {surah?.name}
                        </span>
                    </div>
                </div>
            </header>

            <div className="relative flex-1 flex flex-col items-center justify-center p-8">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={`${surahId}-${ayahIndex}`}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 500, damping: 45, mass: 0.8 },
                            opacity: { duration: 0.15 }
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.6}
                        onDragEnd={handleDragEnd}
                        className="w-full flex flex-col items-center text-center space-y-12"
                    >
                        {ayahIndex === 0 && surah?.number !== 1 && surah?.number !== 9 && (
                            <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 0.4, y: 0 }} className="text-[24px] font-amiri font-bold absolute top-12">
                                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                            </motion.p>
                        )}

                        <div className="w-full" dir="rtl">
                            <h2 className="text-[32px] md:text-[42px] leading-[1.4] font-amiri font-bold text-white tracking-tight">
                                {displayText}
                            </h2>
                        </div>

                        <div className="flex items-center gap-6 opacity-20">
                            <div className="w-12 h-px bg-gradient-to-r from-transparent to-white" />
                            <Star className="w-4 h-4" />
                            <div className="w-12 h-px bg-gradient-to-l from-transparent to-white" />
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="fixed bottom-0 left-0 right-0 z-30 pb-12 px-8 pt-10 flex flex-col items-center bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent pointer-events-none">
                <div className="flex items-center justify-between w-full max-w-md pointer-events-auto">
                    <button onClick={handlePrev} disabled={surahId === 1 && ayahIndex === 0} className={cn("w-14 h-14 rounded-full glass border-white/5 flex items-center justify-center transition-all active:scale-90", (surahId === 1 && ayahIndex === 0) ? "opacity-10 cursor-not-allowed" : "hover:bg-white/10")}>
                        <ChevronLeft className="w-7 h-7 text-emerald-400" />
                    </button>

                    <button onClick={() => navigate("/quran")} className="flex-1 mx-6 h-14 rounded-[24px] glass border-emerald-500/10 flex items-center justify-center gap-3 active:scale-95 transition-all hover:bg-emerald-500/5 group">
                        <X className="w-5 h-5 text-zinc-500 group-hover:text-emerald-400 group-hover:rotate-90 transition-all duration-300" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 group-hover:text-emerald-400">I&apos;m done</span>
                    </button>

                    <button onClick={handleNext} disabled={surahId === 114 && ayahIndex === (surah?.ayahs.length ?? 0) - 1} className={cn("w-14 h-14 rounded-full glass border-white/5 flex items-center justify-center transition-all active:scale-90", (surahId === 114 && ayahIndex === (surah?.ayahs.length ?? 0) - 1) ? "opacity-10 cursor-not-allowed" : "hover:bg-white/10")}>
                        <ChevronRight className="w-7 h-7 text-emerald-400" />
                    </button>
                </div>
            </div>
        </main>
    );
}