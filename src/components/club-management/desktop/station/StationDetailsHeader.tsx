'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Plus } from 'lucide-react';
import AddStationDialog from '@/components/club-management/AddStationDialog';
import { StationFormData } from '@/components/club-management/StationForm';
import { 
  addNewStation,
  selectSelectedClubId,
  selectSelectedClubStationState
} from '@/redux/slices/club/clubManagementSlice';
import { useDispatchRedux } from '@/redux/store';
import { selectAuthRoleBasedId } from '@/redux/slices/auth/authSlice';
import Button from '@/components/ui/Button';

function StationDetailsHeader() {
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
        <div>
            <div className="flex items-center justify-between p-2 border-b border-gray-200">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Stations</h2>
                    <p className="text-xs text-gray-500">Manage your club's stations</p>
                </div>
                <Button
                    onClick={() => setIsAddStationOpen(true)}
                >
                    Add Station
                </Button>
            </div>
            <AddStationDialog 
                isOpen={isAddStationOpen} 
                onClose={() => setIsAddStationOpen(false)} 
                onSubmit={handleAddStation}  
                loading={addStationLoading}
                error={addStationError}      
            />
        </div>
    )
}

export default StationDetailsHeader;