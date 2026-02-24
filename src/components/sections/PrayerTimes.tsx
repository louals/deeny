"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
    CloudSun, Sun, Sunrise, Cloud, Moon,
    MapPin, Navigation, Bell
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Interfaces ---
interface Country {
    name: string;
    code: string;
    flag: string;
}

interface PrayerDay {
    date: {
        readable: string;
        gregorian: { day: string };
    };
    timings: Record<string, string>;
}

interface PrayerMapItem {
    key: string;
    label: string;
    icon: React.ElementType;
}

// Fixed 'any' by defining exactly what the external API returns
interface RestCountryAPIResponse {
    name: { common: string };
    cca2: string;
    flags: { svg: string; png: string };
}

const PRAYER_MAP: PrayerMapItem[] = [
    { key: "Fajr", label: "Fajr", icon: CloudSun },
    { key: "Sunrise", label: "Sunrise", icon: Sunrise },
    { key: "Dhuhr", label: "Dhuhr", icon: Sun },
    { key: "Asr", label: "Asr", icon: Cloud },
    { key: "Maghrib", label: "Maghrib", icon: CloudSun },
    { key: "Isha", label: "Isha", icon: Moon },
];

export function PrayerTimes() {
    const [mounted, setMounted] = useState(false);
    const [data, setData] = useState<PrayerDay | null>(null);
    const [countries, setCountries] = useState<Country[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<Country>({ name: "Canada", code: "CA", flag: "" });
    const [city, setCity] = useState("Montreal");
    
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [selectorStep, setSelectorStep] = useState<"country" | "city">("country");
    const [cities, setCities] = useState<string[]>([]);
    const [tempCountry, setTempCountry] = useState<Country>({ name: "Canada", code: "CA", flag: "" });

    const [showOnboarding, setShowOnboarding] = useState(false);
    const [onboardingStep, setOnboardingStep] = useState(1);

    const syncMonthlyData = useCallback(async (targetCity: string, targetCountryName: string) => {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        const cacheKey = `prayers_${targetCity}_${month}`;

        try {
            const res = await fetch(
                `https://api.aladhan.com/v1/calendarByCity/${year}/${month}?city=${targetCity}&country=${targetCountryName}&method=2`
            );
            const json = await res.json();

            if (json.code === 200) {
                if (typeof window !== "undefined") {
                    localStorage.setItem(cacheKey, JSON.stringify(json.data));
                }
                const todayStr = now.getDate().toString().padStart(2, '0');
                const todayData = json.data.find((day: PrayerDay) => day.date.gregorian.day === todayStr);
                setData(todayData);
            }
        } catch (err) {
            console.error("Sync failed", err);
        }
    }, []);

    useEffect(() => {
        // CLEAN FIX: Use a timeout of 0 to move the state update 
        // out of the synchronous execution thread.
        const timer = setTimeout(() => {
            setMounted(true);
        }, 0);

        fetch("https://restcountries.com/v3.1/all?fields=name,cca2,flags")
            .then(res => res.json())
            .then((raw: RestCountryAPIResponse[]) => {
                const formatted = raw.map((c) => ({
                    name: c.name.common,
                    code: c.cca2,
                    flag: c.flags.svg || c.flags.png
                })).sort((a: Country, b: Country) => a.name.localeCompare(b.name));
                
                setCountries(formatted);
            });
            
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const handleInitialLoad = () => {
            const permissionsHandled = localStorage.getItem("permissions_handled");
            if (!permissionsHandled) {
                setShowOnboarding(true);
            }

            const now = new Date();
            const cacheKey = `prayers_${city}_${now.getMonth() + 1}`;
            const cached = localStorage.getItem(cacheKey);

            if (cached) {
                try {
                    const monthData = JSON.parse(cached);
                    const todayStr = now.getDate().toString().padStart(2, '0');
                    const todayData = monthData.find((day: PrayerDay) => day.date.gregorian.day === todayStr);
                    setData(todayData);
                } catch (e) {
                    console.error("Cache error", e);
                }
            }
            syncMonthlyData(city, selectedCountry.name);
        };

        // CLEAN FIX: Call it in a timeout to avoid cascading renders
        const timer = setTimeout(handleInitialLoad, 0);
        return () => clearTimeout(timer);
    }, [city, selectedCountry.name, syncMonthlyData, mounted]);

    const handleLocationPermission = () => {
        if (typeof window !== "undefined" && "geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                () => setOnboardingStep(2),
                () => setOnboardingStep(2)
            );
        } else {
            setOnboardingStep(2);
        }
    };

    const handleNotificationPermission = async () => {
        if (typeof window !== "undefined" && "Notification" in window) {
            await Notification.requestPermission();
        }
        localStorage.setItem("permissions_handled", "true");
        setShowOnboarding(false);
    };

    const fetchCitiesForCountry = async (countryName: string) => {
        try {
            const res = await fetch("https://countriesnow.space/api/v0.1/countries/cities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ country: countryName }),
            });
            const json = await res.json();
            if (!json.error && json.data) setCities(json.data.sort());
        } catch (e) {
            console.error("City fetch error", e);
        }
    };

    const formatTime = (time: string | undefined) => time?.split(" ")[0] || "--:--";

    if (!mounted) return null;

    return (
        <section className="px-6 max-w-md mx-auto relative pt-8">
            <AnimatePresence>
                {showOnboarding && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6">
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="w-full max-w-sm glass border-white/10 rounded-[42px] p-8 flex flex-col items-center text-center relative overflow-hidden">
                            {onboardingStep === 1 ? (
                                <div className="flex flex-col items-center">
                                    <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 flex items-center justify-center mb-8">
                                        <Navigation className="text-emerald-500 w-10 h-10" />
                                    </div>
                                    <h2 className="text-2xl font-black text-white mb-4">Location</h2>
                                    <button onClick={handleLocationPermission} className="w-full h-16 rounded-2xl bg-emerald-500 text-black font-black uppercase text-xs">Enable Location</button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <div className="w-20 h-20 rounded-3xl bg-blue-500/20 flex items-center justify-center mb-8">
                                        <Bell className="text-blue-500 w-10 h-10" />
                                    </div>
                                    <h2 className="text-2xl font-black text-white mb-4">Alerts</h2>
                                    <button onClick={handleNotificationPermission} className="w-full h-16 rounded-2xl bg-white text-black font-black uppercase text-xs">Allow Notifications</button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col items-center mb-10 space-y-3">
                <button onClick={() => { setSelectorStep("country"); setIsSelectorOpen(true); }} className="flex items-center gap-2 px-4 py-2 glass rounded-full">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[11px] font-bold text-zinc-100 uppercase tracking-widest">{city}, {selectedCountry.code}</span>
                </button>
                <p className="text-sm text-zinc-400">{data?.date?.readable || "Loading..."}</p>
            </div>

            <div className="glass-card rounded-[32px] p-4 shadow-2xl">
                <div className="flex flex-col space-y-1">
                    {PRAYER_MAP.map((item) => {
                        const time = formatTime(data?.timings?.[item.key]);
                        return (
                            <div key={item.key} className="flex items-center justify-between py-3.5 px-4 rounded-2xl transition-all bg-transparent">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5">
                                        <item.icon className="w-5 h-5 text-zinc-300" />
                                    </div>
                                    <span className="font-semibold text-zinc-300">{item.label}</span>
                                </div>
                                <span className="text-lg font-bold text-zinc-400">{time}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {isSelectorOpen && (
                <div className="fixed inset-0 z-[60] flex items-end justify-center">
                    <div onClick={() => setIsSelectorOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-md" />
                    <div className="relative w-full max-w-md glass-dark border-t border-white/10 rounded-t-[40px] max-h-[85vh] p-8 overflow-y-auto">
                        {selectorStep === "country" ? (
                            <div className="space-y-2">
                                {countries.map(c => (
                                    <button key={c.code} onClick={() => { setTempCountry(c); setSelectorStep("city"); fetchCitiesForCountry(c.name); }} className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl text-zinc-300">
                                        <span className="text-lg">🏳️</span> {c.name}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {cities.map(c => (
                                    <button key={c} onClick={() => { setCity(c); setSelectedCountry(tempCountry); setIsSelectorOpen(false); }} className="w-full p-3 hover:bg-white/5 rounded-xl text-zinc-300 text-left">
                                        {c}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}