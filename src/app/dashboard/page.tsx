'use client';

import { useDeviceType, DeviceTypes } from '@/lib/hooks/useDeviceType';
import AdminDesktop from '@/components/dashboard/AdminDesktop';
import AdminMobile from '@/components/dashboard/AdminMobile';

export default function Dashboard() {
  const { type } = useDeviceType();

  return type === DeviceTypes.MOBILE ? <AdminMobile /> : <AdminDesktop />;
}
