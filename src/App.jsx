import { useDispatch, useSelector } from "react-redux";
import DesignArea from "./components/DesignArea";
import Header from "./components/Header";
import LineToolBar from "./components/LineToolBar";
import TextToolBar from "./components/TextToolBar";
import ToolBar from "./components/ToolBar";
import { Toaster } from "@/components/ui/toaster";
import { Canvas } from "@react-three/fiber";
import { Environment, Loader, OrbitControls } from "@react-three/drei";
import { setSelectedView } from "./features/tshirtSlice";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCanvas } from "./hooks/useCanvas";
import { TshirtModel } from "./components/TShirtModel";
import { useCanvasTextureSync } from "./hooks/useCanvasTextureSync";
import { Suspense } from "react";
import { ToolsSidebar } from "./components/ToolsSidebar";

function App() {
  const tshirtColor = useSelector((state) => state.tshirt.tshirtColor);
  const selectedView = useSelector((state) => state.tshirt.selectedView);
  const dispatch = useDispatch();
  const { frontCanvas, backCanvas } = useCanvas();

  const { designTextureFront, designTextureBack, manualTriggerSync } =
    useCanvasTextureSync({
      frontCanvas,
      backCanvas,
      selectedView,
    });

  // Function to Manually trigger a texture sync
  const manualSync = () => {
    manualTriggerSync(selectedView);
  };

  // Function to update the selected view
  const handleViewChange = (view) => {
    if (view !== selectedView) {
      dispatch(setSelectedView(view));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <ToolsSidebar manualSync={manualSync} />
        <div className="flex-1">
          <div className="flex justify-center py-3 mb-2 bg-white">
            <Header />
          </div>
          <main>
            <div className="flex flex-col md:flex-row gap-10 items-center justify-around">
              <div className="h-[560px] min-w-[500px] relative mx-6 md:mx-0">
                <Canvas>
                  <OrbitControls
                    maxPolarAngle={Math.PI / 2} // Limit the vertical rotation to 90 degrees (looking down)
                    minPolarAngle={Math.PI / 3} // Limit the vertical rotation to 60 degrees (looking up)
                    // Limit horizontal rotation to 45 degrees to the right
                  />
                  <Suspense fallback={null}>
                    <TshirtModel
                      tshirtColor={tshirtColor}
                      onViewChange={handleViewChange}
                      designTexture={designTextureFront}
                      designTextureBack={designTextureBack}
                    />
                    <Environment preset="sunset" />
                  </Suspense>
                </Canvas>
                <Loader
                  containerStyles={{
                    position: "absolute",
                    top: 0,
                    left: 10,
                    width: "100%",
                    height: "100%",
                    background: "rgba(255, 255, 255, 0.8)",
                    pointerEvents: "none",
                  }}
                  dataStyles={{
                    color: "#000000", // Black text color
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                  barStyles={{
                    backgroundColor: "#2563eb", // Blue progress bar
                    height: "2px",
                  }}
                />
                <div className="text-center text-muted-foreground text-sm flex items-center justify-center gap-2">
                  <span>💡</span>
                  <p className="font-bold text-lg">
                    Click on the 3D t-shirt to switch between design areas
                  </p>
                </div>
              </div>

              <div className="">
                <DesignArea />
              </div>
            </div>
          </main>
        </div>
      </div>
      <Toaster />

      {/* Infinite scrolling banner */}
      <div className="fixed bottom-0 left-0 w-full bg-blue-600 py-2 overflow-hidden">
        <div className="relative flex whitespace-nowrap">
          <div className="animate-marquee flex">
            <span className="text-white mx-4">🚧 Site under development</span>
            <span className="text-white mx-4">•</span>
            <span className="text-white mx-4">
              Feel free to try out the design tools
            </span>
            <span className="text-white mx-4">•</span>
            <span className="text-white mx-4">More features coming soon!</span>
            <span className="text-white mx-4">•</span>
            <span className="text-white mx-4">Thanks for visiting</span>
            <span className="text-white mx-4">•</span>
          </div>
          <div className="animate-marquee2 flex absolute top-0 left-0">
            <span className="text-white mx-4">🚧 Site under development</span>
            <span className="text-white mx-4">•</span>
            <span className="text-white mx-4">
              Feel free to try out the design tools
            </span>
            <span className="text-white mx-4">•</span>
            <span className="text-white mx-4">More features coming soon!</span>
            <span className="text-white mx-4">•</span>
            <span className="text-white mx-4">Thanks for visiting</span>
            <span className="text-white mx-4">•</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
