'use client';

import React, { useEffect, useState } from 'react';
import { BookingDetailsResponse } from '@/api/booking/model';
import { toReadableDateTime } from '@/lib/date-time-util';
import Button from '../ui/Button';
import CancelBookingDialog from './CancelBookingDialog';
import { cancelBookingForClubApi } from '@/api/booking/clubBookingApi';
import { BookingStatus } from '@/lib/types/bookings';

interface BookingDetailsCardProps {
    booking: BookingDetailsResponse;
}

function BookingDetailsCard({ booking }: BookingDetailsCardProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);

    const handleCancelBooking = () => {
        setIsDialogOpen(true);
    };

    const handleConfirmCancel = async () => {
        try {
            setLoading(true);
            setError(undefined);
            await cancelBookingForClubApi(booking.club.clubId, booking.bookingId);
            setIsDialogOpen(false);
            booking.booking.bookingStatus = BookingStatus.CANCELLED;
        } catch (err: any) {
            setError(err.message || 'Failed to cancel booking');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

    }, [booking]);

    return (
        <div className="space-y-6">
            {/* Player Info */}
            <div>
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">
                    Player Details
                </h3>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <dt className="font-medium text-gray-600">Name</dt>
                    <dd className="text-gray-900">{booking.player.name}</dd>
                    <dt className="font-medium text-gray-600">Contact</dt>
                    <dd className="text-gray-900">
                        {booking.player.playerPhoneNumber}
                    </dd>
                </dl>
            </div>

            {/* Booking Info */}
            <div>
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">
                    Booking Details
                </h3>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <dt className="font-medium text-gray-600">Station Type</dt>
                    <dd className="text-gray-900">
                        {booking.booking.stationType}
                    </dd>
                    <dt className="font-medium text-gray-600">Players</dt>
                    <dd className="text-gray-900">
                        {booking.booking.totalPlayers}
                    </dd>
                    <dt className="font-medium text-gray-600">Start Time</dt>
                    <dd className="text-gray-900">
                        {toReadableDateTime(booking.booking.startTime, true)}
                    </dd>
                    <dt className="font-medium text-gray-600">End Time</dt>
                    <dd className="text-gray-900">
                        {toReadableDateTime(booking.booking.endTime, true)}
                    </dd>
                    <dt className="font-medium text-gray-600">Booking Status</dt>
                    <dd className="text-gray-900">
                        {booking.booking.bookingStatus}
                    </dd>
                </dl>
            </div>

            {/* Cost Details */}
            {booking.booking.costDetails && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">
                        Cost Details
                    </h3>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <dt className="font-medium text-gray-600">Total Cost</dt>
                        <dd className="text-gray-900 font-bold">
                            ₹{booking.booking.costDetails.totalCost}
                        </dd>
                    </dl>

                    {/* Cost Breakup */}
                    <div className="mt-4 space-y-4">
                        {booking.booking.costDetails.costBreakup.map((breakup, idx) => (
                            <div key={idx} className="border rounded-lg p-3 bg-gray-50">
                                <h4 className="font-semibold text-gray-700">
                                    {breakup.category} — ₹{breakup.cost}
                                </h4>
                                <ul className="mt-2 space-y-1 text-sm text-gray-600">
                                    {breakup.details.map((item, j) => (
                                        <li key={j} className="flex justify-between">
                                            <div className='flex flex-col justify-start'>
                                                <span>{item.subCategory}</span>
                                                <span className='text-xs'>
                                                    ({item.qty} {item.qtyUnit} × ₹ {item.rate}/{item.rateUnit})
                                                </span>
                                            </div>
                                            <span className="font-medium text-gray-900">
                                                ₹{item.amount}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {
                        (booking.booking.bookingStatus !== BookingStatus.CANCELLED) && (
                            <div className='flex flex-1 items-center justify-end mt-2'>
                                <Button onClick={handleCancelBooking}>
                                    Cancel booking
                                </Button>
                            </div>
                        )
                    }
                </div>
            )}

            <CancelBookingDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onConfirm={handleConfirmCancel}
                loading={loading}
                error={error}
            />
        </div>
    );
}

export default BookingDetailsCard;
