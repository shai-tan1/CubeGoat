"use client";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X } from "lucide-react";

export default function ImageUploader() {
  const [images, setImages] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImages((prev) => [...prev, ...acceptedFiles].slice(0, 6));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { "image/*": [".jpeg", ".png", ".jpg"] }
  });

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
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
              ? "border-white bg-[#111]" 
              : "border-gray-700 bg-[#0d0d0d] hover:border-gray-500"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3 pointer-events-none text-gray-500">
            <UploadCloud size={24} />
            <div className="text-center">
              <p className="text-sm font-medium text-gray-300">
                {isDragActive ? "Drop images here" : "Drag & drop cube images"}
              </p>
              <p className="text-xs mt-1 text-gray-600 font-mono">(Max 6 images: U-L-F-R-B-D)</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PREVIEW GRID */}
      {images.length > 0 && (
        <div className="flex flex-col gap-3 animate-in fade-in">
          <h3 className="text-xs text-gray-500 tracking-widest uppercase">2. Verify Queue</h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 p-4 bg-[#0d0d0d] border border-gray-800 rounded-xl overflow-x-auto">
            {images.map((file, index) => (
              <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-800 bg-[#111] flex items-center justify-center">
                {/* Aesthetic touch: Images start grayscale to match the theme, 
                  then turn to full color when you hover over them. 
                */}
                <img 
                  src={URL.createObjectURL(file)} 
                  alt={`Face ${index + 1}`} 
                  className="object-cover w-full h-full opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                />
                <button 
                  onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                  className="absolute top-1 right-1 p-1 bg-[#0a0a0a]/80 text-gray-400 hover:text-white border border-gray-700 hover:border-gray-400 rounded text-xs opacity-0 group-hover:opacity-100 transition-all"
                >
                  <X size={12} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-[#0a0a0a]/90 backdrop-blur-sm p-1 border-t border-gray-800 text-center">
                  <span className="text-[9px] text-gray-400 font-mono">FACE {index + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. ACTION AREA */}
      <div className="flex flex-col gap-4 border-t border-gray-800/50 pt-8">
        <button 
          disabled={images.length === 0}
          className="w-full sm:w-auto px-8 py-3 bg-[#ededed] text-black text-sm font-bold rounded-lg hover:bg-white disabled:opacity-30 disabled:hover:bg-[#ededed] transition-colors"
        >
          Analyze with OpenCV {">"}
        </button>
        {images.length === 0 && (
          <p className="text-xs text-gray-600 font-mono">Awaiting image inputs...</p>
        )}
      </div>

    </div>
  );
}