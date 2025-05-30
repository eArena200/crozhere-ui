"use client";

import { useReducer } from 'react';
import { LocateFixed } from "lucide-react";

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

export interface LocationSelectorProps {
  defaultValue?: string;
  onSelect?: (location: string) => void;
}

interface State {
  open: boolean;
  search: string;
  selected: string;
  loading: boolean;
}

const initialState: State = {
  open: false,
  search: '',
  selected: 'Select Location',
  loading: false,
};

type Action =
  | { type: 'SET_OPEN'; payload: boolean }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_SELECTED'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'RESET' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_OPEN':
      return { ...state, open: action.payload };
    case 'SET_SEARCH':
      return { ...state, search: action.payload };
    case 'SET_SELECTED':
      return { ...state, selected: action.payload, open: false, search: '' };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export default function LocationSelector({ defaultValue: defaultLocation = 'Select Location', onSelect }: LocationSelectorProps) {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    selected: defaultLocation,
  });

  const filtered = LOCATIONS.filter((loc) =>
    loc.toLowerCase().includes(state.search.toLowerCase())
  );

  const handleSelect = (loc: string) => {
    dispatch({ type: 'SET_SELECTED', payload: loc });
    onSelect?.(loc);
  };

  const handleGeo = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported');
    dispatch({ type: 'SET_LOADING', payload: true });
    navigator.geolocation.getCurrentPosition(
      () => {
        dispatch({ type: 'SET_SELECTED', payload: 'Your Location' });
        dispatch({ type: 'SET_LOADING', payload: false });
        onSelect?.('Your Location');
      },
      () => {
        alert('Could not get location');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    );
  };

  return (
    <div className="relative">
      <button
        className="flex items-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-200 transition min-w-[150px]"
        onClick={() => dispatch({ type: 'SET_OPEN', payload: !state.open })}
        type="button"
      >
        <span className="truncate mr-2">{state.selected}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {state.open && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="flex items-center px-3 py-2 border-b">
            <input
              type="text"
              className="w-full px-2 py-1 border rounded text-gray-700 focus:outline-none"
              placeholder="Search location..."
              value={state.search}
              onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
              autoFocus
            />
            <button
              className="ml-2 p-1 rounded hover:bg-gray-100 text-blue-600 disabled:text-gray-300"
              title="Use my location"
              onClick={handleGeo}
              disabled={state.loading}
            >
              <LocateFixed size={20} />
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
