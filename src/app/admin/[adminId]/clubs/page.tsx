'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { AppDispatch } from '@/redux/store';
import { fetchClubsForAdmin, selectClubState } from '@/redux/slices/club/clubSlice';
import CreateClubDialog from '@/components/club/CreateClubDialog';
import Button from '@/components/ui/Button';

function ClubListPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { clubs, loading, error } = useSelector(selectClubState);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const params = useParams();
  const adminId = parseInt(params.adminId as string);

  useEffect(() => {
    if (adminId) {
      dispatch(fetchClubsForAdmin(adminId));
    }
  }, [adminId, dispatch]);

  if (!adminId) return <div>Unauthorized</div>;

  return (
    <div className="flex flex-col bg-white w-full min-h-screen text-black p-8 shadow-md">
      <div className="flex items-center justify-between w-full mb-6">
        <h2 className="text-xl font-bold">
          {'MANAGE CLUBS'}
        </h2>
        <Button 
          variant='primary'
          onClick={() => setIsDialogOpen(true)}
        >
          Register New Club
        </Button>
      </div>

      {loading ? (
        <p>Loading clubs...</p>
      ) : error ? (
        <p className="text-red-600">Error: {error}</p>
      ) : clubs.length === 0 ? (
        <p>No clubs found.</p>
      ) : (
        <ul className="space-y-4">
          {clubs.map((club) => (
            <li key={club.clubId} className="p-4 border rounded shadow-sm">
              <div className="font-bold text-lg">{club.name}</div>
              <div className="text-sm text-gray-600">Club ID: {club.clubId}</div>
            </li>
          ))}
        </ul>
      )}

      <CreateClubDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        clubAdminId={adminId}
      />
    </div>
  );
}

export default ClubListPage;
