import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft,
    ChevronRight,
    ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mocking 10 posts for the example
export const REMINDERS = [
    {
        id: 1,
        user: "DeenDaily",
        title: "Patience & Prayer",
        images: [
            "https://images.unsplash.com/photo-1518398046578-8cca57732e17?q=80&w=1000&auto=format&fit=crop"
        ],
        caption: "Seeking help through patience and prayer. ✨ #Deen",
    },
    {
        id: 2,
        user: "PureIslam",
        title: "Morning Adhkar",
        images: [
            "https://images.unsplash.com/photo-1507035895480-2b3152c71cc1?q=80&w=1000&auto=format&fit=crop"
        ],
        caption: "Don't forget your morning adhkar. 🌅",
    },
    {
        id: 3,
        user: "SunnahPath",
        title: "Kindness",
        images: [
            "https://images.unsplash.com/photo-1523302313333-cc11242940e6?q=80&w=1000&auto=format&fit=crop"
        ],
        caption: "A smile is sadaqah. 😊",
    },
    {
        id: 4,
        user: "GuidanceHub",
        title: "The Quran",
        images: [
            "https://images.unsplash.com/photo-1584281722572-698e46939985?q=80&w=1000&auto=format&fit=crop"
        ],
        caption: "The heart finds rest in the remembrance of Allah.",
    },
    {
        id: 5,
        user: "ImaanBoost",
        title: "Gratitude",
        images: [
            "https://images.unsplash.com/photo-1506784912116-c77da970bf0c?q=80&w=1000&auto=format&fit=crop"
        ],
        caption: "Alhamdulillah for everything. Always.",
    },
    {
        id: 6,
        user: "NoorLife",
        title: "Night Prayer",
        images: [
            "https://images.unsplash.com/photo-1469474099711-422964e7a83d?q=80&w=1000&auto=format&fit=crop"
        ],
        caption: "Tahajjud: The prayer where you whisper to the earth and it's heard in the heavens.",
    },
    {
        id: 7,
        user: "IslamicArt",
        title: "Geometry",
        images: [
            "https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1000&auto=format&fit=crop"
        ],
        caption: "The beauty of Islamic geometry is a reflection of divine order.",
    },
    {
        id: 8,
        user: "PeaceBeWithYou",
        title: "Family",
        images: [
            "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1000&auto=format&fit=crop"
        ],
        caption: "Be kind to your parents. It's a key to Jannah.",
    },
    {
        id: 9,
        user: "HaqqSeeker",
        title: "Truth",
        images: [
            "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=1000&auto=format&fit=crop"
        ],
        caption: "Speak the truth even if it is against yourself.",
    },
    {
        id: 10,
        user: "SpiritSoul",
        title: "Reflection",
        images: [
            "https://images.unsplash.com/photo-1418489098061-ce87b5dc3aee?q=80&w=1000&auto=format&fit=crop"
        ],
        caption: "Take a moment to reflect on the signs of Allah in nature.",
    }
];

export function PostCard({ post }: { post: typeof REMINDERS[0] }) {
    const [currentIdx, setCurrentIdx] = useState(0);

    const nextImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (currentIdx < post.images.length - 1) setCurrentIdx(currentIdx + 1);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
    };

    return (
        <div className="glass-card rounded-[32px] overflow-hidden mb-6 border border-white/[0.03] bg-zinc-900/20 group">
            {/* Carousel Area */}
            <div className="relative aspect-square w-full bg-zinc-900/40 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentIdx}
                        src={post.images[currentIdx]}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full h-full object-cover"
                        alt="Reminder"
                    />
                </AnimatePresence>

                {/* Navigation Arrows */}
                {post.images.length > 1 && (
                    <>
                        {currentIdx > 0 && (
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/10 active:scale-90 transition-all z-10"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                        )}
                        {currentIdx < post.images.length - 1 && (
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/10 active:scale-90 transition-all z-10"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        )}
                    </>
                )}

                {/* Indicators */}
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-1.5 bg-black/20 backdrop-blur-md rounded-full border border-white/5">
                    {post.images.map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                "h-1 rounded-full transition-all duration-300",
                                i === currentIdx ? "bg-emerald-400 w-4" : "bg-white/20 w-1"
                            )}
                        />
                    ))}
                </div>
            </div>

            {/* Info Area */}
            <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{post.user}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{post.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2">{post.caption}</p>
            </div>
        </div>
    );
}

export function DailyReminders({ preview = false }: { preview?: boolean }) {
    const visiblePosts = preview ? REMINDERS.slice(0, 1) : REMINDERS;

    return (
        <section className={cn("px-6 space-y-6 max-w-md mx-auto", preview ? "pb-4" : "pb-32 pt-8")}>
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-zinc-100 tracking-tight">Daily Reminders</h2>
                    <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mt-1">Updated Just Now</p>
                </div>
            </header>

            <div className="space-y-2">
                {visiblePosts.map(post => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>

            {/* See More Action */}
            {preview && (
                <div className="flex flex-col items-center pt-2">
                    <Link
                        to="/reminders"
                        className="group flex items-center gap-3 px-8 py-4 bg-zinc-900/40 border border-white/5 rounded-full hover:bg-emerald-500/10 transition-all active:scale-95 shadow-xl w-full justify-center"
                    >
                        <span className="text-xs font-black text-zinc-400 group-hover:text-emerald-400 uppercase tracking-[0.2em]">
                            View All Reminders
                        </span>
                        <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                            <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                    </Link>
                </div>
            )}
        </section>
    );
}