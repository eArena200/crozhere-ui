'use client';

import React, { useState } from 'react';
import {
  createClub,
  getAllClubs,
  getClubById,
  updateClub,
  deleteClub,
  addStation,
  getStationById,
  getStationsByClubId,
  updateStation,
  deleteStation,
} from '@/api/clubApi';
import { StationType } from '@/lib/types/station';

export default function TestClubApi() {
  const [clubId, setClubId] = useState<number>(1);
  const [clubAdminId, setClubAdminId] = useState<number>(1);
  const [clubName, setClubName] = useState<string>('Test Club');

  const [stationId, setStationId] = useState<number>(1);
  const [stationName, setStationName] = useState<string>('A1');
  const [stationType, setStationType] = useState<StationType>('PC');
  const [stationGroupLayoutId, setStationGroupLayoutId] = useState<string>('group-123');

  return (
    <div className="p-6 space-y-6">
      <h2 className="font-bold text-xl">Test Club & Station API</h2>

      {/* Club Inputs */}
      <div className="space-y-2">
        <h3 className="font-semibold">Club Inputs</h3>
        <input
          className="border px-2 py-1 rounded w-full"
          placeholder="Club Name"
          value={clubName}
          onChange={(e) => setClubName(e.target.value)}
        />
        <input
          className="border px-2 py-1 rounded w-full"
          placeholder="Club Admin ID"
          type="number"
          value={clubAdminId}
          onChange={(e) => setClubAdminId(Number(e.target.value))}
        />
        <input
          className="border px-2 py-1 rounded w-full"
          placeholder="Club ID"
          type="number"
          value={clubId}
          onChange={(e) => setClubId(Number(e.target.value))}
        />
        <div className="flex flex-wrap gap-2">
          <button onClick={async () => {
            const res = await createClub({ name: clubName, clubAdminId });
            console.log('Created Club:', res);
          }} className="bg-blue-500 text-white px-4 py-2 rounded">Create Club</button>

          <button onClick={async () => {
            const res = await getAllClubs();
            console.log('All Clubs:', res);
          }} className="bg-blue-500 text-white px-4 py-2 rounded">Get All Clubs</button>

          <button onClick={async () => {
            const res = await getClubById(clubId);
            console.log('Club:', res);
          }} className="bg-blue-500 text-white px-4 py-2 rounded">Get Club by ID</button>

          <button onClick={async () => {
            const res = await updateClub(clubId, { name: clubName });
            console.log('Updated Club:', res);
          }} className="bg-blue-500 text-white px-4 py-2 rounded">Update Club</button>

          <button onClick={async () => {
            await deleteClub(clubId);
            console.log('Club deleted');
          }} className="bg-blue-500 text-white px-4 py-2 rounded">Delete Club</button>
        </div>
      </div>

      <hr />

      {/* Station Inputs */}
      <div className="space-y-2">
        <h3 className="font-semibold">Station Inputs</h3>
        <input
          className="border px-2 py-1 rounded w-full"
          placeholder="Station Name"
          value={stationName}
          onChange={(e) => setStationName(e.target.value)}
        />
        <select
          className="border px-2 py-1 rounded w-full"
          value={stationType}
          onChange={(e) => setStationType(e.target.value as StationType)}
        >
          <option value="PC">PC</option>
          <option value="PS4">PS4</option>
          <option value="XBOX">XBOX</option>
          <option value="SNOOKER">SNOOKER</option>
          <option value="POOL">POOL</option>
        </select>
        <input
          className="border px-2 py-1 rounded w-full"
          placeholder="Station Group Layout ID"
          value={stationGroupLayoutId}
          onChange={(e) => setStationGroupLayoutId(e.target.value)}
        />
        <input
          className="border px-2 py-1 rounded w-full"
          placeholder="Station ID"
          type="number"
          value={stationId}
          onChange={(e) => setStationId(Number(e.target.value))}
        />

        <div className="flex flex-wrap gap-2">
          <button onClick={async () => {
            const res = await addStation({ clubId, stationName, stationType, stationGroupLayoutId });
            console.log('Added Station:', res);
          }} className="bg-green-500 text-white px-4 py-2 rounded">Add Station</button>

          <button onClick={async () => {
            const res = await getStationById(stationId);
            console.log('Station:', res);
          }} className="bg-green-500 text-white px-4 py-2 rounded">Get Station by ID</button>

          <button onClick={async () => {
            const res = await getStationsByClubId(clubId);
            console.log('Stations in Club:', res);
          }} className="bg-green-500 text-white px-4 py-2 rounded">Get Stations by Club ID</button>

          <button onClick={async () => {
            const res = await updateStation(stationId, { stationName });
            console.log('Updated Station:', res);
          }} className="bg-green-500 text-white px-4 py-2 rounded">Update Station</button>

          <button onClick={async () => {
            await deleteStation(stationId);
            console.log('Station deleted');
          }} className="bg-green-500 text-white px-4 py-2 rounded">Delete Station</button>
        </div>
      </div>
    </div>
  );
}
