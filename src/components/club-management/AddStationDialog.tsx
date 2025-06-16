'use client';

import React from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import StationForm, { StationFormData } from '@/components/club-management/StationForm';
import Button from '../ui/Button';

interface AddStationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StationFormData) => void;
  loading: boolean;
  error?: string;
}

const AddStationDialog: React.FC<AddStationDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
  error,
}) => {
  const handleClose = () => {
    if (!loading) onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-md rounded-2xl bg-white shadow-xl max-h-[90vh] flex flex-col relative">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-6">
            <Dialog.Title className="text-xl font-semibold text-gray-900">
              Add New Station
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

          {/* Scrollable form content */}
          <div className="relative flex-1">
            <div className="overflow-y-auto p-6 flex-1">
              <StationForm
                onSubmit={onSubmit}
                onCancel={handleClose}
              />
              {error && (
                <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
              )}
            </div>

            {/* Loading Overlay */}
            {loading && (
              <div className="absolute inset-0 bg-white bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 rounded-b-2xl">
                <div className="flex flex-col items-center gap-2">
                  <svg
                    className="animate-spin h-8 w-8 text-gray-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  <p className="text-gray-700 text-sm">Adding station...</p>
                </div>
              </div>
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
              form="station-form"
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Station'}
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default React.memo(AddStationDialog);
