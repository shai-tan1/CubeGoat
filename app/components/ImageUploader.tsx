"use client";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X, Loader2 } from "lucide-react";

export default function ImageUploader() {
  const [images, setImages] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<string[][]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Reset previous errors and data when new images are dropped
    setError(null);
    setExtractedData([]);
    setImages((prev) => [...prev, ...acceptedFiles].slice(0, 6));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { "image/*": [".jpeg", ".png", ".jpg"] }
  });

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setExtractedData([]); // Clear data if queue changes
  };

  const handleAnalyze = async () => {
    setIsProcessing(true);
    setError(null);
    setExtractedData([]);

    try {
      const allResults: string[][] = [];

      // Loop through each uploaded image and send it to OpenCV
      for (const file of images) {
        const formData = new FormData();
        formData.append("file", file);

        // NOTE: Change this URL to your Render backend URL once deployed!
        const response = await fetch("https://YOUR-RENDER-URL.onrender.com/api/vision/extract", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to process image ${allResults.length + 1}. Please ensure it is a clear photo.`);
        }

        const data = await response.json();
        allResults.push(data.colors);
      }

      setExtractedData(allResults);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      
      {/* 1. UPLOAD ZONE */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs text-gray-500 tracking-widest uppercase">1. Upload Cube Faces</h3>
        <div 
          {...getRootProps()} 
          className={`relative flex flex-col items-center justify-center w-full h-48 border border-dashed rounded-xl cursor-pointer transition-all ${
            isDragActive 
              ? "border-black bg-gray-100 dark:border-white dark:bg-[#111]" 
              : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-[#0d0d0d] hover:border-gray-400 dark:hover:border-gray-500"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3 pointer-events-none text-gray-500">
            <UploadCloud size={24} />
            <div className="text-center">
              <p className="text-sm font-medium text-black dark:text-gray-300">
                {isDragActive ? "Drop images here" : "Drag & drop cube images"}
              </p>
              <p className="text-xs mt-1 text-gray-500 dark:text-gray-600 font-mono">(Max 6 images: U-L-F-R-B-D)</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PREVIEW GRID */}
      {images.length > 0 && (
        <div className="flex flex-col gap-3 animate-in fade-in">
          <h3 className="text-xs text-gray-500 tracking-widest uppercase">2. Verify Queue</h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 p-4 bg-gray-50 dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-800 rounded-xl overflow-x-auto">
            {images.map((file, index) => (
              <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111] flex items-center justify-center">
                <img 
                  src={URL.createObjectURL(file)} 
                  alt={`Face ${index + 1}`} 
                  className="object-cover w-full h-full opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                />
                <button 
                  onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                  className="absolute top-1 right-1 p-1 bg-white/80 dark:bg-[#0a0a0a]/80 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-white border border-gray-300 dark:border-gray-700 hover:border-red-400 dark:hover:border-gray-400 rounded text-xs opacity-0 group-hover:opacity-100 transition-all"
                >
                  <X size={12} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-sm p-1 border-t border-gray-200 dark:border-gray-800 text-center">
                  <span className="text-[9px] text-gray-600 dark:text-gray-400 font-mono">FACE {index + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. ACTION AREA */}
      <div className="flex flex-col gap-4 border-t border-gray-200 dark:border-gray-800/50 pt-8">
        <button 
          onClick={handleAnalyze}
          disabled={images.length === 0 || isProcessing}
          className="w-full sm:w-auto px-8 py-3 bg-black text-white dark:bg-[#ededed] dark:text-black text-sm font-bold rounded-lg hover:opacity-80 disabled:opacity-30 transition-all flex items-center justify-center gap-2"
        >
          {isProcessing ? (
             <><Loader2 size={16} className="animate-spin" /> Extracting Pixels...</>
          ) : (
             `Analyze with OpenCV >`
          )}
        </button>

        {error && (
          <div className="text-red-500 dark:text-red-400 text-sm border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* 4. RESULTS DISPLAY */}
        {extractedData.length > 0 && (
          <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/50 rounded-xl mt-2 animate-in fade-in flex flex-col gap-2">
             <span className="text-sm font-bold text-green-700 dark:text-green-400">✅ Extraction Complete</span>
             <p className="text-xs font-mono text-green-600 dark:text-green-300">
               {extractedData.map((faceColors, i) => (
                 <span key={i} className="block mt-1">
                   Face {i + 1}: [{faceColors.join(", ")}]
                 </span>
               ))}
             </p>
          </div>
        )}

        {images.length === 0 && (
          <p className="text-xs text-gray-500 dark:text-gray-600 font-mono">Awaiting image inputs...</p>
        )}
      </div>

    </div>
  );
}