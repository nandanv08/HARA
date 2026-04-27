import React, { useEffect, useState } from 'react';

export default function SplashScreen({ onComplete }) {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Start fading out quietly at 2.5s if not clicked
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2500);

    // Completely unmount around 3.2s
    const endTimer = setTimeout(() => {
      onComplete();
    }, 3200);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(endTimer);
    };
  }, [onComplete]);

  const handleSkip = () => {
    if (isFadingOut) return;
    setIsFadingOut(true);
    setTimeout(onComplete, 700);
  };

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-[9999] bg-[#EAD7C5] flex flex-col items-center justify-center transition-opacity duration-700 ease-in-out cursor-pointer ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center justify-center animate-lux-scale-fade px-6 text-center">
        {/* Brand Name */}
        <h1 className="font-serif text-[clamp(44px,8vw,72px)] text-[#2a2420] tracking-widest mb-3 pr-2">
          Hara
        </h1>
        
        {/* Subtitle */}
        <p className="font-sans text-[10px] md:text-sm tracking-[0.5em] md:tracking-[0.8em] text-[#38302c]/80 uppercase ml-2 mb-5">
          Jewellery
        </p>

        {/* Thin Line */}
        <div className="w-16 h-[1px] bg-[#38302c]/50"></div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes luxScaleFade {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-lux-scale-fade {
          animation: luxScaleFade 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}} />
    </div>
  );
}
