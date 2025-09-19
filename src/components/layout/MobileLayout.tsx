'use client';

import BottomNavBar from "@/components/layout/mobile/BottomNavBar";
import MobileHeader from "@/components/layout/mobile/MobileHeader";

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MobileHeader />
      <main className="min-h-screen w-full bg-white pt-16 pb-16">{children}</main>
      <BottomNavBar />
    </>
  );
}
