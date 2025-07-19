'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { selectPaymentState, setSelectedPaymentMode } from '@/redux/slices/booking/bookingSlice';
import { PaymentMode, PaymentStatus } from '@/lib/types/payment';
import { useDispatchRedux } from '@/redux/store';
import BookingSummaryCard from '../BookingSummaryCard';
import AmountSummaryCard from '../AmountSummaryCard';
import PlayerSummaryCard from '../PlayerSummaryCard';
import PaymentModeSelector from '../PaymentModeSelector';
import PaymentTimer from '../PaymentTimer';

function PaymentStep() {
  const dispatchRedux = useDispatchRedux();
  const {
    bookingIntent,
    paymentStatus,
    paymentError,
    selectedPaymentMode,
  } = useSelector(selectPaymentState);

  const setPaymentMode = (paymentMode: PaymentMode) => {
    dispatchRedux(setSelectedPaymentMode(paymentMode));
  };

  if (!bookingIntent) {
    return <div className="text-sm text-red-600">No booking intent found.</div>;
  }

  const paymentModes: PaymentMode[] = [
    PaymentMode.CASH
  ];

  return (
    <div className="space-y-4 text-sm text-gray-800">
      {paymentStatus === PaymentStatus.IDLE && (
        <>
          <PaymentTimer
            extraText='Payment expires in - '
            intentExpirationTime={bookingIntent.intent.expiresAt}
            onExpire={() => {
              console.warn('Booking intent expired.');
              // Optional: dispatch an action or redirect
            }}
          />
          <BookingSummaryCard intentDetails={bookingIntent} />
          <PlayerSummaryCard player={bookingIntent.player} />
          <AmountSummaryCard amountDetails={bookingIntent.intent.costDetails} />
          <PaymentModeSelector
            selectedMode={selectedPaymentMode}
            paymentModes={paymentModes}
            onChange={setPaymentMode}
          />
        </>
      )}

      {paymentStatus === PaymentStatus.PENDING && (
        <div className="text-blue-600 text-sm">Processing payment, please wait...</div>
      )}

      {paymentStatus === PaymentStatus.FAILED && (
        <div className="text-red-600 space-y-2">
          <p>{paymentError || 'Payment failed. Please try again.'}</p>
        </div>
      )}
    </div>
  );
}

export default PaymentStep;
