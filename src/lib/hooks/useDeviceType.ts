import { useEffect, useState } from 'react';

export enum DeviceTypes {
  MOBILE = 'MOBILE',
  DESKTOP = 'DESKTOP',
}

export interface DeviceType {
  type: DeviceTypes;
}

export function useDeviceType(): DeviceType {
  const [device, setDevice] = useState<DeviceType>({ type: DeviceTypes.DESKTOP });

  useEffect(() => {
    const update = () => {
      const type = window.innerWidth < 768 ? DeviceTypes.MOBILE : DeviceTypes.DESKTOP;
      setDevice({ type });
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return device;
}
