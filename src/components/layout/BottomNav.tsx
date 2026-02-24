import { BookOpen, Clock, Moon, Settings, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

const navItems = [
    { id: "times", label: "Times", icon: Clock, href: "/" },
    { id: "quran", label: "Quran", icon: BookOpen, href: "/quran" },
    { id: "adhkar", label: "Adhkar", icon: Heart, href: "/adhkar" },
    { id: "qibla", label: "Qibla", icon: Moon, href: "/qibla" },
    { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
];

export function BottomNav() {
    const { pathname } = useLocation();

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 gpu">
            <nav className="glass-dark border-t border-white/10 flex items-center justify-around h-[84px] px-2 w-full safe-bottom shadow-[0_-8px_32px_rgba(0,0,0,0.4)]">
                {navItems.map((item) => {
                    const isActive = item.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.href);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.id}
                            to={item.href}
                            className="flex flex-1 flex-col items-center justify-center h-full active:scale-90 relative"
                            style={{ transition: "transform 0.15s cubic-bezier(0.4,0,0.2,1)" }}
                        >
                            {/* Icon — only translate on active (GPU-only, no layout) */}
                            <div
                                className={cn(
                                    "mb-1 flex items-center justify-center",
                                    isActive ? "text-emerald-400" : "text-zinc-500"
                                )}
                                style={{
                                    transform: isActive ? "translateY(-4px)" : "translateY(0)",
                                    transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1), color 0.2s ease",
                                }}
                            >
                                <Icon size={26} strokeWidth={isActive ? 2.5 : 2} />
                            </div>

                            {/* Label — CSS opacity/transform only, no JS */}
                            <span
                                className={cn(
                                    "text-[10px] font-bold uppercase tracking-widest text-emerald-400 absolute bottom-4",
                                )}
                                style={{
                                    opacity: isActive ? 1 : 0,
                                    transform: isActive ? "translateY(0) scale(1)" : "translateY(4px) scale(0.85)",
                                    transition: "opacity 0.2s ease, transform 0.2s cubic-bezier(0.4,0,0.2,1)",
                                    pointerEvents: "none",
                                }}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
