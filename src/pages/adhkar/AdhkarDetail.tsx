import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    ChevronLeft,
    Play,
    Pause,
    Home,
    Settings,
    Check
} from "lucide-react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { cn } from "@/lib/utils";
import adhkarData from "@/data/adhkar.json";

// 1. Defined strict interfaces to replace 'any'
interface Ayah {
    ayahNumber: number;
    text: string;
}

interface Surah {
    name?: string;
    bismillah?: string;
    ayat: Ayah[];
}

interface AdhkarItem {
    id: number;
    text: string;
    repeat: number;
    audio: string;
    preText?: string;
    postText?: string;
    surahs?: Surah[];
}

interface Category {
    id: number;
    category: string;
    array: AdhkarItem[];
}

export default function AdhkarDetailPage() {
    const params = useParams();
    const navigate = useNavigate();
    const id = parseInt(params.id as string);
    const categoryData = (adhkarData as Category[]).find(c => c.id === id);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [counts, setCounts] = useState<Record<number, number>>({});
    const [playing, setPlaying] = useState(false);
    const [direction, setDirection] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (categoryData) {
            const initialCounts: Record<number, number> = {};
            categoryData.array.forEach(z => {
                initialCounts[z.id] = z.repeat;
            });
            requestAnimationFrame(() => {
                setCounts(initialCounts);
            });
        }
    }, [id]);

    const handleNext = useCallback(() => {
        if (categoryData && currentIndex < categoryData.array.length - 1) {
            setDirection(1);
            setCurrentIndex(prev => prev + 1);
            setPlaying(false);
        }
    }, [categoryData, currentIndex]);

    const handlePrev = useCallback(() => {
        if (currentIndex > 0) {
            setDirection(-1);
            setCurrentIndex(prev => prev - 1);
            setPlaying(false);
        }
    }, [currentIndex]);

    if (!categoryData) return null;

    const currentZekr = categoryData.array[currentIndex];
    const totalItems = categoryData.array.length;
    const remaining = counts[currentZekr.id] ?? currentZekr.repeat;
    const isDone = remaining === 0;

    const handleCount = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (remaining > 0) {
            if (typeof window !== "undefined" && window.navigator.vibrate) {
                window.navigator.vibrate([15]);
            }
            const newCount = remaining - 1;
            setCounts(prev => ({ ...prev, [currentZekr.id]: newCount }));

            if (newCount === 0 && currentIndex < totalItems - 1) {
                setTimeout(handleNext, 300);
            }
        } else {
            handleNext();
        }
    };

    const toggleAudio = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (playing) {
            audioRef.current?.pause();
            setPlaying(false);
        } else if (audioRef.current) {
            audioRef.current.src = currentZekr.audio;
            audioRef.current.play().catch(() => setPlaying(false));
            setPlaying(true);
        }
    };

    const handleDragEnd = (_: unknown, info: PanInfo) => {
        if (info.offset.x > 80) handlePrev();
        else if (info.offset.x < -80) handleNext();
    };

    const variants = {
        enter: (d: number) => ({ x: d > 0 ? 200 : -200, opacity: 0 }),
        center: { zIndex: 1, x: 0, opacity: 1 },
        exit: (d: number) => ({ zIndex: 0, x: d < 0 ? 200 : -200, opacity: 0 })
    };

    return (
        <main className="h-screen text-zinc-100 overflow-hidden font-sans flex flex-col bg-[#0a192f]">
            <audio ref={audioRef} onEnded={() => setPlaying(false)} onError={() => setPlaying(false)} />

            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[100%] h-[60%] bg-emerald-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full" />
            </div>

            <header className="relative z-20 pt-12 px-6 space-y-4 bg-[#0a192f]/50 backdrop-blur-xl pb-4 text-left">
                <div className="flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-zinc-300 hover:text-white transition-colors">
                        <ChevronLeft className="w-8 h-8" />
                    </button>
                    <div className="flex items-center gap-2">
                        <Link to="/" className="p-2 text-zinc-300 hover:text-white transition-colors">
                            <Home className="w-6 h-6" />
                        </Link>
                        <button className="p-2 text-zinc-300 hover:text-white transition-colors">
                            <Settings className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-2xl font-bold tracking-tight text-white/90">{categoryData.category}</h1>
                    <div className="inline-flex items-center px-4 py-1.5 glass rounded-full border-white/10 shadow-lg">
                        <span className="text-sm font-black tracking-widest text-zinc-300 tabular-nums">
                            {currentIndex + 1}/{totalItems}
                        </span>
                    </div>
                </div>
            </header>

            <div className="flex-1 relative z-10 overflow-hidden">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ x: { type: "spring", stiffness: 500, damping: 45, mass: 0.8 }, opacity: { duration: 0.15 } }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.35}
                        onDragEnd={handleDragEnd}
                        className="h-full w-full overflow-y-auto no-scrollbar px-6 pb-48 pt-4 space-y-8"
                    >
                        <div className="text-right select-none min-h-[60vh] flex items-center justify-center w-full">
                            <div className="w-full space-y-4" dir="rtl">
                                {currentZekr.preText && (
                                    <p className="text-center text-sm font-bold text-emerald-400/60 italic mb-6">{currentZekr.preText}</p>
                                )}
                                {currentZekr.surahs && currentZekr.surahs.length > 0 ? (
                                    currentZekr.surahs.map((surah, sIdx) => (
                                        <div key={sIdx} className="space-y-3">
                                            {surah.name && (
                                                <div className="text-center">
                                                    <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black tracking-widest uppercase">{surah.name}</span>
                                                </div>
                                            )}
                                            {surah.bismillah && <p className="text-center text-[22px] font-amiri font-bold text-white/50 leading-none">{surah.bismillah}</p>}
                                            <div className="flex flex-wrap justify-center gap-x-1 gap-y-2 leading-[1.3] text-[19px] font-amiri font-bold text-white">
                                                {surah.ayat.map((ayah, aIdx) => (
                                                    <span key={aIdx} className="text-right">{ayah.text}{aIdx < surah.ayat.length - 1 && <span className="mx-0.5 opacity-40">،</span>}</span>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-[16px] leading-[1.3] font-amiri font-bold text-white text-center whitespace-pre-wrap">{currentZekr.text}</p>
                                )}
                                {currentZekr.postText && (
                                    <p className="text-center text-sm font-bold text-emerald-400/60 italic mt-8 border-t border-emerald-500/10 pt-6">{currentZekr.postText}</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="fixed bottom-0 left-0 right-0 z-30 pb-6 pt-6 px-8 flex items-center justify-center gap-5 bg-gradient-to-t from-[#0a192f] via-[#0a192f]/95 to-transparent pointer-events-none">
                <div className="pointer-events-auto flex items-center gap-5">
                    <motion.button whileTap={{ scale: 0.92 }} onClick={toggleAudio} className={cn("h-9 px-4 rounded-full flex items-center gap-1.5 border transition-all duration-300", playing ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" : "bg-white/[0.07] border-white/10 text-zinc-400")}>
                        {playing ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                        <span className="text-[11px] font-medium">Audio</span>
                    </motion.button>

                    {(() => {
                        const total = currentZekr.repeat || 1;
                        const progress = Math.max(0, Math.min(1, (total - remaining) / total));
                        const r = 33;
                        const circumference = 2 * Math.PI * r;
                        const offset = circumference * (1 - progress);

                        return (
                            <motion.button onClick={handleCount} whileTap={{ scale: 0.88 }} className="relative flex items-center justify-center w-[88px] h-[88px]">
                                <svg width="88" height="88" className="absolute inset-0" style={{ rotate: "-90deg" }}>
                                    <circle cx="44" cy="44" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                                    <motion.circle cx="44" cy="44" r={r} fill="none" stroke={isDone ? "#10b981" : "#34d399"} strokeWidth="4" strokeLinecap="round" strokeDasharray={circumference} animate={{ strokeDashoffset: offset }} style={{ filter: isDone ? "drop-shadow(0 0 6px #10b981)" : "none" }} />
                                </svg>
                                <div className={cn("absolute w-[70px] h-[70px] rounded-full transition-all duration-500", isDone ? "bg-emerald-500/15" : "bg-white/[0.05]")} />
                                {isDone ? <Check className="w-6 h-6 text-emerald-400" /> : <span className="text-2xl font-bold text-white">{remaining}</span>}
                            </motion.button>
                        );
                    })()}
                </div>
            </div>
        </main>
    );
}