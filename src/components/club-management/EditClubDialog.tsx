'use client';

import React from "react";
import ClubForm, { ClubFormData } from "@/components/club-management/ClubForm";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import Button from "../ui/Button";

interface EditClubDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClubFormData) => void;
  initialData: ClubFormData;
}

const EditClubDialog: React.FC<EditClubDialogProps> = ({isOpen, onClose, onSubmit, initialData}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-md rounded-2xl bg-white shadow-xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-6">
            <Dialog.Title className="text-xl font-semibold text-gray-900">Edit Club</Dialog.Title>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="overflow-y-auto p-6 flex-1">
            <ClubForm
              isEditMode={true}
              initialData={initialData}
              onSubmit={(data) => {
                onSubmit(data);
                onClose();
              }}
              onCancel={onClose}
            />
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-4 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" form="club-form" variant="primary">
              Update Club
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default React.memo(EditClubDialog);