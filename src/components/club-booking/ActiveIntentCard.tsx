import React from 'react';
import { X } from 'lucide-react'; // Optional: Lucide icon for better UI
import { BookingIntentDetailsResponse } from '@/api/booking/model';
import PaymentTimer from './PaymentTimer';

type Props = {
  intent: BookingIntentDetailsResponse;
  onClick?: () => void;
  onCancel?: () => void;
};

const ActiveIntentCard: React.FC<Props> = ({ intent, onClick, onCancel }) => {
  return (
    <div
      onClick={onClick}
      className="border border-blue-300 rounded-sm bg-gray-100 shadow-md text-sm space-y-1 cursor-pointer hover:bg-blue-50 transition-colors"
    >
      <div className='flex items-center justify-between border-b px-2 py-1'>
        <div className=''>
          <PaymentTimer 
            intentExpirationTime={intent.intent.expiresAt}
          />
        </div>
        <div className=' flex items-center rounded-md ml-2 '>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCancel?.();
            }}
            className="text-gray-600 hover:text-blue-600 border rounded-sm"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className='px-2 py-1'>
        <div className="font-semibold text-blue-700">{intent.club.clubName}</div>
        <div className='flex items-center justify-between'>
          <div className="font-semibold text-gray-700">
            {intent.intent.stationType}
          </div>
          <div>
            {`${intent.intent.totalPlayerCount ?? 0} Players`}
          </div>
        </div>
        <div>
          {new Date(intent.intent.startTime).toDateString()}
        </div>
      </div>
    </div>
  );
};

export default ActiveIntentCard;
