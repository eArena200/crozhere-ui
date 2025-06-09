'use client';

import React from "react";
import CreateOrEditClubForm, {
    ClubFormData 
} from "@/components/club-management/CreateOrEditClubForm";


interface CreateStationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ClubFormData) => void;
}

function CreateClubDialog(
    { isOpen, onClose, onSubmit }: CreateStationDialogProps) {
    return (
        <CreateOrEditClubForm 
            isOpen={isOpen} 
            onClose={onClose} 
            onSubmit={onSubmit}  
        />
    );
}

export default CreateClubDialog;