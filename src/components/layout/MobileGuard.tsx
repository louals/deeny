import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Smartphone,
    Share,
    PlusSquare,
    Globe,
    ShieldCheck,
    Zap,
    QrCode,
    LucideIcon
} from "lucide-react";
import { useMotionValue, useMotionTemplate } from "framer-motion";

// 1. Defined Interface for the Step Items
interface StepItem {
    step: string;
    title: string;
    desc: string;
    icon: LucideIcon;
}

export function MobileGuard({ children }: { children: React.ReactNode }) {
    const [isMobile, setIsMobile] = useState<boolean | null>(null);

    useEffect(() => {
        const checkDevice = () => {
            const width = window.innerWidth;
            const mobileAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            setIsMobile(width < 1024 || mobileAgent);
        };

        checkDevice();
        window.addEventListener("resize", checkDevice);
        return () => window.removeEventListener("resize", checkDevice);
    }, []);

    if (isMobile === null) return null;

    if (isMobile) {
        return <>{children}</>;
    }

    return <DesktopMarketing />;
}

// 2. Fixed 'any' and 'prefer-const' errors
function StepCard({ item, index }: { item: StepItem; index: number }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            onMouseMove={handleMouseMove}
            className="group relative p-8 rounded-[40px] transition-all duration-500 bg-white/[0.01] transform-gpu translate-z-0 isolate"
        >
            <div className="absolute inset-0 rounded-[40px] bg-white/[0.03] backdrop-blur-xl z-[-2]" />

            <motion.div
                className="pointer-events-none absolute inset-0 rounded-[40px] opacity-0 group-hover:opacity-100 transition duration-300 z-[-1]"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            400px circle at ${mouseX}px ${mouseY}px,
                            rgba(16, 185, 129, 0.12),
                            transparent 80%
                        )
                    `,
                }}
            />

            <div className="absolute inset-0 rounded-[40px] border border-white/5 group-hover:border-emerald-500/30 transition-colors duration-500 pointer-events-none z-[1] transform-gpu" />

            <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:bg-emerald-500 transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                    <item.icon className="w-6 h-6 text-zinc-400 group-hover:text-black transition-colors duration-500" />
                </div>
                <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">{item.step}</span>
                <h3 className="text-2xl font-black text-white mb-4 group-hover:text-emerald-400 transition-colors">{item.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed font-medium group-hover:text-zinc-300 transition-colors">
                    {item.desc}
                </p>
            </div>
        </motion.div>
    );
}

function DesktopMarketing() {
    return (
        <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-emerald-500/30 overflow-x-hidden">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[60%] bg-blue-500/5 blur-[120px] rounded-full" />
            </div>

            <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-40">
                <nav className="flex items-center justify-between mb-32">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center">
                            <img src="/logo-transparent.png" alt="Logo" className="w-[120px] h-[120px]" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter">DEENY</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-zinc-500">
                        <a href="#" className="hover:text-emerald-400 transition-colors">Features</a>
                        <a href="#" className="hover:text-emerald-400 transition-colors">Install</a>
                        <a href="#" className="hover:text-emerald-400 transition-colors">About</a>
                    </div>

                    <button className="px-6 h-12 rounded-full glass border-white/10 text-xs font-black uppercase tracking-widest hover:border-emerald-500/50 transition-all active:scale-95">
                        Get Started
                    </button>
                </nav>

                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                            <ShieldCheck size={14} />
                            Mobile-First Experience
                        </div>

                        <h1 className="text-7xl xl:text-8xl font-black tracking-tight leading-[0.9] mb-8">
                            Your Spiritual <br />
                            <span className="text-emerald-500">Companion.</span>
                        </h1>

                        <p className="text-zinc-500 text-xl leading-relaxed max-w-lg mb-12 font-medium">
                            A premium, focused experience for Quran, Adhkar, and Prayer Times. Designed exclusively for your mobile device.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="p-6 rounded-[32px] glass border-white/5 flex gap-6 items-center flex-1">
                                <div className="w-20 h-20 bg-white rounded-2xl shrink-0 p-2 border-4 border-emerald-500/20">
                                    <QrCode className="w-full h-full text-black" />
                                </div>
                                <div>
                                    <p className="text-white font-black text-lg leading-tight mb-1">Scan to Start</p>
                                    <p className="text-zinc-500 text-xs font-bold leading-tight uppercase tracking-widest">Open on phone</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-emerald-500/20 blur-[150px] rounded-full mix-blend-screen" />
                        <div className="relative z-10 flex justify-center lg:justify-end">
                            <div className="w-[380px] h-[780px] bg-[#0c0c0c] rounded-[60px] border-[12px] border-zinc-900 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-8 bg-zinc-900 rounded-b-3xl z-50 px-6 flex items-center justify-center">
                                    <div className="w-12 h-1 bg-zinc-800 rounded-full" />
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center bg-[emerald-500/5] group-hover:bg-emerald-500/10 transition-all duration-1000">
                                    <img src="/logo-transparent.png" alt="Logo" className="w-[120px] h-[120px]" />
                                </div>
                                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                    <div className="mb-8">
                                        <div className="w-20 h-3 bg-white/20 rounded-full mb-3" />
                                        <div className="w-full h-4 bg-white/10 rounded-full mb-2" />
                                        <div className="w-3/4 h-4 bg-white/10 rounded-full" />
                                    </div>
                                    <div className="grid grid-cols-4 gap-4">
                                        {Array.from({ length: 4 }).map((_, i) => (
                                            <div key={i} className="aspect-square bg-emerald-500/20 rounded-2xl" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <section className="mt-60 border-t border-white/10 pt-40">
                    <div className="text-center mb-24">
                        <h2 className="text-5xl font-black tracking-tight mb-4">Add to Home Screen</h2>
                        <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-sm">Four simple steps to premium tranquility</p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            {
                                step: "01",
                                title: "Scan & Open",
                                desc: "Scan the QR code or visit deen.app on your mobile browser (Safari or Chrome).",
                                icon: Smartphone
                            },
                            {
                                step: "02",
                                title: "Tap Share",
                                desc: "Tap the center 'Share' button on Safari or the three-dot menu on Chrome.",
                                icon: Share
                            },
                            {
                                step: "03",
                                title: "Add to Home",
                                desc: "Scroll down and select the 'Add to Home Screen' option from the menu.",
                                icon: PlusSquare
                            },
                            {
                                step: "04",
                                title: "Launch Deeny",
                                desc: "Open the app from your home screen for an immersive fullscreen experience.",
                                icon: Zap
                            }
                        ].map((item, i) => (
                            <StepCard key={i} item={item} index={i} />
                        ))}
                    </div>
                </section>

                <footer className="mt-60 text-center border-t border-white/10 pt-20">
                    <p className="text-zinc-500 font-bold uppercase tracking-[0.5em] text-[10px] mb-8">Crafted with devotion</p>
                    <div className="flex justify-center gap-12 opacity-30">
                        <Globe size={20} />
                        <Zap size={20} />
                        <ShieldCheck size={20} />
                    </div>
                </footer>
            </main>
        </div>
    );
}