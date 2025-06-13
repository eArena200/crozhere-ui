'use client';

import React from "react";
import { Dialog } from '@headlessui/react';
import ClubForm, { ClubFormData } from "@/components/club-management/ClubForm";
import { X } from "lucide-react";
import Button from "../ui/Button";


interface CreateClubDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ClubFormData) => void;
}

const CreateClubDialog: React.FC<CreateClubDialogProps> = ({isOpen, onClose, onSubmit}) => {
    return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-70">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-md rounded-2xl bg-white shadow-xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-6">
            <Dialog.Title className="text-xl font-semibold text-gray-900">Create New Club</Dialog.Title>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable form content */}
          <div className="overflow-y-auto p-6 flex-1">
            <ClubForm
              onSubmit={(data) => {
                onSubmit(data);
                onClose();
              }}
              onCancel={onClose}
            />
          </div>
          
          {/* Fixed footer buttons */}
          <div className="border-t px-6 py-4 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" form="club-form" variant="primary">
              Create Club
            </Button>
          </div>
        </Dialog.Panel>

      </div>
    </Dialog>
  ); 
};

export default React.memo(CreateClubDialog);