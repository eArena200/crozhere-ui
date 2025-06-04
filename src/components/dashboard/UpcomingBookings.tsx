import React from 'react';
import BookingListItem from './BookingListItem';
import { StationType } from '@/lib/types/station';

interface Booking {
  id: string;
  startTime: Date;
  endTime: Date;
  playerName: string;
  playerId: string;
  contact: string;
  stationType: StationType
  players: number
}

const stationTypes: StationType[] = ["SNOOKER", "POOL", "PC", "PS4", "XBOX"];
const getRandomStationType = () =>
  stationTypes[Math.floor(Math.random() * stationTypes.length)];
const getRandomPlayers = () => Math.floor(Math.random() * 4) + 1; // 1 to 4 players
const now = Date.now();
const mockBookings: Booking[] = Array.from({ length: 10 }, (_, i) => ({
  id: `ID:${i + 1}`,
  startTime: new Date(now + i * 60 * 60 * 1000), // each 1 hour apart
  endTime: new Date(now + (i + 1) * 60 * 60 * 1000),
  playerName: `Player ${i + 1}`,
  playerId: `P${i + 1}`,
  contact: "9089089004",
  stationType: getRandomStationType(),
  players: getRandomPlayers(),
}));


export default function UpcomingBookings() {
  return (
    <div className="bg-white border-2 border-gray-300 rounded shadow h-full w-full flex flex-col">

      <div className="bg-blue-500 rounded-t p-2 flex items-center justify-center">
        <h2 className="text-md font-bold text-white">Upcoming Bookings</h2>
      </div>

      <div className="bg-white overflow-y-auto flex-1 space-y-2 p-2">
        {mockBookings.map((booking) => (
          <BookingListItem
            key={booking.id}
            id={booking.id}
            playerId={booking.playerId}
            playerName={booking.playerName}
            contact={booking.contact}
            startTime={booking.startTime}
            endTime={booking.endTime}
            stationType={booking.stationType}
            players={booking.players}
          />
        ))}
      </div>
    </div>
  );
}
