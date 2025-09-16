'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import AddStationDialog from '@/components/club-management/components/dialog/AddStationDialog';
import { StationFormData } from '@/components/club-management/components/forms/StationForm';
import { 
  addNewStation,
  selectSelectedClubId,
  selectSelectedClubStationState
} from '@/redux/slices/club/management/clubManagementSlice';
import { useDispatchRedux } from '@/redux/store';
import { selectAuthRoleBasedId } from '@/redux/slices/auth/authSlice';
import Button from '@/components/ui/Button';

function StationDetailsHeaderMobile() {
  const dispatchRedux = useDispatchRedux();
  const authAdminId = useSelector(selectAuthRoleBasedId);
  const clubId = useSelector(selectSelectedClubId);

  const {
      addStationLoading,
      addStationError
  } = useSelector(selectSelectedClubStationState);

  const [isAddStationOpen, setIsAddStationOpen] = useState(false);
  
  const handleAddStation = (stationData: StationFormData) => {
      if(authAdminId && clubId){
      dispatchRedux(
          addNewStation({
              clubId: clubId,
              stationFormData: stationData
          }))
          .unwrap()
          .then(() => {
              setIsAddStationOpen(false);
          })
          .catch((err) => {
              console.error('Add Station failed: ', err);
          })
      }
  };

  return (
    <div className="flex items-center justify-between p-2 border-b border-gray-200">
        <div>
            <h2 className="text-md font-semibold text-gray-900">Stations</h2>
            <p className="text-xs text-gray-500">Manage your club's stations</p>
        </div>
        <Button
            variant='m_primary'
            onClick={() => setIsAddStationOpen(true)}
        >
            Add Station
        </Button>
        <AddStationDialog 
          isOpen={isAddStationOpen} 
          onClose={() => setIsAddStationOpen(false)} 
          onSubmit={handleAddStation}  
          loading={addStationLoading}
          error={addStationError}      
      />
    </div>
  );
}

export default StationDetailsHeaderMobile;