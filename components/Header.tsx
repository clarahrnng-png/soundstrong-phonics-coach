
import React, { useState, useEffect, useRef } from 'react';
import { UserProgress } from '../types';

interface HeaderProps {
  progress?: UserProgress;
}

const Header: React.FC<HeaderProps> = ({ progress }) => {
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showPerfect, setShowPerfect] = useState(false);
  const [showBadgeAlert, setShowBadgeAlert] = useState(false);
  
  const prevLevelRef = useRef<number | undefined>(progress?.level);
  const prevPointsRef = useRef<number | undefined>(progress?.points);
  const prevBadgesLenRef = useRef<number | undefined>(progress?.badges.length);

  useEffect(() => {
    if (!progress) return;

    // Trigger Level Up
    if (prevLevelRef.current && progress.level > prevLevelRef.current) {
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 2200); // Snappier duration
    }
    prevLevelRef.current = progress.level;

    // Trigger Perfect Score Reinforcement (points jump of 50 or more)
    if (prevPointsRef.current !== undefined && (progress.points - prevPointsRef.current) >= 50) {
      setShowPerfect(true);
      setTimeout(() => setShowPerfect(false), 1400); // Snappier duration
    }
    prevPointsRef.current = progress.points;

    // Trigger Badge Mastery Alert
    if (prevBadgesLenRef.current !== undefined && progress.badges.length > prevBadgesLenRef.current) {
      setShowBadgeAlert(true);
      setTimeout(() => setShowBadgeAlert(false), 4000); // Longer for reading the badge alert
    }
    prevBadgesLenRef.current = progress.badges.length;

  }, [progress]);

  return (
    <header className="bg-white border-b border-orange-100 py-3 px-6 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/90">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500 text-white p-2 rounded-xl shadow-orange-200 shadow-lg transition-transform hover:scale-110 active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-black text-gray-800 tracking-tight leading-none mb-0.5">Sound Strong AI</h1>
            <p className="text-[10px] text-orange-600 font-black uppercase tracking-widest">Education Coach</p>
          </div>
        </div>

        {progress && (
          <div className="flex items-center gap-4 md:gap-8 relative">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="bg-orange-100 text-orange-600 p-1.5 rounded-lg group-hover:bg-orange-200 transition-colors">
                 🔥
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-orange-600 leading-none">{progress.streak}</span>
                <span className="text-[9px] font-bold text-gray-400 uppercase">Streak</span>
              </div>
            </div>

            <div className="flex items-center gap-2 group cursor-pointer relative">
              <div className={`bg-yellow-100 text-yellow-600 p-1.5 rounded-lg transition-all duration-500 ${showPerfect ? 'ring-4 ring-yellow-300 scale-110 shadow-lg shadow-yellow-100' : 'group-hover:bg-yellow-200'}`}>
                 ⭐
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-gray-700 leading-none">{progress.points}</span>
                <span className="text-[9px] font-bold text-gray-400 uppercase">Points</span>
              </div>
              
              {/* Perfect Score Float Label */}
              {showPerfect && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none animate-float-up">
                  <span className="text-[11px] font-black bg-gradient-to-r from-yellow-500 to-orange-500 text-transparent bg-clip-text whitespace-nowrap drop-shadow-md">
                    PERFECT! ✨
                  </span>
                </div>
              )}
            </div>

            <div className="hidden md:flex items-center gap-2 group cursor-pointer border-l border-orange-100 pl-8 relative">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-[10px] font-black shadow-md transition-all duration-700 ${showLevelUp ? 'scale-125 ring-8 ring-orange-100' : ''}`}>
                 L{progress.level}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-gray-700 leading-none">Level Up</span>
                <div className="w-16 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                  <div 
                    className={`h-full bg-orange-400 transition-all duration-1000 ${showLevelUp ? 'w-full' : ''}`} 
                    style={{ width: showLevelUp ? '100%' : `${(progress.points % 500) / 5}%` }}
                  ></div>
                </div>
              </div>

              {/* Achievement/Badge Master Popover */}
              {showBadgeAlert && (
                <div className="absolute -top-14 -left-10 animate-badge-master pointer-events-none">
                  <div className="bg-white text-orange-600 text-[10px] font-black px-4 py-2 rounded-2xl shadow-2xl border-2 border-orange-100 flex items-center gap-2 whitespace-nowrap">
                    <span className="text-base">🏆</span> NEW BADGE UNLOCKED!
                  </div>
                </div>
              )}

              {/* Level Up Popover */}
              {showLevelUp && (
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 animate-level-up-pop pointer-events-none">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[11px] font-black px-4 py-1.5 rounded-full shadow-2xl whitespace-nowrap border-2 border-white flex items-center gap-2">
                    <span className="text-base">🎉</span> LEVEL {progress.level} REACHED!
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <nav className="hidden lg:flex gap-6 text-xs font-black text-gray-400 uppercase tracking-widest">
          <a href="#" className="hover:text-orange-500 transition-colors">Course</a>
          <a href="#" className="hover:text-orange-500 transition-colors">History</a>
        </nav>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes level-up-pop {
          0% { transform: translate(-50%, 30px) scale(0.6); opacity: 0; }
          20% { transform: translate(-50%, -5px) scale(1.1); opacity: 1; }
          35% { transform: translate(-50%, 0px) scale(1); opacity: 1; }
          80% { transform: translate(-50%, 0px) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -20px) scale(0.95); opacity: 0; }
        }
        @keyframes float-up {
          0% { transform: translate(-50%, 15px); opacity: 0; }
          30% { opacity: 1; transform: translate(-50%, 0px); }
          100% { transform: translate(-50%, -40px); opacity: 0; }
        }
        @keyframes badge-master {
          0% { transform: translateY(20px) scale(0.7) rotate(-5deg); opacity: 0; }
          15% { transform: translateY(-5px) scale(1.1) rotate(2deg); opacity: 1; }
          25% { transform: translateY(0) scale(1) rotate(0); opacity: 1; }
          85% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-30px) scale(0.8); opacity: 0; }
        }
        .animate-level-up-pop {
          animation: level-up-pop 2.2s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }
        .animate-float-up {
          animation: float-up 1.4s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        .animate-badge-master {
          animation: badge-master 4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}} />
    </header>
  );
};

export default Header;
