'use client';

import React from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import Button from '@/components/ui/Button';
import DialogLoader from '@/components/club-management/components/dialog/DialogLoader';

interface CancelBookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  error?: string;
}

const CancelBookingDialog: React.FC<CancelBookingDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  error,
}) => {
  const handleClose = () => {
    if (!loading) onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-70">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-md rounded-2xl bg-white shadow-xl max-h-[90vh] flex flex-col relative">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-6">
            <Dialog.Title className="text-xl font-semibold text-gray-900">
              Cancel Booking
            </Dialog.Title>
            <button
              onClick={handleClose}
              disabled={loading}
              className={`text-gray-400 hover:text-gray-500 ${
                loading ? 'cursor-not-allowed opacity-50' : ''
              }`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 flex-1 relative">
            <p className="text-gray-700 text-sm mb-4">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>

            {error && (
              <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
            )}

            {loading && <DialogLoader message="Cancelling booking..." />}
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-4 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={handleClose} disabled={loading}>
              Keep Booking
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? 'Cancelling...' : 'Cancel Booking'}
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default React.memo(CancelBookingDialog);
