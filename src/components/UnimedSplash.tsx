import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface UnimedSplashProps {
  onComplete: () => void;
}

export default function UnimedSplash({ onComplete }: UnimedSplashProps) {
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 800);
          return 100;
        }
        return prev + 2;
      });
    }, 25);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="absolute inset-0 z-[200] bg-[#dfc9b0] flex flex-col items-center justify-center p-8 overflow-hidden"
    >
      {/* Decorative Traditional Sumatra Geometric Pattern Background */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30-30-30z' fill='%23000' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px'
        }} 
      />

      {/* Decorative Floating Clouds */}
      <motion.div 
        animate={{ x: [-15, 15] }}
        transition={{ duration: 6, repeat: Infinity, repeatType: 'reverse', ease: "easeInOut" }}
        className="absolute top-20 -right-10 opacity-30 z-0 pointer-events-none"
      >
        <svg width="140" height="80" viewBox="0 0 120 70" fill="white">
          <path d="M30 60c-12 0-22-8-22-20s10-20 22-20c4-8 12-12 20-12s16 4 20 12c8-4 20-4 28 8 8 12 4 32-16 32H30z" />
        </svg>
      </motion.div>
      <motion.div 
        animate={{ x: [15, -15] }}
        transition={{ duration: 7, repeat: Infinity, repeatType: 'reverse', ease: "easeInOut" }}
        className="absolute bottom-28 -left-12 opacity-25 z-0 pointer-events-none"
      >
        <svg width="120" height="70" viewBox="0 0 100 60" fill="white">
          <path d="M25 50c-10 0-18-6-18-16s8-16 18-16c3-6 10-10 16-10s13 4 16 10c6-3 16-3 22 6 6 9 3 26-12 26H25z" />
        </svg>
      </motion.div>

      <motion.div
        initial={{ y: 25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center space-y-8 z-10 text-center"
      >
        {/* Logo and Rotating Seal Ring */}
        <div className="relative">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-5 border-2 border-dashed border-stone-800/20 rounded-full"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-2 border-2 border-stone-800/5 rounded-full"
          />
          <div className="w-28 h-28 flex items-center justify-center relative z-10 drop-shadow-md">
            <img 
              src="/Lambang_Universitas_Negeri_Medan.png" 
              alt="UNIMED Logo" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Title Block */}
        <div className="space-y-3">
          <p className="text-[10px] font-black text-stone-700/60 uppercase tracking-[0.3em]">PROTOTIPE MEDIA PEMBELAJARAN</p>
          <h2 className="text-2xl font-black text-stone-900 uppercase tracking-tighter leading-none italic">
            ILMU PENGETAHUAN ALAM
          </h2>
          <div className="h-0.5 w-16 bg-stone-800/30 mx-auto rounded-full" />
          <p className="text-xs font-bold text-stone-800/80 uppercase tracking-[0.15em]">
            UNIVERSITAS NEGERI MEDAN
          </p>
        </div>

        {/* Progress Bar & Spinner */}
        <div className="pt-6 w-48 flex flex-col items-center gap-3">
          <div className="w-full h-1 bg-stone-800/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-stone-900 rounded-full"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <p className="font-mono text-[9px] font-bold text-stone-600 tracking-widest uppercase">
            MEMUAT DATA... {loadingProgress}%
          </p>
        </div>
      </motion.div>

      {/* Decorative Bottom Slogan */}
      <p className="absolute bottom-6 font-semibold text-[9px] text-stone-700/40 uppercase tracking-widest">
        Character Building University
      </p>

      {/* Screen Texture */}
      <div 
        className="absolute inset-0 opacity-[0.06] mix-blend-multiply pointer-events-none" 
        style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/natural-paper.png")` }} 
      />
    </motion.div>
  );
}
