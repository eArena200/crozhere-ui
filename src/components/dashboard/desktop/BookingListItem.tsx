import React from 'react';
import { User, Phone } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { StationType } from '@/lib/types/station';
import { getDayTimeLabel } from '@/lib/utils';

const stationLogos: Record<StationType, string> = {
  SNOOKER: "/assets/snooker.png",
  POOL: "/assets/pool.png",
  PC: "/assets/pc.png",
  PS4: "/assets/ps4.png",
  XBOX: "/assets/xbox.png",
};


export interface BookingListItemProps {
  id: string,
  playerId: string,
  playerName?: string;
  contact: string;
  startTime: Date;
  endTime: Date;
  stationType: StationType;
  players: number;
}

export default function BookingListItem({
  playerName = "Player",
  contact,
  startTime,
  endTime,
  stationType,
  players,
}: BookingListItemProps) {
  return (
    <div className="bg-white hover:bg-gray-200 border-2 border-gray-200 hover:border-blue-200 rounded shadow-sm  transition">
        <div className="items-start gap-2 text-xs font-semibold text-black p-2">
            {getDayTimeLabel(startTime) + " - " + getDayTimeLabel(endTime)}
        </div>
        <div className="w-full border-b border-gray-400" />
        <div className="flex justify-between items-start pt-2 pb-2">
            <div className="w-2/3 flex justify-between items-start pl-2">
                <div className="flex flex-col text-xs text-gray-700 gap-2">
                    <div className="flex items-start gap-2">
                        <User size={16} />
                        {playerName}
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone size={16} />
                        {contact}
                    </div>
                </div>
            </div>
            <div className="w-1/3 flex justify-end items-center gap-2 pr-2 pl-1">
                <Logo src={stationLogos[stationType]} size="sm" variant="rounded" />
                <div className="flex items-start gap-2 text-black">
                    {players}
                </div>
            </div>
        </div>
    </div>
  );
}
