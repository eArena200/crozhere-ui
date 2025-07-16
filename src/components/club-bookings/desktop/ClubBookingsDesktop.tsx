'use client';

import React, { useEffect, useState } from 'react';
import CBDesktopHeader from './CBDesktopHeader';
import FilterSection from '@/components/club-bookings/desktop/FilterSection';
import BookingsTable from '@/components/club-bookings/desktop/BookingsTable';
import PaginationFooter from '@/components/club-bookings/PaginationFooter';

import {
  BookingResponse,
  getBookingsForClubApi,
} from '@/api/booking/clubBookingApi';
import {
  ClubResponse,
  getClubsForAdminId,
  getStationsByClubId,
  StationDetailsResponse,
} from '@/api/clubManagementApi';

import { StationType } from '@/lib/types/station';
import { BookingsFilters, BookingsPagination } from '@/lib/types/bookings';
import { useSelector } from 'react-redux';
import { selectAuthClubAdminId } from '@/redux/slices/auth/authSlice';
import { useParams } from 'next/navigation';

function ClubBookingsDesktop() {
  const [clubList, setClubList] = useState<ClubResponse[]>([]);
  const [selectedClubId, setSelectedClubId] = useState<number | null>(null);
  const [supportedStationTypes, setSupportedStationTypes] = useState<StationType[]>([]);
  const [bookings, setBookings] = useState<BookingResponse[]>([]);

  const params = useParams();
  const paramAdminId = parseInt(params.adminId as string);
  const authAdminId = useSelector(selectAuthClubAdminId);

  const [pagination, setPagination] = useState<BookingsPagination>({
    page: 1,
    pageSize: 10,
  });

  const [totalBookings, setTotalBookings] = useState<number>(0);

  const [filters, setFilters] = useState<BookingsFilters>({
    fromDateTime: '',
    toDateTime: '',
    stationTypes: [],
    bookingStatuses: [],
    bookingTypes: [],
  });

  useEffect(() => {
    if(authAdminId && paramAdminId === authAdminId) {
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
      const clubs = await getClubsForAdminId(clubAdminId);
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
      const stations: StationDetailsResponse[] = await getStationsByClubId(clubId);
      const stationTypes = Array.from(new Set(stations.map(s => s.stationType)));
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
    setPagination(prev => ({ ...prev, page }));
  };

  const handlePageSizeChange = (size: number) => {
    setPagination({ page: 1, pageSize: size });
  };

  return (
    <div className="min-h-[90vh] w-full space-y-2 bg-white px-2">
      <CBDesktopHeader
        clubList={clubList}
        selectedClubId={selectedClubId}
        onClubChange={handleClubChange}
      />

      <div className="flex gap-6">
        <FilterSection
          supportedStationTypes={supportedStationTypes}
          filters={filters}
          onChange={(updatedFilters) => {
            setFilters(prev => ({
              ...prev,
              ...updatedFilters
            }));
          }}
        />

        <div className="flex-1 space-y-4">
          <BookingsTable bookings={bookings} />

          <PaginationFooter
            currentPage={pagination.page}
            pageSize={pagination.pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            totalCount={totalBookings}
          />
        </div>
      </div>
    </div>
  );
}

export default ClubBookingsDesktop;
