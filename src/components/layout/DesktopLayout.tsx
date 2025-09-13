import DesktopHeader from "@/components/layout/desktop/DesktopHeader";
import DesktopFooter from "@/components/layout/desktop/DesktopFooter";

export default function DesktopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DesktopHeader />
      <main className="w-screen h-[calc(100vh-64px)] mt-16 bg-white">
        {children}
      </main>
      <DesktopFooter />
    </>
  );
}
