'use-client';

import React, { useMemo, useState } from 'react';
import Button from '@/components/ui/Button';
import { useSelector } from 'react-redux';
import {
  addRate,
  updateRateCard,
  selectSelectedClubId,
  selectSelectedClubRateState,
} from '@/redux/slices/club/clubManagementSlice';
import CreateRateDialog from '@/components/club-management/CreateRateDialog';
import { useDispatchRedux } from '@/redux/store';
import { RateFormData } from '@/components/club-management/RateForm';
import { RateCardFormData } from '@/components/club-management/RateCardForm';
import EditRateCardDialog from '@/components/club-management/EditRateCardDialog';
import { RateCardResponse } from '@/api/club/model';


function RateCardHeaderMobile() {
    const dispatchRedux = useDispatchRedux();

    const [isEditRateCardDialogOpen, setEditRateCardDialogOpen] = useState(false);
    const [isAddRateDialogOpen, setAddRateDialogOpen] = useState(false);

    const {
        rateCards,
        selectedRateCardId,
        addRateLoading,
        addRateError
    } = useSelector(selectSelectedClubRateState);
    
    const selectedClubId = useSelector(selectSelectedClubId);
    const selectedRateCard =
        (selectedRateCardId && rateCards && rateCards[selectedRateCardId])
            ? rateCards[selectedRateCardId]
            : undefined;
    
    const initialFormData = useMemo(() => {
        return selectedRateCard ? mapRateCardDetailsToRateCardForm(selectedRateCard.details) : null;
    }, [selectedRateCard]);

    const handleEditRateCard = (data: RateCardFormData) => {
        if(selectedClubId && selectedRateCardId){
            dispatchRedux(updateRateCard({
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
            rateCardId: selectedRateCardId,
            data: rateFormData
          }))
          .unwrap()
          .then(() => setAddRateDialogOpen(false))
          .catch((err) => {
            console.error("Add rate failed: ", err);
          })
        }
    };


    return (
        <div className="flex justify-between items-center p-2 border-b-2 border-blue-400 bg-gray-100">
            <div className='flex flex-col justify-center ml-2'>
                <p className='text-blue-600 text-md font-medium'> 
                    {selectedRateCard?.details.rateCardName}
                </p>
                <p className='text-gray-600 text-xs font-mono'> 
                    {selectedRateCard?.details.rateCardDescription}
                </p>
            </div>
            <div className='flex flex-row gap-2 mr-2'>
                <Button
                    variant="m_secondary"
                    className='text-sm'
                    onClick={() => setEditRateCardDialogOpen(true)}
                >
                    Edit
                </Button>
                <Button
                    variant="m_primary"
                    className='text-sm'
                    onClick={() => setAddRateDialogOpen(true)}
                >
                    Add Rate
                </Button>
            </div>

            { /* Edit RateCard Dialog */ }
            {
                initialFormData && (
                    <EditRateCardDialog
                        isOpen={isEditRateCardDialogOpen}
                        onClose={() => setEditRateCardDialogOpen(false)}
                        onSubmit={handleEditRateCard}
                        initialData={initialFormData}
                    />
                )
            }

            { /* Add Rate Dialog */ }
            <CreateRateDialog
                isOpen={isAddRateDialogOpen}
                onClose={() => setAddRateDialogOpen(false)}
                onSubmit={handleAddRate} 
                loading={addRateLoading}
                error={addRateError}
            />
            
        </div>
    )
}

function mapRateCardDetailsToRateCardForm(rateCardDetails: RateCardResponse): RateCardFormData {
  return {
    rateCardName: rateCardDetails?.rateCardName,
    rateCardDescription: rateCardDetails?.rateCardDescription
  }
}

export default RateCardHeaderMobile;