"use client";
import { useState } from "react";

const COLORS = [
  { name: "White", class: "bg-[#ededed] border-gray-300 dark:border-transparent" },
  { name: "Yellow", class: "bg-[#e2b93d] border-transparent" },
  { name: "Red", class: "bg-[#e05252] border-transparent" },
  { name: "Orange", class: "bg-[#e67e22] border-transparent" },
  { name: "Green", class: "bg-[#2ea043] border-transparent" },
  { name: "Blue", class: "bg-[#58a6ff] border-transparent" },
];

export default function CubeGrid() {
  const [activeColor, setActiveColor] = useState(COLORS[0].class);
  // Default empty state now adapts to light/dark mode
  const [cubeState, setCubeState] = useState(Array(54).fill("bg-gray-200 dark:bg-[#1a1a1a]"));
  const [solution, setSolution] = useState<string[]>([]);
  const [isSolving, setIsSolving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSquareClick = (index: number) => {
    const newState = [...cubeState];
    newState[index] = activeColor;
    setCubeState(newState);
  };

  const handleSolve = async () => {
    setIsSolving(true);
    setSolution([]); 
    setError(null); 
    setTimeout(() => { 
      setSolution(["U", "R2", "F'", "D", "L2", "U'", "B"]);
      setIsSolving(false);
    }, 800);
  };

  const Face = ({ faceIndex, label }: { faceIndex: number; label: string }) => {
    const startIndex = faceIndex * 9;
    return (
      <div className="flex flex-col items-center gap-1.5">
        <span className="text-[10px] text-gray-500 tracking-widest">{label}</span>
        <div className="grid grid-cols-3 gap-0.5 p-0.5 bg-gray-300 dark:bg-[#222] border border-gray-300 dark:border-gray-800 rounded-md">
          {Array.from({ length: 9 }).map((_, i) => {
            const squareIndex = startIndex + i;
            return (
              <button
                key={squareIndex}
                onClick={() => handleSquareClick(squareIndex)}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-[2px] ${cubeState[squareIndex]} hover:opacity-80 transition-opacity border border-transparent`}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-10">
      
      <div className="flex flex-col gap-3">
        <h3 className="text-xs text-gray-500 tracking-widest uppercase">1. Select Color</h3>
        <div className="flex gap-3">
          {COLORS.map((c) => (
            <button
              key={c.name}
              onClick={() => setActiveColor(c.class)}
              className={`w-8 h-8 rounded-md border ${c.class} ${
                activeColor === c.class ? "ring-2 ring-black/20 dark:ring-white/20 border-gray-400 dark:border-white" : ""
              } transition-all`}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-xs text-gray-500 tracking-widest uppercase">2. Map State</h3>
        <div className="grid grid-cols-4 gap-2 sm:gap-4 p-6 sm:p-8 bg-gray-50 dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-x-auto">
          <div className="col-start-2"><Face faceIndex={0} label="U" /></div>
          <div className="col-start-1"><Face faceIndex={4} label="L" /></div>
          <div><Face faceIndex={2} label="F" /></div>
          <div><Face faceIndex={1} label="R" /></div>
          <div><Face faceIndex={5} label="B" /></div>
          <div className="col-start-2"><Face faceIndex={3} label="D" /></div>
        </div>
      </div>

      <div className="flex flex-col gap-4 border-t border-gray-200 dark:border-gray-800/50 pt-8">
        <button 
          onClick={handleSolve}
          disabled={isSolving}
          className="w-full sm:w-auto px-8 py-3 bg-black text-white dark:bg-[#ededed] dark:text-black text-sm font-bold rounded-lg hover:opacity-80 disabled:opacity-50 transition-colors"
        >
          {isSolving ? "Processing..." : "Execute >"}
        </button>

        {error && <div className="text-red-500 dark:text-red-400 text-sm border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 p-3 rounded-lg">{error}</div>}

        {solution.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-sm text-gray-500 self-center mr-2">Solution:</span>
            {solution.map((move, i) => (
              <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 text-black dark:text-gray-200 rounded text-sm">
                {move}
              </span>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}