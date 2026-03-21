
import React from 'react';
import { BADGES, MOCK_LEADERBOARD } from '../constants';
import { UserProgress, LeaderboardEntry } from '../types';

interface GamificationPanelProps {
  progress: UserProgress;
}

const GamificationPanel: React.FC<GamificationPanelProps> = ({ progress }) => {
  const sortedLeaderboard: LeaderboardEntry[] = [
    ...MOCK_LEADERBOARD,
    { name: '你 (You)', points: progress.points, isCurrentUser: true }
  ].sort((a, b) => b.points - a.points);

  return (
    <div className="space-y-8">
      {/* Badges Section */}
      <section>
        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-4 h-[2px] bg-orange-300"></span> 成就勳章 Badges
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {BADGES.map((badge) => {
            const isEarned = progress.badges.includes(badge.id);
            return (
              <div 
                key={badge.id} 
                className={`relative group p-4 rounded-3xl border-2 flex flex-col items-center text-center transition-all duration-500 ${
                  isEarned 
                    ? `border-orange-200 bg-white shadow-md scale-100` 
                    : 'border-dashed border-gray-200 bg-gray-50/50 opacity-40 grayscale'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl ${isEarned ? badge.color : 'bg-gray-200'} flex items-center justify-center text-2xl mb-2 shadow-sm`}>
                  {badge.icon}
                </div>
                <span className="text-xs font-bold text-gray-700">{badge.name}</span>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-3xl p-3 z-10 pointer-events-none md:pointer-events-auto">
                   <p className="text-[10px] text-gray-600 font-medium">{badge.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Leaderboard Section */}
      <section>
        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-4 h-[2px] bg-orange-300"></span> 排行榜 Leaderboard
        </h3>
        <div className="bg-white rounded-3xl border border-orange-50 overflow-hidden shadow-sm">
          {sortedLeaderboard.map((entry, index) => (
            <div 
              key={index} 
              className={`flex items-center justify-between p-4 border-b border-orange-50 last:border-0 ${
                entry.isCurrentUser ? 'bg-orange-50/50' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`w-6 text-xs font-black ${index < 3 ? 'text-orange-500' : 'text-gray-300'}`}>
                  #{index + 1}
                </span>
                <span className={`text-sm ${entry.isCurrentUser ? 'font-bold text-orange-600' : 'text-gray-600'}`}>
                  {entry.name}
                </span>
              </div>
              <span className="text-xs font-black text-gray-400">
                {entry.points} pts
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default GamificationPanel;
