import React from 'react';

export default function HeroSlider() {
  return (
    <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-[#0a0a0a]">
      {/* Background Image Container */}
      <div className="absolute inset-0 w-full h-full animate-fade-in">
        <img
          src="/slider/hero_banner.jpg"
          alt="Hara Jewellery Collection"
          className="w-full h-full object-cover object-center animate-ken-burns origin-center"
        />
        {/* Soft dark overlay as requested */}
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
      </div>

      {/* Button Overlay Container */}
      <div className="absolute inset-0 flex flex-col justify-end items-center pb-6 md:pb-8 pointer-events-none z-10">
        <div className="animate-fade-in-up pointer-events-auto" style={{ animationDelay: '0.6s', opacity: 0 }}>
          <a
            href="/shop"
            className="px-6 py-2 md:px-8 md:py-2.5 text-[10px] md:text-xs font-medium tracking-[4px] uppercase text-white bg-transparent backdrop-blur-sm border border-white/40 hover:bg-white/10 hover:border-white/70 hover:-translate-y-0.5 transition-all duration-500 rounded-sm shadow-[0_4px_30px_rgba(0,0,0,0.1)] inline-block"
          >
            Explore
          </a>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes kenBurns {
          from { transform: scale(1); }
          to { transform: scale(1.08); }
        }
        .animate-fade-in {
          animation: fadeIn 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .animate-ken-burns {
          animation: kenBurns 20s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}} />
    </section>
  );
}
