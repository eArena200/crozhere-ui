'use client';

import React from 'react';
import AddOrEditStationForm, { 
  StationFormData 
} from './AddOrEditStationForm';


interface AddStationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StationFormData) => void;
}

function AddStationDialog(
  { isOpen, onClose, onSubmit }: AddStationDialogProps) {
  return (
    <AddOrEditStationForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}

export default AddStationDialog;