'use client';

import { useDeviceType, DeviceTypes } from '@/lib/hooks/useDeviceType';
import ClubListDesktopPage from '@/components/club/club-admin/desktop/ClubListDesktopPage';
import ClubListMobilePage from '@/components/club/club-admin/mobile/ClubListMobilePage';

function ClubListPage() {
  const { type } = useDeviceType();

  return type === DeviceTypes.MOBILE ? <ClubListMobilePage /> : <ClubListDesktopPage />;
}

export default ClubListPage;
