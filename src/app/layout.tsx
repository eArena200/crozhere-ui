'use client';

import { Inter } from "next/font/google";
import "./globals.css";

import { Providers } from "@/redux/provider";
import { DeviceTypes, useDeviceType } from "../lib/hooks/useDeviceType";
import MobileLayout from "@/components/layout/MobileLayout";
import DesktopLayout from "@/components/layout/DesktopLayout";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const deviceType = useDeviceType();

  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen`}>
        <Providers>
          {deviceType.type === DeviceTypes.MOBILE ? (
            <MobileLayout>{children}</MobileLayout>
          ) : (
            <DesktopLayout>{children}</DesktopLayout>
          )}
        </Providers>
      </body>
    </html>
  );
}
