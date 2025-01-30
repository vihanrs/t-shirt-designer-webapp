import { useDispatch, useSelector } from "react-redux";
import DesignArea from "./components/DesignArea";
import Header from "./components/Header";
import LineToolBar from "./components/LineToolBar";
import TextToolBar from "./components/TextToolBar";
import ToolBar from "./components/ToolBar";
import { Toaster } from "@/components/ui/toaster";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { FrontT } from "./components/FrontT";
import { setSelectedView } from "./features/tshirtSlice";

const textureURL = "/2.webp";
function App() {
  const tshirtColor = useSelector((state) => state.tshirt.tshirtColor);
  const selectedView = useSelector((state) => state.tshirt.selectedView);
  const dispatch = useDispatch();

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
        <div className="w-[220px] bg-white p-5 rounded-md">
          <ToolBar />
          <TextToolBar />
          <LineToolBar />
        </div>
        <div className="h-[600px] w-full">
          <Canvas>
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
