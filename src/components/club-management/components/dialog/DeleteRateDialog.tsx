'use client';

import React from 'react';
import { Dialog } from '@headlessui/react';
import { X, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import DialogLoader from '@/components/club-management/components/dialog/DialogLoader';

interface DeleteRateDialogProps {
  rateId: number;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (rateId: number) => void;
  loading: boolean;
  error?: string;
}

const DeleteRateDialog: React.FC<DeleteRateDialogProps> = ({
  rateId,
  isOpen,
  onClose,
  onDelete,
  loading,
  error,
}) => {
  const handleClose = () => {
    if (!loading) onClose();
  };

  const handleDelete = () => {
    if (!loading) onDelete(rateId);
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-md rounded-2xl bg-white shadow-xl max-h-[90vh] flex flex-col relative">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-6">
            <Dialog.Title className="text-xl font-semibold text-gray-900">
              Delete Rate
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
            <p className="text-black text-md">
              Are you sure you want to delete this rate?
            </p>
            <p className="text-gray-600 text-xs mb-4">
              Note: This action cannot be undone.
            </p>

            {error && (
              <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
            )}

            {/* Loading Overlay */}
            {loading && (
              <DialogLoader message="Deleting rate..." />
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
              type="button"
              variant="danger"
              onClick={handleDelete}
              disabled={loading}
              className="flex items-center"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default React.memo(DeleteRateDialog);
