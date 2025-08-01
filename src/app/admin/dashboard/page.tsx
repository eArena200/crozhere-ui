'use client';

import { useDeviceType, DeviceTypes } from '@/lib/hooks/useDeviceType';
import DashboardDesktop from '@/components/dashboard/desktop/DashboardDesktop';
import DashboardMobile from '@/components/dashboard/mobile/DashboardMobile';

function Dashboard() {
  const { type } = useDeviceType();

  return type === DeviceTypes.MOBILE ? <DashboardMobile /> : <DashboardDesktop />;
}

export default Dashboard;
