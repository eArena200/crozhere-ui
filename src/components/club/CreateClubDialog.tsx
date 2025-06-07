'use client';

import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useDispatchRedux } from '@/redux/store';
import { createClub } from '@/api/clubApi';
import { fetchClubsForAdmin } from '@/redux/slices/club/clubSlice';
import Button from '@/components/ui/Button';
import Input from '../ui/Input';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  clubAdminId: number;
}

export default function CreateClubDialog({ isOpen, onClose, clubAdminId }: Props) {
  const dispatchRedux = useDispatchRedux();
  const [formData, setFormData] = useState({
    clubName: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setFormData({clubName: ''});
    onClose();
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createClub({ name: formData.clubName, clubAdminId });
      await dispatchRedux(fetchClubsForAdmin(clubAdminId));
      setFormData({ clubName: '' });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create club');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white w-full max-w-3xl max-h-[90vh] rounded-lg shadow-lg overflow-hidden flex flex-col">
          <div className="p-6 border-b">
            <Dialog.Title className="text-lg font-bold text-black">Register New Club</Dialog.Title>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto p-6 space-y-4"
          >
            <Input
                key={"clubName"}
                type="text"
                label={`Club Name`}
                value={formData.clubName}
                onChange={(e) => handleChange('clubName', e.target.value)}
              />

            {error && <p className="text-red-600 text-sm">{error}</p>}
          </form>
          <div className="flex justify-end space-x-2 p-4 border-t">
            <Button 
              variant="secondary" 
              onClick={handleCancel} 
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={loading || !formData.clubName}
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
