'use client';

import React, { useEffect, useState } from 'react';
import CBMobileHeader from '@/components/club-bookings/mobile/CBMobileHeader';
import MobileFilterSection from '@/components/club-bookings/mobile/MobileFilterSection';
import PaginationFooter from '@/components/club-bookings/PaginationFooter';

import {
  getClubsForAdminApi
} from '@/api/club-management/clubManagementApi';
import {
  getBookingsForClubApi,
} from '@/api/booking/clubBookingApi';

import { StationType } from '@/lib/types/station';
import { BookingsFilters, BookingsPagination } from '@/lib/types/bookings';

import { useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectAuthRoleBasedId } from '@/redux/slices/auth/authSlice';
import BookingsList from '@/components/club-bookings/mobile/BookingsList';
import { ClubResponse, StationDetailsResponse } from '@/api/club/model';
import { BookingDetailsResponse } from '@/api/booking/model';
import { getStationsInClubApi } from '@/api/club/clubDetailsApi';

function ClubBookingsMobile() {
  const [clubList, setClubList] = useState<ClubResponse[]>([]);
  const [selectedClubId, setSelectedClubId] = useState<number | null>(null);
  const [supportedStationTypes, setSupportedStationTypes] = useState<StationType[]>([]);
  const [bookings, setBookings] = useState<BookingDetailsResponse[]>([]);
  const [totalBookings, setTotalBookings] = useState<number>(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [pagination, setPagination] = useState<BookingsPagination>({
    page: 1,
    pageSize: 10,
  });

  const [filters, setFilters] = useState<BookingsFilters>({
    fromDateTime: '',
    toDateTime: '',
    stationTypes: [],
    bookingStatuses: [],
    bookingTypes: [],
  });

  const params = useParams();
  const paramAdminId = parseInt(params.adminId as string);
  const authAdminId = useSelector(selectAuthRoleBasedId);

  useEffect(() => {
    if (authAdminId && paramAdminId === authAdminId) {
      fetchClubs(authAdminId);
    }
  }, [authAdminId]);

  useEffect(() => {
    if (selectedClubId) {
      fetchStations(selectedClubId);
    }
  }, [selectedClubId]);

  useEffect(() => {
    if (selectedClubId) {
      fetchBookings(selectedClubId);
    }
  }, [selectedClubId, filters, pagination]);

  async function fetchClubs(clubAdminId: number) {
    try {
      const clubs = await getClubsForAdminApi();
      setClubList(clubs);
      if (clubs.length > 0) {
        setSelectedClubId(clubs[0].clubId);
      }
    } catch (e) {
      console.error('Failed to fetch clubs:', e);
    }
  }

  async function fetchStations(clubId: number) {
    try {
      const stations: StationDetailsResponse[] = await getStationsInClubApi(clubId);
      const stationTypes = Array.from(new Set(stations.map((s) => s.stationType)));
      setSupportedStationTypes(stationTypes);
    } catch (e) {
      console.error('Failed to fetch stations:', e);
    }
  }

  async function fetchBookings(clubId: number) {
    try {
      const data = await getBookingsForClubApi(clubId, filters, pagination);
      setBookings(data.bookings);
      setTotalBookings(data.totalCount || 0);
    } catch (e) {
      console.error('Failed to fetch bookings:', e);
    }
  }

  const handleClubChange = (clubId: number) => {
    setSelectedClubId(clubId);
    setPagination({ page: 1, pageSize: 10 });
    setFilters({
      fromDateTime: '',
      toDateTime: '',
      stationTypes: [],
      bookingStatuses: [],
      bookingTypes: [],
    });
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (size: number) => {
    setPagination({ page: 1, pageSize: size });
  };

  return (
    <div className="relative flex flex-col h-screen bg-white">
      {/* Fixed Header */}
      <CBMobileHeader
        clubList={clubList}
        selectedClubId={selectedClubId}
        onClubChange={handleClubChange}
        onToggleFilter={() => setIsFilterOpen((prev) => !prev)}
      />

      {/* Slide-down Filter Section */}
      {isFilterOpen && (
        <div className="absolute top-16 left-0 right-0 z-40 bg-white shadow-md border-b px-4 py-2">
          <MobileFilterSection
            filters={filters}
            onChange={(updated: Partial<BookingsFilters>) => {
              setFilters((prev) => ({ ...prev, ...updated }));
            }}
            supportedStationTypes={supportedStationTypes}
          />
        </div>
      )}

      {/* Scrollable Booking List */}
      <div className={`flex-1 overflow-y-auto px-4 pt-16 pb-24 ${isFilterOpen ? 'mt-[300px]' : ''}`}>
        <BookingsList bookings={bookings}/>
      </div>

      {/* Fixed Footer Pagination */}
      <div className="fixed bottom-16 left-0 right-0 z-50 bg-white border-t px-4 py-2">
        <PaginationFooter
          currentPage={pagination.page}
          pageSize={pagination.pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          totalCount={totalBookings}
        />
      </div>
    </div>
  );
}

export default ClubBookingsMobile;
