
import React from 'react';

interface MouthAnimationProps {
  state: 'neutral' | 'open' | 'tongue-out' | 'tongue-up' | 'rounded';
  isActive: boolean;
}

const MouthAnimation: React.FC<MouthAnimationProps> = ({ state, isActive }) => {
  // Simple SVG mapping for mouth positions
  const getTonguePath = () => {
    switch (state) {
      case 'tongue-out': return "M 40 65 Q 50 75 65 65"; // Tongue poking out
      case 'tongue-up': return "M 40 60 Q 50 45 60 55"; // Tongue touching roof
      case 'rounded': return "M 45 65 Q 50 70 55 65"; // Small tongue
      case 'open': return "M 35 70 Q 50 80 65 70"; // Low tongue
      default: return "M 40 70 Q 50 75 60 70"; // Neutral
    }
  };

  const getLipsPath = () => {
    switch (state) {
      case 'rounded': return "M 40 50 Q 50 45 60 50 Q 60 75 50 80 Q 40 75 40 50"; // O shape
      case 'open': return "M 30 50 Q 50 40 70 50 Q 70 85 50 95 Q 30 85 30 50"; // Wide open
      default: return "M 30 55 Q 50 50 70 55 Q 70 75 50 80 Q 30 75 30 55"; // Neutral
    }
  };

  return (
    <div className={`relative w-64 h-64 mx-auto bg-white rounded-full border-4 ${isActive ? 'border-orange-400 animate-pulse' : 'border-gray-200'} flex items-center justify-center transition-all duration-500 overflow-hidden shadow-inner`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Background head silhouette */}
        <circle cx="50" cy="50" r="48" fill="#FFF5EB" />
        
        {/* Mouth Cavity */}
        <path d={getLipsPath()} fill="#4A1E1E" className="transition-all duration-300" />
        
        {/* Teeth - Upper */}
        <path d="M 38 58 Q 50 54 62 58" stroke="white" strokeWidth="4" fill="none" />
        
        {/* Tongue */}
        <path 
          d={getTonguePath()} 
          fill="#FF7E7E" 
          stroke="#E05656" 
          strokeWidth="1" 
          className="transition-all duration-300"
        />
        
        {/* Airflow Arrow (only when active) */}
        {isActive && (
          <g className="animate-bounce">
            <path d="M 75 60 L 90 60" stroke="#FF8C00" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#FF8C00" />
              </marker>
            </defs>
          </g>
        )}
      </svg>
      <div className="absolute bottom-2 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
        {state.toUpperCase().replace('-', ' ')}
      </div>
    </div>
  );
};

export default MouthAnimation;
