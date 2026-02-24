import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Heart, ChevronRight, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import adhkarData from "@/data/adhkar.json";
import { BottomNav } from "@/components/layout/BottomNav";

export default function AdhkarCategoriesPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredCategories = adhkarData.filter(cat =>
        cat.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <main className="h-screen text-zinc-100 overflow-hidden font-sans flex flex-col">
            {/* iOS Style Background Elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full" />
            </div>

            {/* Header */}
            <header className="relative z-10 px-6 pt-16 pb-6">
                <h1 className="text-4xl font-bold tracking-tight mb-6">Adhkar</h1>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full glass border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:ring-1 focus:ring-emerald-500/50 placeholder:text-zinc-600 font-medium"
                    />
                </div>
            </header>

            {/* Categories List */}
            <div className="relative flex-1 overflow-y-auto no-scrollbar px-6 pb-32">
                <div className="grid grid-cols-1 gap-3">
                    {filteredCategories.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03, duration: 0.4 }}
                        >
                            <Link
                                to={`/adhkar/${item.id}`}
                                className="glass-card flex items-center justify-between p-5 rounded-[24px] hover:bg-white/10 transition-all active:scale-95 group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                                        <BookOpen className="w-6 h-6 text-emerald-400 group-hover:text-inherit" />
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-lg font-bold text-zinc-100 text-right" dir="rtl">{item.category}</span>
                                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                                            {item.array.length} Duas
                                        </span>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>

            <BottomNav />
        </main>
    );
}
