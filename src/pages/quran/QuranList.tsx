import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronRight, Book, Activity, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNav } from "@/components/layout/BottomNav";

interface Surah {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
    revelationType: string;
}

interface Progress {
    surah: number;
    ayah: number;
    surahName: string;
    timestamp: number;
}

export default function QuranPage() {
    const [surahs, setSurahs] = useState<Surah[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [lastProgress, setLastProgress] = useState<Progress | null>(null);

    useEffect(() => {
        // 1. Get progress
        const saved = localStorage.getItem("quran_progress");

        // 2. Fetch surahs
        fetch("https://api.alquran.cloud/v1/surah")
            .then((res) => res.json())
            .then((data) => {
                // We wrap these in requestAnimationFrame to ensure they happen 
                // after the initial render phase, satisfying Next.js 15 rules.
                requestAnimationFrame(() => {
                    setSurahs(data.data);
                    setLoading(false);

                    if (saved) {
                        try {
                            setLastProgress(JSON.parse(saved));
                        } catch (e) {
                            console.error("Failed to parse progress", e);
                        }
                    }
                });
            })
            .catch((err) => {
                console.error("Error fetching surahs:", err);
                setLoading(false);
            });
    }, []);

    const filteredSurahs = surahs.filter(
        (s) =>
            s.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.name.includes(searchTerm) ||
            s.number.toString() === searchTerm
    );

    return (
        <main className="h-screen text-zinc-100 overflow-hidden font-sans flex flex-col">
            {/* iOS Style Background Elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-emerald-500/10 blur-[100px] rounded-full" />
                <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-blue-500/10 blur-[100px] rounded-full" />
            </div>

            {/* Header */}
            <header className="relative z-10 px-6 pt-16 pb-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight">Quran</h1>
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">The Noble Book</p>
                    </div>
                    <div className="w-10 h-10 rounded-full glass border-white/10 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-emerald-400 opacity-50" />
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search Surah by name or number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full glass border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:ring-1 focus:ring-emerald-500/50 placeholder:text-zinc-600 font-medium"
                    />
                </div>
            </header>

            {/* Surah List */}
            <div className="relative flex-1 overflow-y-auto no-scrollbar px-6 pb-32">
                {lastProgress && !searchTerm && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-3 ml-1">Continue Reading</p>
                        <Link
                            to={`/quran/${lastProgress.surah}`}
                            className="relative overflow-hidden group block p-6 rounded-[32px] bg-gradient-to-br from-emerald-500/20 to-blue-500/5 border border-emerald-500/20"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-700">
                                <Book size={80} />
                            </div>
                            <div className="relative flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-black text-white mb-1">{lastProgress.surahName}</h3>
                                    <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest">
                                        Ayah {lastProgress.ayah + 1}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-active:scale-90 transition-transform">
                                    <Play size={24} className="text-black fill-current ml-1" />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                )}

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4">
                        <div className="w-12 h-12 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                        <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">Loading Surahs...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-3">
                        <AnimatePresence mode="popLayout">
                            {filteredSurahs.map((surah, index) => (
                                <motion.div
                                    key={surah.number}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: Math.min(index * 0.02, 1), duration: 0.4 }}
                                    layout
                                >
                                    <Link
                                        to={`/quran/${surah.number}`}
                                        className="glass-card flex items-center justify-between p-4 rounded-[24px] hover:bg-white/10 transition-all active:scale-95 group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                                                <div className="absolute inset-0 bg-emerald-500/5 rotate-45 rounded-xl border border-emerald-500/10 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/30 transition-all duration-500" />
                                                <span className="relative text-sm font-black text-emerald-400 group-hover:text-emerald-300">
                                                    {surah.number}
                                                </span>
                                            </div>

                                            <div className="flex flex-col">
                                                <span className="text-lg font-black text-zinc-100 leading-none mb-1">
                                                    {surah.englishName}
                                                </span>
                                                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">
                                                    {surah.revelationType === "Meccan" ? "Mecca" : "Medina"} • {surah.numberOfAyahs} Ayahs
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <span className="text-2xl font-amiri font-bold text-zinc-100 block leading-none mb-1" dir="rtl">
                                                    {surah.name}
                                                </span>
                                                <span className="text-[10px] text-emerald-500/40 uppercase tracking-tighter font-bold">
                                                    {surah.englishNameTranslation}
                                                </span>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-zinc-700 group-hover:text-emerald-400 transition-colors" />
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {filteredSurahs.length === 0 && (
                            <div className="text-center py-20">
                                {/* Fixed unescaped quote error here */}
                                <p className="text-zinc-500 font-bold text-sm">No Surahs found matching &quot;{searchTerm}&quot;</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <BottomNav />
        </main>
    );
}