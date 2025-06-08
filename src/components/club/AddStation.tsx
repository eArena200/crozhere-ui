'use client';

import React, { useState } from 'react';
import Dialog from '@/components/ui/Dialog'; // Replace with your actual Dialog component
import Input from '@/components/ui/Input';   // Replace with your actual Input component
import Button from '@/components/ui/Button';
import { StationType } from '@/lib/types/station';

interface AddStationProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (stationData: {
    stationName: string;
    stationType: StationType;
    isActive: boolean;
  }) => void;
}

function AddStation({ isOpen, onClose, onSave }: AddStationProps) {
  const [stationName, setStationName] = useState('');
  const [stationType, setStationType] = useState<StationType>('PC');
  const [isActive, setIsActive] = useState(true);

  const handleSave = () => {
    if (!stationName.trim()) return;
    onSave({ stationName, stationType, isActive });
    onClose();
    setStationName('');
    setStationType('PC');
    setIsActive(true);
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Add New Station">
      <div className="flex flex-col gap-4 p-2">
        <Input
          label="Station Name"
          value={stationName}
          onChange={(e) => setStationName(e.target.value)}
          placeholder="Enter station name"
        />

        <div>
          <label className="block text-sm font-medium mb-1">Station Type</label>
          <select
            className="w-full border rounded p-2"
            value={stationType}
            onChange={(e) => setStationType(e.target.value as StationType)}
          >
            <option value="PC">PC</option>
            <option value="Console">Console</option>
            <option value="VR">VR</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="active-checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          <label htmlFor="active-checkbox" className="text-sm">Active</label>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save</Button>
        </div>
      </div>
    </Dialog>
  );
}

export default AddStation;
