import { useDispatch, useSelector } from "react-redux";
import DesignArea from "./components/DesignArea";
import Header from "./components/Header";
import LineToolBar from "./components/LineToolBar";
import TextToolBar from "./components/TextToolBar";
import ToolBar from "./components/ToolBar";
import { Toaster } from "@/components/ui/toaster";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
// import { FrontT } from "./components/FrontT";
import { setSelectedView } from "./features/tshirtSlice";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { useCanvas } from "./hooks/useCanvas";
import { canvasSyncManager } from "./utils/canvasSyncManager";
import { TshirtModel } from "./components/TShirtModel";

const textureURL = "/2.webp";
function App() {
  const tshirtColor = useSelector((state) => state.tshirt.tshirtColor);
  const selectedView = useSelector((state) => state.tshirt.selectedView);
  const dispatch = useDispatch();

  const [designTexture, setDesignTexture] = useState(null);
  const [designTextureBack, setDesignTextureBack] = useState(null);
  const { frontCanvas, backCanvas } = useCanvas();

  const loadInitialTextures = async () => {
    const backTexture = await canvasSyncManager.getCanvasTextureFromStorage(
      "back"
    );
    console.log("backTexture", backTexture);
    setDesignTextureBack(backTexture);
  };

  loadInitialTextures();

  // Add this effect to watch for canvas changes
  useEffect(() => {
    if (!frontCanvas) return;

    // More selective event tracking
    const criticalEvents = [
      "object:modified",
      "object:added",
      "object:removed",
    ];

    const updateTexture = async () => {
      // Add a small delay to ensure canvas has finished updating
      const texture = await (selectedView == "front"
        ? canvasSyncManager.getCanvasTexture(frontCanvas)
        : await canvasSyncManager.getCanvasTextureFromStorage("front"));

      requestAnimationFrame(() => {
        setDesignTexture(texture);
      });
    };
    // Create a debounced version of updateTexture
    const debouncedUpdate = canvasSyncManager.debounce(updateTexture, 350);

    criticalEvents.forEach((event) => {
      frontCanvas.on(event, debouncedUpdate);
    });

    // Initial texture update
    updateTexture();

    return () => {
      criticalEvents.forEach((event) => {
        frontCanvas.off(event, debouncedUpdate);
      });
    };
  }, [frontCanvas, selectedView]);

  // Effect for back canvas
  useEffect(() => {
    if (!backCanvas) return;
    const criticalEvents = [
      "object:modified",
      "object:added",
      "object:removed",
    ];
    const updateBackTexture = async () => {
      const texture = await (selectedView == "back"
        ? canvasSyncManager.getCanvasTexture(backCanvas)
        : await canvasSyncManager.getCanvasTextureFromStorage("back"));
      requestAnimationFrame(() => {
        setDesignTextureBack(texture);
      });
    };
    const debouncedUpdate = canvasSyncManager.debounce(updateBackTexture, 350);
    criticalEvents.forEach((event) => {
      backCanvas.on(event, debouncedUpdate);
    });
    updateBackTexture();
    return () => {
      criticalEvents.forEach((event) => {
        backCanvas.off(event, debouncedUpdate);
      });
    };
  }, [backCanvas, selectedView]);

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
            <ToolBar />
            <TextToolBar />
            <LineToolBar />
          </ScrollArea>
        </div>
        <div className="h-[600px] w-full">
          {/* <Canvas>
            <OrbitControls
              maxPolarAngle={Math.PI / 2} // Limit the vertical rotation to 90 degrees (looking down)
              minPolarAngle={Math.PI / 3} // Limit the vertical rotation to 60 degrees (looking up)
              // Limit horizontal rotation to 45 degrees to the right
            />
            <FrontT
              textureURL={textureURL}
              tshirtColor={tshirtColor}
              selectedView={selectedView}
              onViewChange={handleViewChange}
              designTexture={designTexture}
              designTextureBack={designTextureBack}
            />
            <Environment preset="sunset" />
          </Canvas> */}

          <Canvas>
            <OrbitControls
              maxPolarAngle={Math.PI / 2} // Limit the vertical rotation to 90 degrees (looking down)
              minPolarAngle={Math.PI / 3} // Limit the vertical rotation to 60 degrees (looking up)
              // Limit horizontal rotation to 45 degrees to the right
            />
            <TshirtModel
              textureURL={textureURL}
              tshirtColor={tshirtColor}
              selectedView={selectedView}
              onViewChange={handleViewChange}
              designTexture={designTexture}
              designTextureBack={designTextureBack}
            />
            <Environment preset="sunset" />
          </Canvas>
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
