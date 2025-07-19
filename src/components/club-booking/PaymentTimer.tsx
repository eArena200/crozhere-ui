'use client';

import React, { useEffect, useState } from 'react';

interface PaymentTimerProps {
  intentExpirationTime: string;
  extraText?: string;
  onExpire?: () => void;
}

const PaymentTimer: React.FC<PaymentTimerProps> = ({ extraText, intentExpirationTime, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const diff = new Date(intentExpirationTime).getTime() - Date.now();
    return Math.max(Math.floor(diff / 1000), 0);
  });

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire?.();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onExpire]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full flex flex-1 rounded p-1 bg-blue-600 justify-center text-sm text-white font-medium">
      {`${extraText ?? ''}${formatTime(timeLeft)}`}
    </div>
  );
};

export default PaymentTimer;
