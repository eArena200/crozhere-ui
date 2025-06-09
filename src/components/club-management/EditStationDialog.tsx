'use client';

import React from 'react';
import AddOrEditStationForm, {
  StationFormData 
} from './AddOrEditStationForm';

interface UpdateStationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: StationFormData) => void;
  initialData: StationFormData;
}

function UpdateStationDialog(
  { isOpen, onClose, onSave, initialData }: UpdateStationDialogProps) {
  return (
    <AddOrEditStationForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSave}
      initialData={initialData}
    />
  );
}

export default UpdateStationDialog;