"use client";
import { useState } from 'react';

const LOCATIONS = [
  'Mumbai',
  'Delhi',
  'Bengaluru',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
];

export default function LocationSelector() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState('Select Location');
  const [loading, setLoading] = useState(false);

  const filtered = LOCATIONS.filter((loc) =>
    loc.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (loc: string) => {
    setSelected(loc);
    setOpen(false);
    setSearch('');
  };

  const handleGeo = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported');
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // Placeholder: In real app, use a reverse geocoding API
        setSelected('Your Location');
        setLoading(false);
        setOpen(false);
      },
      (err) => {
        alert('Could not get location');
        setLoading(false);
      }
    );
  };

  return (
    <div className="relative">
      <button
        className="flex items-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-200 transition min-w-[150px]"
        onClick={() => setOpen((o) => !o)}
        type="button"
      >
        <span className="truncate mr-2">{selected}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="flex items-center px-3 py-2 border-b">
            <input
              type="text"
              className="w-full px-2 py-1 border rounded text-gray-700 focus:outline-none"
              placeholder="Search location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
            <button
              className="ml-2 p-1 rounded hover:bg-gray-100"
              title="Use my location"
              onClick={handleGeo}
              disabled={loading}
            >
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
            </button>
          </div>
          <ul className="max-h-60 overflow-y-auto">
            {filtered.length === 0 && (
              <li className="px-4 py-2 text-gray-400">No locations found</li>
            )}
            {filtered.map((loc) => (
              <li
                key={loc}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-700"
                onClick={() => handleSelect(loc)}
              >
                {loc}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 