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
    selectSelectedClubRateState,
    updateRate,
} from '@/redux/slices/club/clubManagementSlice';
import { 
    RateResponse
} from '@/api/club/model';
import { RateChargeFormData } from '@/components/club-management/RateChargeForm';
import CreateRateChargeDialog from '@/components/club-management/CreateRateChargeDialog';
import DeleteRateDialog from '@/components/club-management/DeleteRateDialog';

interface RateHeaderMobileProps {
  rateDetails: RateResponse;
}

function RateHeaderMobile({ rateDetails }: RateHeaderMobileProps) {
  const dispatchRedux = useDispatchRedux();

  const {
    updateRateLoading,
    updateRateError,
    deleteRateLoading,
    deleteRateError,

    addRateChargeLoading,
    addRateChargeError
  } = useSelector(selectSelectedClubRateState);

  const [isEditRateDialogOpen, setEditRateDialogOpen] = useState(false);
  const [isDeleteRateDialogOpen, setDeleteRateDialogOpen] = useState(false);
  const [isAddChargeDialogOpen, setAddChargeDialogOpen] = useState(false);

  const handleAddCharge = (rateChargeFormData: RateChargeFormData) => {
    dispatchRedux(
      addRateCharge({
        rateId: rateDetails.rateId,
        data: rateChargeFormData,
      })
    ).unwrap()
    .then(() => {
      setAddChargeDialogOpen(false);
    })
    .catch((err) => {
      console.error('Add charge failed: ', err);
    });
  };
  
  const handleEditRate = (rateFormData: RateFormData) => {
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
  };

  const handleDeleteRate = (rateId: number) => {
    dispatchRedux(deleteRate(rateId))
      .unwrap()
      .then(() => {
        setDeleteRateDialogOpen(false);
      })
      .catch((err) => {
        console.error('Delete rate failed: ', err);
      });
  };

  return (
    <div className="flex items-center justify-between mb-2">
      <div>
        <h4 className="font-semibold text-md text-gray-800">{rateDetails.rateName}</h4>
        <h4 className="font-mono text-xs text-gray-600">{rateDetails.rateDescription}</h4>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => setAddChargeDialogOpen(true)}
          className="p-1.5 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors 
            duration-200 border border-green-200 hover:shadow-sm hover:shadow-green-300"
          title="Add Rate-Charge"
        >
          <Plus size={16} />
        </button>

        <button
          onClick={() => setEditRateDialogOpen(true)}
          className="p-1.5 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors 
            duration-200 border border-blue-200 hover:shadow-sm hover:shadow-blue-300"
          title="Edit Rate"
        >
          <Pencil className="w-4 h-4" />
        </button>

        <button
          onClick={() => setDeleteRateDialogOpen(true)}
          className="p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors 
            duration-200 border border-red-200 hover:shadow-sm hover:shadow-red-300"
          title="Delete Rate"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <EditRateDialog
        isOpen={isEditRateDialogOpen}
        onClose={() => setEditRateDialogOpen(false)}
        onSubmit={handleEditRate}
        initialData={mapRateResponseToRateForm(rateDetails)}
        loading={updateRateLoading}
        error={updateRateError}
      />

      <DeleteRateDialog
        rateId={rateDetails.rateId}
        isOpen={isDeleteRateDialogOpen}
        onClose={() => setDeleteRateDialogOpen(false)}
        onDelete={handleDeleteRate}
        loading={deleteRateLoading}
        error={deleteRateError}
      />

      <CreateRateChargeDialog
        isOpen={isAddChargeDialogOpen}
        onClose={() => setAddChargeDialogOpen(false)}
        onSubmit={handleAddCharge} 
        loading={addRateChargeLoading}
        error={addRateChargeError}
      />

      
    </div>
  );
}

function mapRateResponseToRateForm(rate: RateResponse): RateFormData {
  return {
    rateName: rate.rateName,
    rateDescription: rate.rateDescription,
  };
}

export default RateHeaderMobile;