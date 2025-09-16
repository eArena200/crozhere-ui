'use client';

import React from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import Button from "@/components/ui/Button";
import RateCardForm, { RateCardFormData } from "@/components/club-management/components/forms/RateCardForm";
import DialogLoader from "@/components/club-management/components/dialog/DialogLoader";

interface EditRateCardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RateCardFormData) => void;
  initialData: RateCardFormData;
  loading?: boolean;
  error?: string;
}

const EditRateCardDialog: React.FC<EditRateCardDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading = false,
  error,
}) => {
  const handleClose = () => {
    if (!loading) onClose();
  };

  const handleSubmit = (data: RateCardFormData) => {
    if (!loading) onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="relative mx-auto w-full max-w-md rounded-2xl bg-white shadow-xl max-h-[90vh] flex flex-col">
          {/* Loading overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10">
              <span className="text-gray-700 font-medium">Updating...</span>
            </div>
          )}

          {/* Header */}
          <div className="flex items-center justify-between border-b p-6">
            <Dialog.Title className="text-xl font-semibold text-gray-900">
              Edit Rate-Card
            </Dialog.Title>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500"
              disabled={loading}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="overflow-y-auto p-6 flex-1">
            <RateCardForm initialData={initialData} onSubmit={handleSubmit} />
            {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
            {loading && (
              <DialogLoader message="Updating rate card..." />
            )}
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-4 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="rate-card-form"
              variant="primary"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update RateCard"}
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default React.memo(EditRateCardDialog);
