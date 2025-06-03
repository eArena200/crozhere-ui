import BottomNavBar from "./BottomNavBar";
import MobileHeader from "./MobileHeader";
import MobileFooter from "./MobileFooter";

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MobileHeader />
      <main className="pt-16 pb-16">{children}</main>
      <MobileFooter />
      <BottomNavBar />
    </>
  );
}
