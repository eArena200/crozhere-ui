'use client';

import DesktopHeader from "@/components/layout/desktop/DesktopHeader";
import DesktopFooter from "@/components/layout/desktop/DesktopFooter";

export default function DesktopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DesktopHeader />
      <main className="w-screen min-h-screen mt-16 bg-white">
        {children}
      </main>
      <DesktopFooter />
    </>
  );
}
