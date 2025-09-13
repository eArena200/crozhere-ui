'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { useSelector } from 'react-redux';
import { 
  createRateCard,
  selectSelectedClubId, 
  selectSelectedClubRateState,
  setSelectedRateCardId,
} from '@/redux/slices/club/clubManagementSlice';
import CreateRateCardDialog from '@/components/club-management/CreateRateCardDialog';
import { useDispatchRedux } from '@/redux/store';
import { RateCardFormData } from '@/components/club-management/RateCardForm';

function RateCardDetailsHeader() {
  const dispatchRedux = useDispatchRedux();
  const selectedClubId = useSelector(selectSelectedClubId);

  const {
    rateCards,
    selectedRateCardId,
    createRateCardLoading,
    createRateCardError
  } = useSelector(selectSelectedClubRateState);

  const [isCreateRateCardDialogOpen, setCreateRateCardDialogOpen] = useState(false);

  const handleSelectRateCard = (rateCardId: number) => {
    const rateCard = rateCards[rateCardId];
    if(rateCard){
      dispatchRedux(setSelectedRateCardId(rateCardId));
    }
  };

  const handleCreateRateCard = (data: RateCardFormData) => {
    if(selectedClubId){
      dispatchRedux(createRateCard({
        clubId: selectedClubId,
        rateCardFormData: data
      }))
      .unwrap()
      .then(() => setCreateRateCardDialogOpen(false))
      .catch((err) => {
        console.error("Create rate-card failed: ", err);
      })
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center p-2 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Ratecards</h2>
          <p className="text-xs text-gray-500">Manage your club ratecards</p>
        </div>
        <div className='flex gap-2'>
          {
            rateCards && Object.values(rateCards).length > 0 && 
            <select
              className="px-2 py-2 border border-gray-300 rounded-md text-sm text-gray-700"
              value={selectedRateCardId}
              onChange={(e) => handleSelectRateCard(Number(e.target.value))}
            >
              {Object.values(rateCards).map((card) => (
                <option key={card.details.rateCardId} value={card.details.rateCardId}>
                  {card.details.rateCardName}
                </option>
              ))}
            </select>
          }
          <Button variant="primary" onClick={() => setCreateRateCardDialogOpen(true)}>
            Add Rate Card
          </Button>
        </div>
      </div>
      <CreateRateCardDialog 
        isOpen={isCreateRateCardDialogOpen}
        onClose={() => setCreateRateCardDialogOpen(false)}
        onSubmit={handleCreateRateCard}
        loading={createRateCardLoading}
        error={createRateCardError}
      />
    </div>
  )
}

export default RateCardDetailsHeader;