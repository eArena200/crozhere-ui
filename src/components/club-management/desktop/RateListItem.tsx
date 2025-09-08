'use client';

import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import EditRateDialog from '@/components/club-management/EditRateDialog';
import { RateFormData } from '@/components/club-management/RateForm';
import { useDispatchRedux } from '@/redux/store';
import { 
    deleteRate,
    selectSelectedClubId, 
    selectSelectedClubRateState,
    updateRate 
} from '@/redux/slices/club/clubManagementSlice';
import { 
    RateResponse,
    RateChargeResponse
} from '@/api/club/model';

interface RateListItemProps {
  rateDetails: RateResponse;
}

function RateListItem({
    rateDetails
}: RateListItemProps) {
    const dispatchRedux = useDispatchRedux();
    const [isEditRateDialogOpen, setEditRateDialogOpen] = useState(false);
    const {
        updateRateLoading,
        updateRateError
    } = useSelector(selectSelectedClubRateState);

    const selectedClubId = useSelector(selectSelectedClubId);

    const handleEdit = (rateFormData: RateFormData) => {
        if(selectedClubId){
            dispatchRedux(updateRate({
                rateId: rateDetails.rateId,
                data: rateFormData
            }))
            .unwrap()
            .then(() => {
                setEditRateDialogOpen(false);
            })
            .catch((err) => {
                console.error("Update rate failed: ", err);
            });
        }
    }

    const handleDelete = (rateId: number) => {
        if(selectedClubId){
            dispatchRedux(deleteRate(rateDetails.rateId));
        }
    }

    return (
        <div className="p-4 border hover:bg-gray-50 transition m-2">
        {/* Header row */}
            <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800">{rateDetails.rateName}</h4>
                <div className="flex space-x-2">
                    
                    <button
                        onClick={() => setEditRateDialogOpen(true)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit Rate"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                
                
                    <button
                        onClick={() => handleDelete(rateDetails.rateId)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete Rate"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

        {/* Charges list */}
            <div className="space-y-2">
                {rateDetails.rateCharges.map((charge: RateChargeResponse) => (
                <div key={charge.chargeId} className="text-sm text-gray-700 bg-gray-100 rounded p-2">
                    <div className="flex justify-between">
                    <div>
                        <span className="font-medium">{charge.chargeType}</span> – ₹{charge.amount}{' '}
                        <span className="text-gray-500">({formatUnit(charge.chargeUnit)})</span>
                    </div>
                    <div className="text-gray-500 text-xs">
                        {formatTimeWindow(charge)} {formatPlayerRange(charge)}
                    </div>
                    </div>
                </div>
                ))}
            </div>
            <EditRateDialog 
                isOpen={isEditRateDialogOpen}
                onClose={() => setEditRateDialogOpen(false)} 
                onSubmit={handleEdit} 
                initialData={mapRateResponseToRateForm(rateDetails)}            
            />
        </div>
    );
};

function mapRateResponseToRateForm(rate: RateResponse): RateFormData{
    const rateFormData: RateFormData = {
        rateName: rate.rateName,
        rateDescription: rate.rateDescription
    }

    return rateFormData;
}

function formatUnit(unit: string): string {
  switch (unit) {
    case 'perHour':
      return 'per hour';
    case 'perPlayerPerHour':
      return 'per player/hour';
    case 'fixed':
      return 'fixed';
    default:
      return unit;
  }
}

function formatTimeWindow(charge: RateChargeResponse): string {
  if (charge.startTime !== null && charge.endTime !== null) {
    return `⏰ ${charge.startTime}:00 - ${charge.endTime}:00`;
  }
  return '';
}

function formatPlayerRange(charge: RateChargeResponse): string {
  if (charge.minPlayers !== null && charge.maxPlayers !== null) {
    return `👥 ${charge.minPlayers}–${charge.maxPlayers} players`;
  }
  return '';
}

export default RateListItem;
