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
    <div className="p-5 pl-10 h-fit bg-gray-100 min-h-svh">
      <Header />
      <div className="flex gap-6 mt-5">
        <div className="p-5 rounded-md ">
          <ScrollArea className="w-[220px] h-[580px] bg-white rounded-md border p-4">
            <ToolBar manualSync={manualSync} />
            <TextToolBar manualSync={manualSync} />
            <LineToolBar manualSync={manualSync} />
          </ScrollArea>
        </div>
        <div className="h-[600px] w-full">
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
          <Loader />
        </div>
        <div className="">
          <DesignArea />
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
