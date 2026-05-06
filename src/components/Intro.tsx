import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface IntroProps {
  onComplete: () => void;
  onFadeStart: () => void;
}

export default function Intro({ onComplete, onFadeStart }: IntroProps) {
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Increase play speed
    if (videoRef.current) {
      videoRef.current.playbackRate = 2.0;
    }
    
    // Fallback in case the video fails to load or play
    const timer = setTimeout(() => {
      handleEnd();
    }, 5000); // adjust maximum duration

    return () => clearTimeout(timer);
  }, []);

  const handleEnd = () => {
    if (!isVideoEnded) {
      setIsVideoEnded(true);
      onFadeStart();
    }
  };

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {!isVideoEnded && (
        <motion.div
          initial={{ opacity: 1, scale: 1, y: 0, borderRadius: "0px" }}
          exit={{ 
            opacity: 0, 
            scale: 0.05, 
            y: "-30vh",
            borderRadius: "100%",
            filter: "blur(15px) brightness(1.5)",
            transition: { duration: 1.4, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden origin-center"
        >
          {/* 
            User instruction: Upload the attached video to the 'public' folder 
            and name it 'intro.mp4' 
          */}
          <video
            ref={videoRef}
            src="/intro.mp4"
            autoPlay
            muted
            playsInline
            onEnded={handleEnd}
            onError={() => {
              // If video is not found, just finish the intro after a short delay
              setTimeout(handleEnd, 2000);
            }}
            className="w-[85vw] md:w-[75vw] lg:w-[65vw] max-h-[85vh] object-contain relative z-0" // smaller video size
            style={{ 
              maskImage: 'radial-gradient(ellipse at center, black 45%, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 45%, transparent 70%)'
            }}
          />
          <div className="absolute bottom-10 left-0 right-0 flex justify-center z-10">
            <button 
              onClick={handleEnd}
              className="px-4 py-2 border border-white/20 rounded-full text-white/50 text-xs hover:bg-white/10 hover:text-white transition-colors"
            >
              Pular Introdução
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
