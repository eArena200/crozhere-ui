'use client';

import React, { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import EditRateDialog from '@/components/club-management/EditRateDialog';
import { RateFormData } from '@/components/club-management/RateForm';
import { useDispatchRedux } from '@/redux/store';
import { 
    addRateCharge,
    deleteRate,
    deleteRateCharge,
    selectSelectedClubId,
    updateRate,
    updateRateCharge 
} from '@/redux/slices/club/clubManagementSlice';
import { 
    RateResponse,
    RateChargeResponse
} from '@/api/club/model';
import { RateChargeFormData } from '../RateChargeForm';
import CreateRateChargeDialog from '../CreateRateChargeDialog';
import EditRateChargeDialog from '../EditRateChargeDialog';

interface RateListItemProps {
  rateDetails: RateResponse;
}

function RateListItem({ rateDetails }: RateListItemProps) {
  const dispatchRedux = useDispatchRedux();
  const [isEditRateDialogOpen, setEditRateDialogOpen] = useState(false);
  const [isAddChargeDialogOpen, setAddChargeDialogOpen] = useState(false);

  const [isEditChargeDialogOpen, setEditChargeDialogOpen] = useState(false);
  const [editingCharge, setEditingCharge] = useState<RateChargeResponse | null>(null);

  const selectedClubId = useSelector(selectSelectedClubId);

  const handleAddCharge = (rateChargeFormData: RateChargeFormData) => {
    if (selectedClubId) {
      dispatchRedux(
        addRateCharge({
          rateId: rateDetails.rateId,
          data: rateChargeFormData,
        })
      );
    }
  };

  const handleEditRate = (rateFormData: RateFormData) => {
    if (selectedClubId) {
      dispatchRedux(
        updateRate({
          rateId: rateDetails.rateId,
          data: rateFormData,
        })
      )
        .unwrap()
        .then(() => {
          setEditRateDialogOpen(false);
        })
        .catch((err) => {
          console.error('Update rate failed: ', err);
        });
    }
  };

  const handleDeleteRate = () => {
    if (selectedClubId) {
      dispatchRedux(deleteRate(rateDetails.rateId));
    }
  };

  const handleEditCharge = (data: RateChargeFormData) => {
    if (selectedClubId && editingCharge) {
      dispatchRedux(
        updateRateCharge({
          rateChargeId: editingCharge.chargeId,
          data,
        })
      )
        .unwrap()
        .then(() => {
          setEditChargeDialogOpen(false);
          setEditingCharge(null);
        })
        .catch((err) => {
          console.error('Edit charge failed: ', err);
        });
    }
  };

  const handleDeleteCharge = (chargeId: number) => {
    if (selectedClubId) {
      dispatchRedux(deleteRateCharge(chargeId));
    }
  };

  return (
    <div className="p-4 border hover:bg-gray-50 transition m-2">
      {/* Header row */}
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-gray-800">{rateDetails.rateName}</h4>
        <div className="flex space-x-2">
          <button
            onClick={() => setAddChargeDialogOpen(true)}
            className="text-blue-600 hover:text-blue-800"
            title="Add Rate-Charge"
          >
            <Plus className="w-4 h-4" />
          </button>

          <button
            onClick={() => setEditRateDialogOpen(true)}
            className="text-blue-600 hover:text-blue-800"
            title="Edit Rate"
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            onClick={handleDeleteRate}
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
          <div
            key={charge.chargeId}
            className="text-sm text-gray-700 bg-gray-100 rounded p-2"
          >
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium">{`[${charge.chargeType}]`}{' '}</span>
                <span className="font-medium">{charge.chargeName}</span> – ₹
                {charge.amount}{' '}
                <span className="text-gray-500">
                  ({formatUnit(charge.chargeUnit)})
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingCharge(charge);
                    setEditChargeDialogOpen(true);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                  title="Edit Charge"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteCharge(charge.chargeId)}
                  className="text-red-600 hover:text-red-800"
                  title="Delete Charge"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="text-gray-500 text-xs">
              {formatTimeWindow(charge)} {formatPlayerRange(charge)}
            </div>
          </div>
        ))}
      </div>

      {/* Dialogs */}
      <EditRateDialog
        isOpen={isEditRateDialogOpen}
        onClose={() => setEditRateDialogOpen(false)}
        onSubmit={handleEditRate}
        initialData={mapRateResponseToRateForm(rateDetails)}
      />

      <CreateRateChargeDialog
        isOpen={isAddChargeDialogOpen}
        onClose={() => setAddChargeDialogOpen(false)}
        onSubmit={handleAddCharge}
      />

      {editingCharge && (
        <EditRateChargeDialog
          isOpen={isEditChargeDialogOpen}
          onClose={() => {
            setEditChargeDialogOpen(false);
            setEditingCharge(null);
          }}
          onSubmit={handleEditCharge}
          initialData={mapRateChargeToForm(editingCharge)}
        />
      )}
    </div>
  );
}

function mapRateResponseToRateForm(rate: RateResponse): RateFormData {
  return {
    rateName: rate.rateName,
    rateDescription: rate.rateDescription,
  };
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
