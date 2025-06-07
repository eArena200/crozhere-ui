import BottomNavBar from "./mobile/BottomNavBar";
import MobileHeader from "./mobile/MobileHeader";
import MobileFooter from "./mobile/MobileFooter";

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MobileHeader />
      <main className="pt-16">{children}</main>
      <MobileFooter />
      <BottomNavBar />
    </>
  );
}
