'use client';

import CreateOrEditClubForm, { 
    ClubFormData 
} from "@/components/club-management/CreateOrEditClubForm";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: ClubFormData) => void;
  initialData: ClubFormData;
}

function EditClubDialog(
    { isOpen, onClose, onUpdate, initialData }: Props) {
  return (
    <CreateOrEditClubForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onUpdate}
      initialData={initialData}
    />
  );
}

export default EditClubDialog;