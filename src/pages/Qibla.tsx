import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Navigation, AlertCircle, RefreshCw, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { BottomNav } from "@/components/layout/BottomNav";

// 1. Defined Interface for iOS Permission API
interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
    requestPermission?: () => Promise<"granted" | "denied">;
    webkitCompassHeading?: number;
}

export default function QiblaPage() {
    const [heading, setHeading] = useState<number | null>(null);
    const [qiblaDir, setQiblaDir] = useState<number | null>(null);
    const [status, setStatus] = useState<"idle" | "requesting" | "calibrating" | "active" | "error">("idle");
    const [error, setError] = useState<string | null>(null);

    // 2. Fixed 'location' unused warning by removing it (or keeping if needed later, but here it was unused)
    const isIOS = typeof window !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);

    const calculateQibla = (lat: number, lon: number) => {
        const φ1 = (lat * Math.PI) / 180;
        const λ1 = (lon * Math.PI) / 180;
        const φ2 = (21.4225 * Math.PI) / 180;
        const λ2 = (39.8262 * Math.PI) / 180;

        const y = Math.sin(λ2 - λ1);
        const x = Math.cos(φ1) * Math.tan(φ2) - Math.sin(φ1) * Math.cos(λ2 - λ1);
        // 3. Changed let to const for 'qibla' to satisfy 'prefer-const'
        const qibla = (Math.atan2(y, x) * 180) / Math.PI;
        return (qibla + 360) % 360;
    };

    const handleOrientation = (e: DeviceOrientationEvent) => {
        const event = e as DeviceOrientationEventiOS;
        let h = 0;
        if (event.webkitCompassHeading !== undefined) {
            h = event.webkitCompassHeading;
        } else if (event.alpha !== null) {
            h = 360 - event.alpha; // Android
        }
        setHeading(h);
    };

    const startFinder = async () => {
        setStatus("requesting");
        setError(null);

        try {
            if (!navigator.geolocation) {
                throw new Error("Geolocation is not supported by your browser");
            }

            await new Promise(r => setTimeout(r, 500));

            const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    resolve,
                    (err) => {
                        if (err.code === err.PERMISSION_DENIED) {
                            reject(new Error("Location permission denied. Please enable location access to use the Qibla finder."));
                        } else {
                            reject(err);
                        }
                    },
                    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
                );
            });

            const { latitude, longitude } = pos.coords;
            const qDir = calculateQibla(latitude, longitude);
            setQiblaDir(qDir);

            // 4. Safe check for iOS permission
            const DeviceOrientation = DeviceOrientationEvent as unknown as {
                requestPermission?: () => Promise<"granted" | "denied">;
            };

            if (isIOS && typeof DeviceOrientation.requestPermission === "function") {
                const response = await DeviceOrientation.requestPermission();
                if (response !== "granted") {
                    throw new Error("Compass permission denied. Please allow motion access to use the compass.");
                }
            }

            window.addEventListener("deviceorientation", handleOrientation, true);
            setStatus("calibrating");

            setTimeout(() => {
                setStatus("active");
            }, 4000);

        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "An error occurred";
            setError(message);
            setStatus("error");
        }
    };

    useEffect(() => {
        return () => {
            window.removeEventListener("deviceorientation", handleOrientation);
        };
    }, []);

    const relativeQibla = qiblaDir !== null && heading !== null ? (qiblaDir - heading + 360) % 360 : 0;
    const isAligned = Math.abs(relativeQibla) < 5 || Math.abs(relativeQibla - 360) < 5;

    return (
        <main className="h-screen text-zinc-100 overflow-hidden font-sans flex flex-col bg-[#050505]">
            <div className="fixed inset-0 pointer-events-none">
                <div className={cn(
                    "absolute top-[-10%] left-[-10%] w-[60%] h-[60%] blur-[120px] rounded-full transition-colors duration-1000",
                    isAligned ? "bg-emerald-500/20" : "bg-emerald-500/5"
                )} />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/5 blur-[120px] rounded-full" />
            </div>

            <header className="relative z-10 px-6 pt-16 pb-6 text-center">
                <h1 className="text-4xl font-black tracking-tight mb-1">Qibla Finder</h1>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Face the Holy Kaaba</p>
            </header>

            <div className="flex-1 relative flex flex-col items-center justify-center px-6">
                <AnimatePresence mode="wait">
                    {status === "idle" && (
                        <motion.div key="idle" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="text-center space-y-8">
                            <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                                <Compass className="w-12 h-12 text-emerald-400" />
                            </div>
                            <div className="space-y-3">
                                <h2 className="text-xl font-bold">Find Direction</h2>
                                <p className="text-zinc-500 text-sm max-w-[240px] mx-auto leading-relaxed">
                                    We need your location and compass access to find the Qibla.
                                </p>
                            </div>
                            <button onClick={startFinder} className="px-10 h-16 rounded-full bg-emerald-500 text-black font-black uppercase tracking-widest text-xs active:scale-95 transition-transform shadow-lg shadow-emerald-500/20">
                                Start Calibration
                            </button>
                        </motion.div>
                    )}

                    {status === "requesting" && (
                        <motion.div key="requesting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center space-y-6">
                            <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto" />
                            <div className="space-y-2">
                                <h2 className="text-xl font-bold">Requesting Access</h2>
                                <p className="text-zinc-500 text-sm">Please allow location and compass access when prompted by your browser.</p>
                            </div>
                        </motion.div>
                    )}

                    {status === "calibrating" && (
                        <motion.div key="calibrating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center space-y-10">
                            <div className="relative w-48 h-24 mx-auto flex items-center justify-center">
                                <Smartphone className="w-12 h-12 text-emerald-400" />
                                <svg className="absolute inset-0 w-full h-full text-emerald-500/20" viewBox="0 0 100 50">
                                    <motion.path d="M 25 25 C 25 10 40 10 50 25 C 60 40 75 40 75 25 C 75 10 60 10 50 25 C 40 40 25 40 25 25" fill="none" stroke="#10b981" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, repeat: Infinity }} />
                                </svg>
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-lg font-bold">Calibration</h2>
                                <p className="text-zinc-500 text-sm">Move your phone in a figure-8 motion</p>
                            </div>
                        </motion.div>
                    )}

                    {(status === "active" || (status === "calibrating" && heading !== null)) && heading !== null && (
                        <motion.div key="compass" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="relative flex flex-col items-center">
                            <div className="relative w-80 h-80 rounded-full border border-white/5 flex items-center justify-center shadow-[inset_0_0_50px_rgba(255,255,255,0.02)]">
                                <motion.div animate={{ rotate: -heading }} className="absolute inset-0 w-full h-full flex items-center justify-center p-8 transition-transform duration-200">
                                    {Array.from({ length: 12 }).map((_, i) => (
                                        <div key={i} className="absolute inset-0 flex items-start justify-center" style={{ transform: `rotate(${i * 30}deg)` }}>
                                            <div className={cn("w-0.5 h-3 rounded-full mt-2", i % 3 === 0 ? "bg-white/20 h-4" : "bg-white/5")} />
                                        </div>
                                    ))}

                                    {qiblaDir !== null && (
                                        <div className="absolute inset-0 flex items-start justify-center" style={{ transform: `rotate(${qiblaDir}deg)` }}>
                                            <div className="flex flex-col items-center -translate-y-6">
                                                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                                                    <Navigation className="w-6 h-6 text-black fill-current" />
                                                </div>
                                                <span className="text-[10px] font-black text-emerald-400 mt-2 uppercase tracking-widest">Kaaba</span>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>

                                <div className="relative z-10 w-2 h-40 flex flex-col items-center justify-start">
                                    <div className={cn("w-2 h-20 rounded-t-full transition-colors duration-500", isAligned ? "bg-emerald-400" : "bg-white/10")} />
                                </div>

                                <div className="absolute inset-x-0 bottom-[-80px] text-center">
                                    <AnimatePresence>
                                        {isAligned ? (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-500/10 border border-emerald-500/20 px-6 py-2 rounded-full inline-flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-emerald-400 text-xs font-black uppercase tracking-widest">Correct Direction</span>
                                            </motion.div>
                                        ) : (
                                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Rotate your phone</motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            <div className="mt-40 grid grid-cols-2 gap-4 w-full max-w-xs">
                                <div className="glass p-4 rounded-3xl text-center">
                                    <p className="text-[10px] uppercase font-black tracking-widest text-zinc-500 mb-1">Heading</p>
                                    <p className="text-xl font-bold">{Math.round(heading)}°</p>
                                </div>
                                <div className="glass p-4 rounded-3xl text-center">
                                    <p className="text-[10px] uppercase font-black tracking-widest text-zinc-500 mb-1">Qibla</p>
                                    <p className="text-xl font-bold">{Math.round(qiblaDir || 0)}°</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {status === "error" && (
                        <motion.div key="error" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6">
                            <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
                                <AlertCircle className="w-10 h-10 text-red-400" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-lg font-bold">Something went wrong</h2>
                                <p className="text-red-400/60 text-sm max-w-[240px] mx-auto italic">{error}</p>
                            </div>
                            <button onClick={startFinder} className="px-8 h-12 rounded-full glass border-white/10 text-xs font-black uppercase tracking-widest flex items-center gap-2 mx-auto">
                                <RefreshCw className="w-4 h-4" /> Try Again
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <BottomNav />
        </main>
    );
}