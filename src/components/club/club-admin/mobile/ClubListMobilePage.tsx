'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'next/navigation';
import { AppDispatch } from '@/redux/store';
import { fetchClubsForAdmin } from '@/redux/slices/club/clubSlice';
import CreateClubDialog from '@/components/club/club-admin/desktop/CreateClubDialog';
import Button from '@/components/ui/Button';
import ClubList from '@/components/club/club-admin/desktop/ClubList';

function ClubListMobilePage() {
  const dispatch = useDispatch<AppDispatch>();
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
    <div className="flex flex-col bg-white w-full min-h-screen text-black p-4">
      <div className="flex items-center justify-between w-full mb-4">
        <h2 className="text-lg font-semibold">Your Clubs</h2>
        <Button
          variant="primary"
          onClick={() => setIsDialogOpen(true)}
        >
          Register New
        </Button>
      </div>

      <ClubList isMobile />

      <CreateClubDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        clubAdminId={adminId}
      />
    </div>
  );
}

export default ClubListMobilePage;
