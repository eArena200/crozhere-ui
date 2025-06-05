'use client';

import { useDeviceType, DeviceTypes } from '@/lib/hooks/useDeviceType';
import DashboardDesktop from '@/components/dashboard/DashboardDesktop';
import DashboardMobile from '@/components/dashboard/DashboardMobile';

function Dashboard() {
  const { type } = useDeviceType();

  return type === DeviceTypes.MOBILE ? <DashboardMobile /> : <DashboardDesktop />;
}

export default Dashboard;
