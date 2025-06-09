'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'next/navigation';
import { AppDispatch } from '@/redux/store';
import { fetchClubsForAdmin } from '@/redux/slices/club/clubSlice';
import CreateClubDialog from '@/components/club-management/CreateClubDialog';
import Button from '@/components/ui/Button';
import ClubList from '@/components/club-management/desktop/ClubList';
import ClubDetails from './ClubDetails';
import { Building2, Plus } from 'lucide-react';
import { ClubFormData } from '../CreateOrEditClubForm';

function ClubManagementDesktop() {
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

  const handleCreateClub = (clubData: ClubFormData) => {
    //TODO: Add create club api logic here.
  }

  return (
    <div className="flex flex-col bg-gray-50 w-full h-screen overflow-hidden">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 flex items-center justify-between w-full px-8 py-5 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Manage Clubs</h1>
            <p className="text-sm text-gray-500 mt-0.5">View and manage your gaming clubs</p>
          </div>
        </div>
        <Button 
          variant="primary"
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Club</span>
        </Button>
      </div>

      {/* Main Content - Fixed height with ClubDetails scrollable */}
      <div className="flex-1 p-6 overflow-hidden">
        <div className="flex gap-6 h-full">
          {/* Club List Section - Fixed */}
          <div className="w-1/4 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <ClubList />
          </div>

          {/* Club Details Section - Scrollable */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <ClubDetails />
            </div>
          </div>
        </div>
      </div>

      {/* Create Club Dialog */}
      <CreateClubDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)} 
        onSubmit={handleCreateClub}
      />
    </div>
  );
}

export default ClubManagementDesktop;
