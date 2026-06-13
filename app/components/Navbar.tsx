"use client";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const playClickSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.05);
      
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      console.log("Audio not supported");
    }
  };

  const toggleTheme = () => {
    playClickSound();
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) return null;

  return (
    <nav className="w-full max-w-4xl mx-auto flex items-center justify-between py-6 px-6 sm:px-8">
      {/* LEFT: Terminal Signature */}
      <div className="font-mono text-lg font-bold tracking-tight text-black dark:text-white">
        <span className="text-gray-400 dark:text-gray-500">~/</span>shaun
      </div>

      {/* RIGHT: Links & Toggle */}
      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center gap-6 text-sm font-mono text-gray-600 dark:text-gray-400">
          <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Home</a>
          <a href="#" className="hover:text-black dark:hover:text-white transition-colors">About</a>
          <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Showcase</a>
        </div>
        
        <button
          onClick={toggleTheme}
          className="p-2.5 bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-[#222] text-black dark:text-white transition-all active:scale-95"
          aria-label="Toggle Dark Mode"
        >
          {theme === "dark" ? <Sun size={18} className="text-gray-300" /> : <Moon size={18} className="text-gray-700" />}
        </button>
      </div>
    </nav>
  );
}