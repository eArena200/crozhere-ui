import DesktopHeader from "./layout/DesktopHeader";
import DesktopFooter from "./layout/DesktopFooter";

export default function DesktopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DesktopHeader />
      <main className="w-full h-full pt-16 pb-0">{children}</main>
      <DesktopFooter />
    </>
  );
}
