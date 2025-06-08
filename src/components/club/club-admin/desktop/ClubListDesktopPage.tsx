'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'next/navigation';
import { AppDispatch } from '@/redux/store';
import { fetchClubsForAdmin } from '@/redux/slices/club/clubSlice';
import CreateClubDialog from '@/components/club/CreateClubDialog';
import Button from '@/components/ui/Button';
import ClubList from '@/components/club/ClubList';
import ClubDetails from '../../ClubDetails';

function ClubListDesktopPage() {
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
    <div className="flex flex-col bg-white w-full min-h-screen text-black shadow-md">
      <div className="flex items-center justify-between w-full py-2 px-4 bg-white">
        <h1 className="text-2xl font-bold p-2">Manage Clubs</h1>
        <Button 
          variant="primary"
          onClick={() => setIsDialogOpen(true)}
        >
          Register New Club
        </Button>
      </div>

      <div className='flex flex-row w-full h-full bg-white px-2 py-2'>
        <div className='flex flex-col w-1/5 max-h-[80vh] mr-2 border-2 border-gray-400 rounded-md'>
            <div className='p-2 font-semibold text-white bg-blue-600 text-center shadow rounded-t-sm'> 
                CLUBS 
            </div>
            <ClubList />
        </div>
        <div className='flex flex-col w-4/5 px-4 border-2 border-gray-400 rounded-md'>
            <ClubDetails/>
        </div>
      </div>


      

      <CreateClubDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        clubAdminId={adminId}
      />
    </div>
  );
}

export default ClubListDesktopPage;
