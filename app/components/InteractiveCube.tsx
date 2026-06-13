"use client";
import { useState, useEffect } from "react";
import { Canvas, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Edges } from "@react-three/drei";
import * as THREE from "three";
import { Loader2, RotateCcw, Play, Pause, SkipForward, SkipBack } from "lucide-react";

const COLORS = [
  { name: "White", hex: "#ededed" }, { name: "Yellow", hex: "#e2b93d" },
  { name: "Red", hex: "#e05252" }, { name: "Orange", hex: "#e67e22" },
  { name: "Green", hex: "#2ea043" }, { name: "Blue", hex: "#58a6ff" },
];

const NORMAL_TO_FACE: Record<string, string> = {
  "1,0,0": "Right", "-1,0,0": "Left",
  "0,1,0": "Up", "0,-1,0": "Down",
  "0,0,1": "Front", "0,0,-1": "Back",
};

const generateSolvedState = () => {
  const state: Record<string, string> = {};
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        if (y === 1) state[`${x}_${y}_${z}_Up`] = "#ededed";
        if (y === -1) state[`${x}_${y}_${z}_Down`] = "#e2b93d";
        if (z === 1) state[`${x}_${y}_${z}_Front`] = "#2ea043";
        if (z === -1) state[`${x}_${y}_${z}_Back`] = "#58a6ff";
        if (x === 1) state[`${x}_${y}_${z}_Right`] = "#e05252";
        if (x === -1) state[`${x}_${y}_${z}_Left`] = "#e67e22";
      }
    }
  }
  return state;
};

export default function InteractiveCube() {
  const [activeColor, setActiveColor] = useState(COLORS[0].hex);
  
  // Base state (User's painted cube) and Current state (Animated during playback)
  const [baseFaceColors, setBaseFaceColors] = useState<Record<string, string>>(generateSolvedState());
  const [currentFaceColors, setCurrentFaceColors] = useState<Record<string, string>>(generateSolvedState());
  
  // Logic & Playback States
  const [isSolving, setIsSolving] = useState(false);
  const [solution, setSolution] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedLevel, setSpeedLevel] = useState(3); // 1 (Slow) to 5 (Fast)
  const [loadingMessage, setLoadingMessage] = useState("Processing...");

  // Sync the base colors to current colors when the user is painting
  useEffect(() => {
    if (solution.length === 0) setCurrentFaceColors(baseFaceColors);
  }, [baseFaceColors, solution]);

  // --- THE PHYSICS ENGINE: 3D Matrix Permutations ---
  const applyMove = (move: string, state: Record<string, string>) => {
    const newState: Record<string, string> = {};
    const baseMove = move[0]; 
    const isPrime = move.includes("'");
    const isDouble = move.includes("2");

    let axis = new THREE.Vector3();
    let layer = 0;
    let axisName = "";
    let angle = (Math.PI / 2) * (isPrime ? 1 : -1);

    if (baseMove === 'R') { axis.set(1, 0, 0); layer = 1; axisName = 'x'; angle = isPrime ? Math.PI/2 : -Math.PI/2; }
    if (baseMove === 'L') { axis.set(1, 0, 0); layer = -1; axisName = 'x'; angle = isPrime ? -Math.PI/2 : Math.PI/2; }
    if (baseMove === 'U') { axis.set(0, 1, 0); layer = 1; axisName = 'y'; angle = isPrime ? Math.PI/2 : -Math.PI/2; }
    if (baseMove === 'D') { axis.set(0, 1, 0); layer = -1; axisName = 'y'; angle = isPrime ? -Math.PI/2 : Math.PI/2; }
    if (baseMove === 'F') { axis.set(0, 0, 1); layer = 1; axisName = 'z'; angle = isPrime ? Math.PI/2 : -Math.PI/2; }
    if (baseMove === 'B') { axis.set(0, 0, 1); layer = -1; axisName = 'z'; angle = isPrime ? -Math.PI/2 : Math.PI/2; }

    if (isDouble) angle *= 2;

    Object.entries(state).forEach(([key, color]) => {
      const [xStr, yStr, zStr, faceName] = key.split("_");
      let x = parseInt(xStr), y = parseInt(yStr), z = parseInt(zStr);

      if ((axisName === 'x' && x === layer) || (axisName === 'y' && y === layer) || (axisName === 'z' && z === layer)) {
        const pos = new THREE.Vector3(x, y, z);
        pos.applyAxisAngle(axis, angle);

        const normalMap: Record<string, number[]> = {
            "Right": [1,0,0], "Left": [-1,0,0], "Up": [0,1,0], 
            "Down": [0,-1,0], "Front": [0,0,1], "Back": [0,0,-1]
        };
        const norm = new THREE.Vector3(...normalMap[faceName]);
        norm.applyAxisAngle(axis, angle);

        const nx = Math.round(pos.x), ny = Math.round(pos.y), nz = Math.round(pos.z);
        const nnx = Math.round(norm.x), nny = Math.round(norm.y), nnz = Math.round(norm.z);

        const newFaceNormal = `${nnx},${nny},${nnz}`;
        const newFaceName = NORMAL_TO_FACE[newFaceNormal];

        newState[`${nx}_${ny}_${nz}_${newFaceName}`] = color;
      } else {
        newState[key] = color;
      }
    });

    return newState;
  };

  // --- PLAYBACK CONTROLS ---
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    // Map the 1-5 slider to actual milliseconds
    const speedMap: Record<number, number> = { 1: 2000, 2: 1500, 3: 1200, 4: 800, 5: 400 };
    const currentDelay = speedMap[speedLevel] || 1200;

    if (isPlaying && stepIndex < solution.length) {
      timer = setTimeout(() => {
        handleStepForward();
      }, currentDelay);
    } else if (stepIndex >= solution.length) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, stepIndex, solution, speedLevel]);

  const handleStepForward = () => {
    if (stepIndex >= solution.length) return;
    const move = solution[stepIndex];
    setCurrentFaceColors(prev => applyMove(move, prev));
    setStepIndex(prev => prev + 1);
  };

  const handleStepBack = () => {
    if (stepIndex <= 0) return;
    const prevMove = solution[stepIndex - 1];
    let inverseMove = prevMove;
    if (prevMove.includes("'")) inverseMove = prevMove[0];
    else if (!prevMove.includes("2")) inverseMove = prevMove + "'";
    
    setCurrentFaceColors(prev => applyMove(inverseMove, prev));
    setStepIndex(prev => prev - 1);
  };

  const resetPlayback = () => {
    setIsPlaying(false);
    setStepIndex(0);
    setCurrentFaceColors(baseFaceColors);
  };

  const handleFaceClick = (e: ThreeEvent<MouseEvent>, x: number, y: number, z: number) => {
    e.stopPropagation(); 
    if (!e.face || solution.length > 0) return;

    const normalKey = `${e.face.normal.x},${e.face.normal.y},${e.face.normal.z}`;
    const faceName = NORMAL_TO_FACE[normalKey];

    if (faceName) {
      const stateKey = `${x}_${y}_${z}_${faceName}`;
      setBaseFaceColors((prev) => ({ ...prev, [stateKey]: activeColor }));
    }
  };

  const handleSolve = async () => {
    setIsSolving(true);
    setSolution([]);
    setError(null);
    setStepIndex(0);
    setLoadingMessage("Calculating optimal path...");

    // Start a timer to warn the user if Render is waking up
    const coldStartWarning = setTimeout(() => {
      setLoadingMessage("Waking up cloud engine... (This takes ~50s on free tier)");
    }, 4000);

    try {
      const centerColors = {
        Up: baseFaceColors["0_1_0_Up"], Right: baseFaceColors["1_0_0_Right"],
        Front: baseFaceColors["0_0_1_Front"], Down: baseFaceColors["0_-1_0_Down"],
        Left: baseFaceColors["-1_0_0_Left"], Back: baseFaceColors["0_0_-1_Back"],
      };

      if (Object.values(centerColors).some(c => !c)) throw new Error("Missing center piece colors.");

      const hexToRelativeFace: Record<string, string> = {
        [centerColors.Up]: "U", [centerColors.Right]: "R", [centerColors.Front]: "F",
        [centerColors.Down]: "D", [centerColors.Left]: "L", [centerColors.Back]: "B",
      };

      if (Object.keys(hexToRelativeFace).length !== 6) throw new Error("Invalid State: All 6 center pieces must be different colors!");

      const getChar = (x: number, y: number, z: number, face: string) => {
        const hex = baseFaceColors[`${x}_${y}_${z}_${face}`];
        if (!hex) throw new Error("Cube is missing colors. Please paint all 54 faces.");
        const char = hexToRelativeFace[hex];
        if (!char) throw new Error("Color mismatch! Edge colors must match center colors.");
        return char;
      };

      let stateString = "";
      for(let z=-1; z<=1; z++) for(let x=-1; x<=1; x++) stateString += getChar(x, 1, z, "Up");
      for(let y=1; y>=-1; y--) for(let z=1; z>=-1; z--) stateString += getChar(1, y, z, "Right");
      for(let y=1; y>=-1; y--) for(let x=-1; x<=1; x++) stateString += getChar(x, y, 1, "Front");
      for(let z=1; z>=-1; z--) for(let x=-1; x<=1; x++) stateString += getChar(x, -1, z, "Down");
      for(let y=1; y>=-1; y--) for(let z=-1; z<=1; z++) stateString += getChar(-1, y, z, "Left");
      for(let y=1; y>=-1; y--) for(let x=1; x>=-1; x--) stateString += getChar(x, y, -1, "Back");

      const response = await fetch("https://cube-api-su0x.onrender.com/api/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state: stateString })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to calculate solution.");
      }

      clearTimeout(coldStartWarning);
      const data = await response.json();
      setSolution(data.solution);

    } catch (err: any) {
      clearTimeout(coldStartWarning);
      setError(err.message);
    } finally {
      setIsSolving(false);
    }
  };

  const cubies = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        cubies.push(
          <mesh 
            key={`${x}-${y}-${z}`} 
            position={[x * 1.05, y * 1.05, z * 1.05]} 
            onClick={(e) => handleFaceClick(e, x, y, z)}
            onPointerOver={() => document.body.style.cursor = solution.length > 0 ? 'default' : 'pointer'}
            onPointerOut={() => document.body.style.cursor = 'default'}
          >
            <boxGeometry args={[1, 1, 1]} />
            
            {["Right", "Left", "Up", "Down", "Front", "Back"].map((faceName, index) => {
              const stateKey = `${x}_${y}_${z}_${faceName}`;
              const isInternal = 
                (faceName === "Right" && x !== 1) || (faceName === "Left" && x !== -1) ||
                (faceName === "Up" && y !== 1) || (faceName === "Down" && y !== -1) ||
                (faceName === "Front" && z !== 1) || (faceName === "Back" && z !== -1);

              const color = isInternal ? "#000000" : (currentFaceColors[stateKey] || "#4a4a4a");

              return (
                <meshStandardMaterial 
                  key={index} attach={`material-${index}`} 
                  color={color} roughness={0.4} metalness={0.1}
                />
              );
            })}
            <Edges scale={1} threshold={15} color="#1a1a1a" />
          </mesh>
        );
      }
    }
  }

  return (
    <div className="flex flex-col gap-10 w-full">
      
      {/* 1. TOOLBAR */}
      {solution.length === 0 && (
        <div className="flex flex-col gap-3 animate-in fade-in">
          <h3 className="text-xs text-gray-500 tracking-widest uppercase">1. Select Paint Color</h3>
          <div className="flex gap-3">
            {COLORS.map((c) => (
              <button
                key={c.name} onClick={() => setActiveColor(c.hex)}
                style={{ backgroundColor: c.hex }}
                className={`w-10 h-10 rounded-lg border-2 transition-all ${
                  activeColor === c.hex ? "border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]" : "border-transparent"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* 2. 3D CANVAS */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h3 className="text-xs text-gray-500 tracking-widest uppercase">
            {solution.length > 0 ? "Solution Playback" : "2. Paint the Cube (Drag to Rotate)"}
          </h3>
          <button 
            onClick={() => { setBaseFaceColors(generateSolvedState()); setSolution([]); setError(null); }}
            className="text-xs flex items-center gap-1 text-gray-500 hover:text-white transition-colors"
          >
            <RotateCcw size={12} /> {solution.length > 0 ? "Clear Solution" : "Reset Cube"}
          </button>
        </div>
        <div className="w-full h-[400px] sm:h-[500px] bg-[#0a0a0a] border border-gray-800 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing shadow-inner">
          <Canvas camera={{ position: [4, 4, 5], fov: 45 }}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} />
            <directionalLight position={[-10, -10, -5]} intensity={0.5} />
            <group>{cubies}</group>
            <OrbitControls enablePan={false} enableZoom={true} minDistance={3} maxDistance={10} />
          </Canvas>
        </div>
      </div>

      {/* 3. MEDIA CONTROLS & EXECUTION */}
      <div className="flex flex-col gap-4 border-t border-gray-200 dark:border-gray-800/50 pt-8">
        
        {solution.length === 0 ? (
          <button 
            onClick={handleSolve} disabled={isSolving}
            className="w-full sm:w-auto px-8 py-3 bg-black text-white dark:bg-[#ededed] dark:text-black text-sm font-bold rounded-lg hover:opacity-80 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {isSolving ? <><Loader2 size={16} className="animate-spin" /> {loadingMessage}</> : "Execute >"}
          </button>
        ) : (
          <div className="flex flex-col gap-4 animate-in fade-in">
            {/* Playback Progress */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-500 self-center mr-2 font-mono">
                MOVE {stepIndex}/{solution.length}:
              </span>
              {solution.map((move, i) => (
                <span 
                  key={i} 
                  className={`px-3 py-1 font-bold rounded text-sm transition-all duration-300 ${
                    i === stepIndex - 1 
                      ? "bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)] scale-110" 
                      : i < stepIndex
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 text-gray-400"
                  }`}
                >
                  {move}
                </span>
              ))}
            </div>

            {/* Media Buttons & Slider */}
            <div className="flex flex-wrap gap-3 items-center">
              <button onClick={handleStepBack} disabled={stepIndex === 0} className="p-3 bg-[#111] hover:bg-[#222] border border-gray-800 rounded-lg disabled:opacity-30 transition-colors text-white">
                <SkipBack size={18} />
              </button>
              <button onClick={() => setIsPlaying(!isPlaying)} disabled={stepIndex === solution.length} className="px-6 py-3 bg-[#ededed] hover:bg-white text-black font-bold rounded-lg disabled:opacity-50 transition-colors flex items-center gap-2">
                {isPlaying ? <><Pause size={18} /> Pause</> : <><Play size={18} /> Auto-Play</>}
              </button>
              <button onClick={handleStepForward} disabled={stepIndex === solution.length} className="p-3 bg-[#111] hover:bg-[#222] border border-gray-800 rounded-lg disabled:opacity-30 transition-colors text-white">
                <SkipForward size={18} />
              </button>
              <button onClick={resetPlayback} className="p-3 bg-[#111] hover:bg-[#222] border border-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white">
                <RotateCcw size={18} />
              </button>

              {/* Speed Slider */}
              <div className="flex items-center gap-3 px-4 py-3 bg-[#111] border border-gray-800 rounded-lg ml-auto">
                <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Speed</span>
                <input 
                  type="range" min="1" max="5" step="1" 
                  value={speedLevel} 
                  onChange={(e) => setSpeedLevel(Number(e.target.value))}
                  className="w-20 sm:w-24 accent-white cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="text-red-500 dark:text-red-400 text-sm border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 p-3 rounded-lg">
            {error}
          </div>
        )}
      </div>

    </div>
  );
}