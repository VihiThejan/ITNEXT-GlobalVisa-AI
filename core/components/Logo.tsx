
import React from 'react';

export const ITNextLogo: React.FC<{ className?: string; hideText?: boolean }> = ({ className = "h-8", hideText = false }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Geometric Sun Icon */}
      <svg viewBox="0 0 100 100" className="h-full w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="48" stroke="#FF8B60" strokeWidth="1" strokeDasharray="4 2" className="opacity-20" />
        {[...Array(12)].map((_, i) => (
          <rect
            key={i}
            x="25"
            y="25"
            width="50"
            height="50"
            rx="8"
            stroke="#FF8B60"
            strokeWidth="1.5"
            transform={`rotate(${i * 15} 50 50)`}
            className="opacity-80"
          />
        ))}
      </svg>
      
      {!hideText && (
        <span className="text-2xl font-[900] tracking-tighter text-[#FF8B60] leading-none">
          ITNEXT
        </span>
      )}
    </div>
  );
};

export default ITNextLogo;
