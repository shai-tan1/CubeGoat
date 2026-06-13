"use client";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CubeGrid from "./components/CubeGrid";
import InteractiveCube from './components/InteractiveCube';
import ImageUploader from "./components/ImageUploader";
import { Code, Clock, BrainCircuit, Fingerprint } from "lucide-react";

export default function Home() {
  // 1. Added "3d" to the available modes and set it as the default!
  const [mode, setMode] = useState<"manual" | "3d" | "upload">("3d");

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
      
      {/* NAVBAR AT THE TOP */}
      <Navbar />

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow flex flex-col items-center py-10 px-4 sm:px-6">
        <div className="w-full max-w-2xl flex flex-col gap-10">
          
          <header className="flex flex-col gap-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gray-100 dark:bg-white rounded-[20px] flex items-center justify-center text-4xl shadow-lg shrink-0">
                🧊
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-4">
                  <h1 className="text-[32px] font-bold tracking-tight text-black dark:text-white leading-none">Cube Goat</h1>
                  <span className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-full text-xs font-mono text-gray-500 dark:text-gray-400">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span> Online
                  </span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-mono text-sm mt-1">Computer Vision & Logic Engine</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm font-mono text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-3"><Code size={16} className="text-gray-400 dark:text-gray-600" /> FastAPI + OpenCV</div>
              <div className="flex items-center gap-3"><Clock size={16} className="text-gray-400 dark:text-gray-600" /> {"< 20 moves guaranteed"}</div>
              <div className="flex items-center gap-3"><BrainCircuit size={16} className="text-gray-400 dark:text-gray-600" /> Kociemba Algorithm</div>
              <div className="flex items-center gap-3"><Fingerprint size={16} className="text-gray-400 dark:text-gray-600" /> he/him</div>
            </div>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
              I calculate optimal solutions for standard 3x3 cubes using a{" "}
              <span className="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-xs border border-blue-200 dark:border-blue-500/20 rounded">Two-Phase Algorithm</span>. 
              Input your cube's state via manual entry, or use{" "}
              <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 font-mono text-xs border border-gray-300 dark:border-gray-700 rounded">Next.js</span> and{" "}
              <span className="px-1.5 py-0.5 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono text-xs border border-purple-200 dark:border-purple-500/20 rounded">Computer Vision</span>{" "}
              to extract colors automatically.
            </p>

            {/* 2. Added flex-wrap and the new 3D Paint button */}
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => setMode("3d")}
                className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 font-medium ${
                  mode === "3d" 
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-md" 
                    : "bg-gray-100 text-gray-600 dark:bg-[#111] dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-gray-200 dark:hover:bg-[#1a1a1a]"
                }`}
              >
                🧊 3D Paint
              </button>
              <button 
                onClick={() => setMode("manual")}
                className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 font-medium ${
                  mode === "manual" 
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-md" 
                    : "bg-gray-100 text-gray-600 dark:bg-[#111] dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-gray-200 dark:hover:bg-[#1a1a1a]"
                }`}
              >
                ⌨ 2D Grid
              </button>
              <button 
                onClick={() => setMode("upload")}
                className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 font-medium ${
                  mode === "upload" 
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-md" 
                    : "bg-gray-100 text-gray-600 dark:bg-[#111] dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-gray-200 dark:hover:bg-[#1a1a1a]"
                }`}
              >
                📷 Image Upload
              </button>
            </div>
          </header>

          <div className="w-full h-px bg-gray-200 dark:bg-gray-800/60 my-4"></div>

          {/* 3. Updated the render logic to handle all three components */}
          <section className="animate-in fade-in duration-500">
            {mode === "3d" && <InteractiveCube />}
            {mode === "manual" && <CubeGrid />}
            {mode === "upload" && <ImageUploader />}
          </section>

        </div>
      </main>

      {/* FOOTER AT THE BOTTOM */}
      <Footer />

    </div>
  );
}