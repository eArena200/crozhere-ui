'use client';

import React from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import Button from "@/components/ui/Button";
import RateChargeForm, { RateChargeFormData } from "@/components/club-management/components/forms/RateChargeForm";
import DialogLoader from "@/components/club-management/components/dialog/DialogLoader";

interface EditRateChargeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RateChargeFormData) => void;
  initialData: RateChargeFormData;
  loading: boolean;
  error?: string;
}

const EditRateChargeDialog: React.FC<EditRateChargeDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading,
  error,
}) => {
  const handleClose = () => {
    if (!loading) onClose();
  };

  const handleSubmit = (data: RateChargeFormData) => {
    if (!loading) {
      onSubmit(data);
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-70">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Dialog Panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-md rounded-2xl bg-white shadow-xl max-h-[90vh] flex flex-col relative">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-6">
            <Dialog.Title className="text-xl font-semibold text-gray-900">
              Edit Charge
            </Dialog.Title>
            <button
              onClick={handleClose}
              disabled={loading}
              className={`text-gray-400 hover:text-gray-500 ${
                loading ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto p-6 flex-1 relative">
            <RateChargeForm
              initialData={initialData}
              onSubmit={handleSubmit}
            />

            {error && (
              <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
            )}

            {loading && (
              <DialogLoader message="Updating charge..." />
            )}
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-4 flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="rate-charge-form"
              variant="primary"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Charge"}
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default React.memo(EditRateChargeDialog);
