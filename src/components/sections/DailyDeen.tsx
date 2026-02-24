"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Clock, Church, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function DailyDeen() {
    return (
        <section className="px-6 space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-outfit font-bold text-zinc-100 tracking-tight">Daily Deen</h2>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="rounded-full glass border-white/10 text-emerald-400 hover:bg-white/5 ios-transition">
                        <Star className="h-4 w-4 mr-2 fill-emerald-400" />
                        Dua of the Day
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="quran" className="w-full">
                <TabsList className="w-full grid grid-cols-3 glass border-white/10 p-1.5 rounded-2xl h-14 backdrop-blur-2xl">
                    <TabsTrigger value="quran" className="rounded-xl data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-xl font-bold gap-2 transition-all ios-transition text-zinc-400">
                        <BookOpen className="h-4 w-4" />
                        Quran
                    </TabsTrigger>
                    <TabsTrigger value="adhkar" className="rounded-xl data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-xl font-bold gap-2 transition-all ios-transition text-zinc-400">
                        <Clock className="h-4 w-4" />
                        Adhkar
                    </TabsTrigger>
                    <TabsTrigger value="mosque" className="rounded-xl data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-xl font-bold gap-2 transition-all ios-transition text-zinc-400">
                        <Church className="h-4 w-4" />
                        Mosques
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="quran" className="mt-8 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card className="glass-card shadow-2xl overflow-hidden relative group rounded-[32px] border-none p-1">
                            <div className="absolute top-0 right-0 p-8 transform group-hover:scale-110 transition-transform duration-700 opacity-5 pointer-events-none">
                                <BookOpen size={140} className="text-white" />
                            </div>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xl text-emerald-400 font-bold">Last Read</CardTitle>
                                <CardDescription className="text-zinc-400 font-medium">Surah Al-Kahf • Ayah 10</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8 p-6 pt-2">
                                <p className="text-3xl text-right font-serif leading-relaxed italic text-white/95 leading-[1.8]" dir="rtl">
                                    إِنَّ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ كَانَتْ لَهُمْ جَنَّاتُ الْفِرْدَوْسِ نُزُلًا
                                </p>
                                <Button className="w-full bg-white/10 hover:bg-white/20 text-white font-bold rounded-[20px] h-14 transition-all ios-transition shadow-lg border border-white/10">
                                    Continue Reading
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </TabsContent>

                <TabsContent value="adhkar" className="mt-8">
                    <div className="grid grid-cols-1 gap-4">
                        {[
                            { title: "Morning Adhkar", completed: "24/32" },
                            { title: "Evening Adhkar", completed: "0/32" }
                        ].map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card className="glass-card hover:bg-white/10 transition-all cursor-pointer rounded-2xl border-none p-2 group shadow-lg">
                                    <div className="flex items-center justify-between p-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-lg font-bold text-zinc-100">{item.title}</span>
                                            <span className="text-sm font-medium text-emerald-400/80">{item.completed} Completed</span>
                                        </div>
                                        <Button variant="ghost" size="icon" className="rounded-xl glass border-white/5 text-white h-12 w-12 group-hover:bg-emerald-500 group-hover:text-white transition-all ios-transition">
                                            <Clock className="h-6 w-6" />
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="mosque" className="mt-8">
                    <div className="flex flex-col items-center justify-center p-16 glass border-white/10 rounded-[32px] shadow-inner">
                        <Church className="h-14 w-14 text-zinc-700 mb-4" />
                        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Coming soon</p>
                    </div>
                </TabsContent>
            </Tabs>
        </section>
    );
}
