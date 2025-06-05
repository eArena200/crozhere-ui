import BottomNavBar from "./layout/BottomNavBar";
import MobileHeader from "./layout/MobileHeader";
import MobileFooter from "./layout/MobileFooter";

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
