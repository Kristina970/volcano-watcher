import { useEffect } from "react";
import TopBar from "@/components/TopBar";
import LeftPanel from "@/components/LeftPanel";
import MapCanvas from "@/components/MapCanvas";
import DetailPanel from "@/components/DetailPanel";

const Index = () => {
  useEffect(() => {
    document.title = "Volcano Explorer — Interactive Global Volcano Map";
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <TopBar />
      <div className="flex flex-1 overflow-hidden relative">
        <LeftPanel />
        <div className="flex-1 relative">
          <MapCanvas />
          <DetailPanel />
        </div>
      </div>
    </div>
  );
};

export default Index;
