'use client';

import React from 'react';
import { stationLogos, StationType } from '@/lib/types/station';
import Logo from '../ui/Logo';
import { User, Users } from 'lucide-react';

interface BookingStationProps {
  stationId: number;
  stationName: string;
  stationType: StationType;
  isAvailable: boolean;
  capacity: number;
  isSelected: boolean;
  playerCount: number;
  onToggle: (stationId: number) => void;
  onPlayerCountChange: (stationId: number, newCount: number) => void;
}

function BookingStation({
  stationId,
  stationName,
  stationType,
  isAvailable,
  capacity,
  isSelected,
  playerCount,
  onToggle,
  onPlayerCountChange,
}: BookingStationProps) {
  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playerCount < capacity) {
      onPlayerCountChange(stationId, playerCount + 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playerCount > 1) {
      onPlayerCountChange(stationId, playerCount - 1);
    }
  };

  const handleToggle = () => {
    if (isAvailable) {
      onToggle(stationId);
    }
  };

  return (
        <div
            onClick={handleToggle}
            className={
                'border-1 items-center rounded-md px-1 pt-2 pb-1 text-center shadow-sm transition relative cursor-pointer ' +
                (!isAvailable ? 'opacity-50 cursor-not-allowed border-gray-400 bg-gray-200 ' : '') +
                (isSelected ? 'bg-blue-200 border-blue-600 border-2 ' : '') +
                (isAvailable && !isSelected ? 'bg-blue-100 border-blue-400 hover:bg-blue-200 hover:border-blue-600 hover:border-2 ' : '')
            }
            title={!isAvailable ? 'Not Available' : ''}
        >
            <div className="font-medium text-lg">{stationName}</div>
            { 
              isAvailable ? (
                  <div className='flex w-full items-center justify-between mt-2'>
                      {
                        capacity > 1 ? (
                          <Users className = 'w-1/5' size={20}/>
                        ) : (
                          <User className = 'w-1/5' size={20}/>
                        )
                      }
                      <div 
                        className={ `w-4/5 ml-1 rounded-md flex justify-between items-center`}
                        title={`Capacity: ${capacity}`}
                      >
                          <button
                              className={`w-1/3 rounded-l text-lg font-semibold
                                ${(capacity === 1 || playerCount === 1 )
                                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                                  : 'bg-blue-600 text-white'}
                              `}
                              onClick={handleDecrement}
                              disabled={capacity === 1 || playerCount === 1}
                          >
                              -
                          </button>
                          <span className="w-1/3 text-sm py-1 bg-white">{playerCount}</span>
                          <button
                              onClick={handleIncrement}
                              className={`w-1/3 rounded-r text-lg font-semibold
                                ${(capacity === 1 || playerCount === capacity) 
                                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                                  : 'bg-blue-600 text-white'}
                              `}
                              disabled={capacity === 1 || playerCount === capacity}
                          >
                              +
                          </button>
                      </div>
                  </div>
              ) : (
                  <div className="w-full text-sm mt-2 text-gray-500 font-medium">Not Available</div>
              )
        }
            
        </div>
    );
}

export default BookingStation;
