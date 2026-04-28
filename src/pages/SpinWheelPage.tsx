// pages/SpinWheelPage.tsx
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SpinWheelSection from '@/components/SpinWheelSection';
import { useConfig } from "@/contexts/ConfigContext";

export default function SpinWheelPage() {
  const { config } = useConfig();

  return (
    <div className="min-h-screen flex flex-col">
      {config.header.enabled && <Header />}
      
      <main className="flex-1">
        {/* Full Screen 3D Spin Wheel */}
        <SpinWheelSection fullScreen={true} />
      </main>

      {config.footer.enabled && <Footer />}
    </div>
  );
}
