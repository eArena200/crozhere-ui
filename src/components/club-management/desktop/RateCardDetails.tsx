'use client';

import React, { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useSelector } from 'react-redux';
import { 
  addRate, 
  createRateCard, 
  selectClubManagementState, 
  setSelectedRateCardAndFetchDetails, 
  updateRateCard 
} from '@/redux/slices/club/clubManagementSlice';
import CreateRateCardDialog from '@/components/club-management/CreateRateCardDialog';
import CreateRateDialog from '@/components/club-management/CreateRateDialog';
import RateListItem from '@/components/club-management/desktop/RateListItem';
import { useDispatchRedux } from '@/redux/store';
import { RateFormData } from '@/components/club-management/RateForm';
import { RateCardFormData } from '@/components/club-management/RateCardForm';
import EditRateCardDialog from '@/components/club-management/EditRateCardDialog';
import { RateCardDetailsResponse } from '@/api/clubManagementApi';

function RateCardDetails() {
  const dispatchRedux = useDispatchRedux();

  const {
    selectedClubId,
    rateCardList,
    selectedRateCardId,
    selectedRateCardDetails
  } = useSelector(selectClubManagementState)

  const [isExpanded, setIsExpanded] = useState(true);
  const [isCreateRateCardDialogOpen, setCreateRateCardDialogOpen] = useState(false);
  const [isEditRateCardDialogOpen, setEditRateCardDialogOpen] = useState(false);
  const [isCreateRateDialogOpen, setCreateRateDialogOpen] = useState(false);

  const initialFormData = useMemo(() => {
    return selectedRateCardDetails ? mapRateCardDetailsToRateCardForm(selectedRateCardDetails) : null;
  }, [selectedRateCardDetails]);

  const handleSelectRateCard = (rateCardId: number) => {
    const rateCard = rateCardList?.find(card => card.rateCardId === rateCardId);
    if(rateCard){
      dispatchRedux(setSelectedRateCardAndFetchDetails(rateCard));
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

  const handleEditRateCard = (data: RateCardFormData) => {
    if(selectedClubId && selectedRateCardId){
      dispatchRedux(updateRateCard({
        clubId: selectedClubId,
        rateCardId: selectedRateCardId,
        data: data
      }))
      .unwrap()
      .then(() => setEditRateCardDialogOpen(false))
      .catch((err) => {
        console.log("Edit rate-card failed: ", err);
      });
    }
  }

  const handleAddRate = (rateFormData: RateFormData) => {
    if(selectedClubId && selectedRateCardId){
      dispatchRedux(addRate({
        clubId: selectedClubId,
        rateCardId: selectedRateCardId,
        data: rateFormData
      }))
      .unwrap()
      .then(() => setCreateRateDialogOpen(false))
      .catch((err) => {
        console.error("Add rate failed: ", err);
      })
    }
  };

  return (
    <div className="flex flex-col w-full mx-auto bg-gray-100 rounded border-gray-300 border-2">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 bg-white rounded-t cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-xl font-semibold text-gray-900">Rate Cards</h2>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
        />
      </div>

      {isExpanded && (
        <div className="bg-white rounded-b shadow-md overflow-hidden">
          {/* Sub-header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-400">
            { 
              rateCardList && 
              rateCardList.length > 0 && 
              <select
                className="px-3 py-2 border rounded-md text-sm text-gray-700"
                value={selectedRateCardId}
                onChange={(e) => handleSelectRateCard(Number(e.target.value))}
              >
                {rateCardList?.map((card) => (
                  <option key={card.rateCardId} value={card.rateCardId}>
                    {card.name}
                  </option>
                ))}
              </select>
            }
            <Button variant="primary" onClick={() => setCreateRateCardDialogOpen(true)}>
              Add Rate Card
            </Button>
          </div>

          {/* Rate list */}
          {
            rateCardList && rateCardList.length > 0 &&
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">{selectedRateCardDetails?.name}</h3>
                <div className='flex flex-row gap-2'> 
                  <Button 
                    variant="secondary" 
                    className='text-sm'
                    onClick={() => setEditRateCardDialogOpen(true)}>
                    Edit RateCard
                  </Button>
                  <Button 
                    variant="primary" 
                    className='text-sm'
                    onClick={() => setCreateRateDialogOpen(true)}>
                    Add Rate
                  </Button>
                </div>
              </div>

              <div className="max-h-[calc(100vh-12rem)] overflow-y-auto border-2 border-gray-300 rounded-md p-2">
                { selectedRateCardDetails && selectedRateCardDetails.rateList.length === 0 ? (
                  <p className="text-sm text-gray-500 p-4">No rates available.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedRateCardDetails?.rateList.map((rateDetails) => (
                      <RateListItem key={rateDetails.rateId} rateDetails={rateDetails} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          }
        </div>
      )}

      <CreateRateCardDialog 
        isOpen={isCreateRateCardDialogOpen}
        onClose={() => setCreateRateCardDialogOpen(false)}
        onSubmit={handleCreateRateCard}
      />

      {initialFormData && (
        <EditRateCardDialog 
          isOpen={isEditRateCardDialogOpen} 
          onClose={() => setEditRateCardDialogOpen(false)} 
          onSubmit={handleEditRateCard} 
          initialData={initialFormData} 
        />
      )}
      <CreateRateDialog 
        isOpen={isCreateRateDialogOpen}
        onClose={() => setCreateRateDialogOpen(false)}
        onSubmit={handleAddRate}
      />

    </div>
  );
}

function mapRateCardDetailsToRateCardForm(rateCardDetails: RateCardDetailsResponse): RateCardFormData {
  return {
    rateCardName: rateCardDetails?.name
  }
}

export default RateCardDetails;
