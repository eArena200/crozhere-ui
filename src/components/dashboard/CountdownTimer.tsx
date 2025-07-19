'use client';

import React, { useEffect, useState } from 'react';

interface CountdownTimerProps {
  endTime: string;
  fallbackText?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ endTime, fallbackText = 'Ended' }) => {
  const [remaining, setRemaining] = useState<string | null>(null);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const end = new Date(endTime);
      const diff = end.getTime() - now.getTime();

      if (diff <= 0) {
        setRemaining(fallbackText);
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      setRemaining(`${hours}h:${mins}m`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [endTime, fallbackText]);

  return (
    <div className="flex flex-col w-full max-w-12 h-full max-h-6 items-center justify-center text-xs text-blue-600 bg-blue-200 border border-blue-600 rounded-sm p-2">
      <span>{remaining}</span>
    </div>
  );
};

export default CountdownTimer;
