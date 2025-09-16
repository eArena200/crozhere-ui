'use client';

import React, { useState } from 'react';
import { Clock, Pencil, Trash2, Users } from 'lucide-react';
import { useDispatchRedux } from '@/redux/store';
import { 
    deleteRateCharge,
    selectSelectedClubRateState,
    updateRateCharge 
} from '@/redux/slices/club/management/clubManagementSlice';
import { 
    RateChargeResponse
} from '@/api/club/model';
import { RateChargeFormData } from '@/components/club-management/components/forms/RateChargeForm';
import EditRateChargeDialog from '@/components/club-management/components/dialog/EditRateChargeDialog';
import DeleteRateChargeDialog from '@/components/club-management/components/dialog/DeleteRateChargeDialog';
import { useSelector } from 'react-redux';
import { ChargeUnit } from '@/lib/types/rate';

interface RateChargeListItemProps {
  rateCharge: RateChargeResponse;
}

function RateChargeListItem({ rateCharge }: RateChargeListItemProps) {
  const dispatchRedux = useDispatchRedux();
  const [isEditChargeDialogOpen, setEditChargeDialogOpen] = useState(false);
  const [isDeleteChargeDialogOpen, setDeleteChargeDialogOpen] = useState(false);

  const {
    updateRateChargeLoading,
    updateRateChargeError,
    deleteRateChargeLoading,
    deleteRateChargeError
  } = useSelector(selectSelectedClubRateState);

  const handleEditCharge = (data: RateChargeFormData) => {
    dispatchRedux(
      updateRateCharge({
        rateChargeId: rateCharge.chargeId,
        data,
      })
    )
    .unwrap()
    .then(() => {
      setEditChargeDialogOpen(false);
    })
    .catch((err) => {
      console.error('Edit charge failed: ', err);
    });
  };

  const handleDeleteCharge = (chargeId: number) => {
    console.log('Deleting charge with ID:', chargeId);
    dispatchRedux(deleteRateCharge(chargeId))
    .unwrap()
    .then(() => {
      setDeleteChargeDialogOpen(false);
    })
    .catch((err) => {
      console.error('Delete charge failed: ', err);
    });
  };

  return (
    <div>
      <div
        key={rateCharge.chargeId}
        className="flex flex-row justify-between items-center w-full text-xs
         text-gray-700 bg-gray-100 border border-gray-200 rounded p-2"
      >
        { /* Charge Details */}
        <div className='flex flex-col gap-1 w-3/6 items-start justify-start'>
          <span className="font-medium  text-black text-md">{rateCharge.chargeName}</span>
          <span className="text-black">
            {`₹ ${rateCharge.amount} ${formatUnit(rateCharge.chargeUnit)}`}
          </span>
          <span className="font-medium  text-gray-500 text-xs">{rateCharge.chargeType}</span>
        </div>

        { /* Charge Constraints */}
        <div className='flex flex-col h-full w-3/6 items-start justify-start gap-1'>
          {
            rateCharge.minPlayers && rateCharge.maxPlayers &&
            <div className='flex gap-1'>
              <Users size={15} />
              <span className="text-gray-600 text-xs">
                {formatPlayerRange(rateCharge)}
              </span>
            </div>
          }
          {
            rateCharge.startTime && rateCharge.endTime &&
            <div className='flex gap-1'>
              <Clock size={12} />
              <span className="text-gray-600 text-xs">
                {formatTimeWindow(rateCharge)}
              </span>
            </div>
          }
        </div>

        { /* Charge Controls */}
        <div className="flex flex-col w-1/6 gap-2 justify-end items-end">
          <button
            onClick={() => setEditChargeDialogOpen(true)}
            className="p-1.5 w-7 h-7 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors 
              duration-200 border border-blue-200 flex items-center hover:shadow-sm hover:shadow-blue-300"
            title="Edit Charge"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteChargeDialogOpen(true)}
            className="p-1.5 w-7 h-7 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors 
              duration-200 border border-red-200 flex items-center hover:shadow-sm hover:shadow-red-300"
            title="Delete Charge"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div >

      <EditRateChargeDialog
        isOpen={isEditChargeDialogOpen}
        onClose={() => setEditChargeDialogOpen(false)}
        onSubmit={handleEditCharge}
        initialData={mapRateChargeToForm(rateCharge)}
        loading={updateRateChargeLoading}
        error={updateRateChargeError}
      />

      <DeleteRateChargeDialog
        rateChargeId={rateCharge.chargeId}
        isOpen={isDeleteChargeDialogOpen}
        onClose={() => setDeleteChargeDialogOpen(false)}
        onDelete={() => handleDeleteCharge(rateCharge.chargeId)} 
        loading={deleteRateChargeLoading}
        error={deleteRateChargeError}
      />
    </div>
  );
}

function mapRateChargeToForm(charge: RateChargeResponse): RateChargeFormData {
  return {
    chargeType: charge.chargeType,
    chargeName: charge.chargeName,
    chargeAmount: charge.amount,
    chargeUnit: charge.chargeUnit,
    startTime: charge.startTime,
    endTime: charge.endTime,
    minPlayers: charge.minPlayers,
    maxPlayers: charge.maxPlayers,
  };
}

function formatUnit(unit: ChargeUnit): string {
  switch (unit) {
    case ChargeUnit.PER_HOUR:
      return '/hour';
    case ChargeUnit.PER_PLAYER_PER_HOUR:
      return '/player-hour';
  }
}

function formatTimeWindow(charge: RateChargeResponse): string {
  if (charge.startTime && charge.endTime) {
    return `${charge.startTime} - ${charge.endTime}`;
  }
  return '';
}

function formatPlayerRange(charge: RateChargeResponse): string {
  if (charge.minPlayers && charge.maxPlayers) {
    return `${charge.minPlayers} - ${charge.maxPlayers} players`;
  }
  return '';
}

export default RateChargeListItem;
