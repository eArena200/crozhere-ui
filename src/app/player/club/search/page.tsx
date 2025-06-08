'use client';

import { DeviceTypes, useDeviceType } from '@/lib/hooks/useDeviceType';
import MobileClubSearch from '@/components/search/MobileClubSearch';
import DesktopClubSearch from '@/components/search/DesktopClubSearch';

export default function PlayerSearchPage() {
  const deviceType = useDeviceType();

  return (
    <div>
      {deviceType.type === DeviceTypes.MOBILE ? (
        <MobileClubSearch />
      ) : (
        <DesktopClubSearch />
      )}
    </div>
  );
} 