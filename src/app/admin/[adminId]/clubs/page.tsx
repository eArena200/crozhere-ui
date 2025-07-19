'use client';

import { useDeviceType, DeviceTypes } from '@/lib/hooks/useDeviceType';
import ClubManagementDesktop from '@/components/club-management/desktop/ClubManagementDesktop';
import ClubManagementMobile from '@/components/club-management/mobile/ClubManagementMobile';

function ClubListPage() {
  const { type } = useDeviceType();

  return type === DeviceTypes.MOBILE ? <ClubManagementMobile /> : <ClubManagementDesktop />;
}

export default ClubListPage;
