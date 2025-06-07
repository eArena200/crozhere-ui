import DesktopHeader from "@/components/layout/desktop/DesktopHeader";
import DesktopFooter from "@/components/layout/desktop/DesktopFooter";

export default function DesktopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DesktopHeader />
      <main className="w-full h-full pt-16 pb-0">{children}</main>
      <DesktopFooter />
    </>
  );
}
