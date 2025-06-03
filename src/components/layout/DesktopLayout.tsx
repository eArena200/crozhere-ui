import DesktopHeader from "./DesktopHeader";
import DesktopFooter from "./DesktopFooter";

export default function DesktopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DesktopHeader />
      <main className="pt-16 pb-0">{children}</main>
      <DesktopFooter />
    </>
  );
}
