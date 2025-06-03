import React, { useState } from 'react';
import ZoneLayout from './ZoneLayout';

const mockZones = ['Ground Floor', 'First Floor'];

export default function ClubLayout() {
  const [selectedZone, setSelectedZone] = useState(mockZones[0]);

  return (
    <div className="shadow rounded w-full h-full flex flex-col text-black border-2">
      <div className="flex justify-between items-center p-2 border-b-2">
        <h2 className="text-[1.25rem] font-bold">Club Layout</h2>
        <select
          value={selectedZone}
          onChange={(e) => setSelectedZone(e.target.value)}
          className="border px-[0.75rem] py-[0.5rem] rounded text-sm"
        >
          {mockZones.map((zone) => (
            <option key={zone} value={zone}>
              {zone}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 w-full">
        <ZoneLayout zoneName={selectedZone} />
      </div>
    </div>
  );
}
