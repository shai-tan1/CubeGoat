"use client";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState, useRef } from "react";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setMounted(true);
    // Preload the audio strictly on the client side
    audioRef.current = new Audio("/sounds/click.mp3");
  }, []);

  const playClickSound = () => {
    if (audioRef.current) {
      // Reset the time to 0 so the sound plays immediately even if clicked rapidly
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((e) => console.log("Audio play failed:", e));
    }
  };

  const toggleTheme = () => {
    playClickSound();
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) return null;

  return (
    <nav className="w-full max-w-4xl mx-auto flex items-center justify-between py-6 px-6 sm:px-8">
      {/* LEFT: Terminal Signature (Now a clickable link with pointer cursor) */}
      <a 
        href="https://github.com/shai-tan1" 
        target="_blank" 
        rel="noopener noreferrer"
        className="font-mono text-lg font-bold tracking-tight text-black dark:text-white cursor-pointer hover:opacity-80 transition-opacity"
      >
        <span className="text-gray-400 dark:text-gray-500">~/</span>shaun
      </a>

      {/* RIGHT: Links & Toggle */}
      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center gap-6 text-sm font-mono text-gray-600 dark:text-gray-400">
          <a href="#" className="hover:text-black dark:hover:text-white transition-colors cursor-pointer">Home</a>
          <a href="#" className="hover:text-black dark:hover:text-white transition-colors cursor-pointer">About</a>
          <a href="#" className="hover:text-black dark:hover:text-white transition-colors cursor-pointer">Showcase</a>
        </div>
        
        {/* Toggle Button (Now with explicit cursor-pointer) */}
        <button
          onClick={toggleTheme}
          className="p-2.5 bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-[#222] text-black dark:text-white transition-all active:scale-95 cursor-pointer"
          aria-label="Toggle Dark Mode"
        >
          {theme === "dark" ? <Sun size={18} className="text-gray-300" /> : <Moon size={18} className="text-gray-700" />}
        </button>
      </div>
    </nav>
  );
}