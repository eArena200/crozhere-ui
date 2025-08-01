'use client';

import ClubBookingsDesktop from '@/components/club-bookings/desktop/ClubBookingsDesktop';
import ClubBookingsMobile from '@/components/club-bookings/mobile/ClubBookingsMobile';
import { DeviceTypes, useDeviceType } from '@/lib/hooks/useDeviceType';

function ClubBookings() {
    const { type } = useDeviceType();

    return (type == DeviceTypes.MOBILE) ? <ClubBookingsMobile/> : <ClubBookingsDesktop/>;
}

export default ClubBookings;