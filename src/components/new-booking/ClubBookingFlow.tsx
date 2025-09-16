'use client';

import React, { useEffect } from 'react';
import { useDispatchRedux } from '@/redux/store';
import { useSelector } from 'react-redux';
import {
  setClubIdAndFetchStations,
  selectBookingState,
  createBookingIntent,
  resetState,
  initiatePayment,
  fetchAndSetActiveIntents,
  cancelBookingIntent,
} from '@/redux/slices/booking/bookingSlice';
import SelectTimeOrStationStep from '@/components/new-booking/steps/SelectTimeOrStationStep';
import Button from '@/components/ui/Button';
import PaymentStep from '@/components/new-booking/steps/PaymentStep';
import BookingConfirmationStep from '@/components/new-booking/steps/BookingConfirmationStep';
import { BookingStep } from '@/lib/types/bookings';
import { BookingSelectionMode, ClubBookingFlowState } from '@/redux/slices/booking/state';
import { selectAuthUser } from '@/redux/slices/auth/authSlice';
import { UserRole } from '@/lib/types/auth';

interface ClubBookingFlowProps {
  clubId: number;
  closeFlowHandler?: () => void;
}

function ClubBookingFlow({ clubId, closeFlowHandler }: ClubBookingFlowProps) {
  const dispatchRedux = useDispatchRedux();

  const authUser = useSelector(selectAuthUser);
  const bookingState = useSelector(selectBookingState);
  const { currentStep } = bookingState;

  useEffect(() => {
    if (clubId) {
      dispatchRedux(setClubIdAndFetchStations(clubId));
      dispatchRedux(fetchAndSetActiveIntents(clubId));
    }
  }, [clubId, dispatchRedux]);

  const handleCreateNewBooking = async () => {
    dispatchRedux(createBookingIntent());
  };

  const handlePaymentInit = async () => {
    dispatchRedux(initiatePayment());
  };

  const handleDone = () => {
    dispatchRedux(resetState());
    if(closeFlowHandler){
      closeFlowHandler();
    }
  }

  const handleCloseFlow = () => {
    if(currentStep === BookingStep.PAYMENT 
      && bookingState.paymentState.bookingIntent){
      
      const clubId = bookingState.paymentState.bookingIntent.club.clubId;
      const intentId = bookingState.paymentState.bookingIntent.intentId;
      dispatchRedux(cancelBookingIntent({
        clubId: clubId,
        intentId: intentId
      }));
    }
    dispatchRedux(resetState());
    if(closeFlowHandler){
      closeFlowHandler();
    }
  }

  function getHandlerForNext(step: BookingStep){
    switch(step) {
      case BookingStep.SELECTION:
        return handleCreateNewBooking;
      case BookingStep.PAYMENT:
        return handlePaymentInit;
      case BookingStep.COMMIT:
        return handleDone;
    }
  }

  return (
    <div className="flex flex-col h-full w-full bg-white shadow-xl text-gray-600">
      <div className="flex px-4 py-2 justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">New Booking</h2>
        <Button 
          variant="secondary"
          onClick={handleCloseFlow}
        >
          X
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {currentStep === BookingStep.SELECTION && (
          <SelectTimeOrStationStep />
        )}

        {currentStep === BookingStep.PAYMENT && (
          <PaymentStep />
        )}

        {currentStep === BookingStep.COMMIT && (
          <BookingConfirmationStep />
        )}
      </div>

      <div className=" bg-white px-4 py-2 flex flex-1 justify-end">
        <Button 
          disabled={isNextButtonDisabled(currentStep, bookingState, authUser.role)}
          onClick={getHandlerForNext(currentStep)}
        >
          {getProceedButtonText(currentStep)}
        </Button>
      </div>
    </div>
  );
}

function isNextButtonDisabled(
  step: BookingStep, 
  bookingState: ClubBookingFlowState, 
  userRole: UserRole
): boolean {
  const { selectionState } = bookingState;

  switch (step) {
    case BookingStep.SELECTION: {
      const { 
        selectedStationType, 
        mode, 
        timeBased, 
        stationBased 
      } = selectionState;
      const { playerPhoneNumber } = bookingState.bookingPlayerState;
      
      const hasSelectedStationType = !!selectedStationType;
      const isPhoneInvalid = userRole === 'CLUB_ADMIN' 
          && (!playerPhoneNumber || !/^\d{10}$/.test(playerPhoneNumber));

      if (!hasSelectedStationType || isPhoneInvalid) return true;

      if (mode === BookingSelectionMode.TIME) {
        return !(timeBased.startTime && timeBased.endTime && Object.values(timeBased.selectedStations).length > 0);
      }

      if (mode === BookingSelectionMode.STATION) {
        return !(stationBased.selectedSlot && Object.values(stationBased.selectedStations).length > 0);
      }

      return true;
    }

    case BookingStep.PAYMENT:
    case BookingStep.COMMIT:
      return false;

    default:
      return true;
  }
}


function getProceedButtonText(step: BookingStep): string {
  switch(step){
    case BookingStep.SELECTION:
      return 'Proceed';
    case BookingStep.PAYMENT:
      return 'Make Payment';
    case BookingStep.COMMIT:
      return 'Done';
  }
}

export default ClubBookingFlow;
