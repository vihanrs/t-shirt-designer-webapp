import { useSelector, useDispatch } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TSHIRT_TYPES } from "../constants/designConstants";
import TshirtCanvasFront from "./TshirtCanvasFront";
import TshirtCanvasBack from "./TshirtCanvasBack";
import { setSelectedView } from "../features/tshirtSlice";
import { useCanvas } from "@/hooks/useCanvas";

const DesignArea = () => {
  // Get these values from Redux store
  const dispatch = useDispatch();
  const selectedType = useSelector((state) => state.tshirt.selectedType);
  const selectedView = useSelector((state) => state.tshirt.selectedView);
  const { activeCanvas, setSelectedObject } = useCanvas();

  const getSvgPath = (view) => {
    const tshirtType = TSHIRT_TYPES[selectedType];
    return view === "front" ? tshirtType.frontPath : tshirtType.backPath;
  };

  const handleViewChange = (value) => {
    if (value) {
      // Clear any selected object before switching views
      if (activeCanvas) {
        activeCanvas.discardActiveObject();
        activeCanvas.renderAll();
      }

      setSelectedObject(null);
      dispatch(setSelectedView(value));
    }
  };

  return (
    <>
      <div className="text-center justify-center mb-5 bg-white">
        <ToggleGroup
          type="single"
          value={selectedView}
          onValueChange={handleViewChange}
          className=""
        >
          <ToggleGroupItem value="front" className="w-full">
            <p className="h-fit w-full">Front View</p>
          </ToggleGroupItem>
          <ToggleGroupItem value="back" className="w-full">
            <p className="h-fit w-full">Back View</p>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="flex items-start justify-center mb-0">
        <Card className={selectedView !== "front" ? "opacity-50 " : ""}>
          <CardContent>
            <div
              className={`w-full h-full relative ${
                selectedView !== "front" ? "pointer-events-none" : ""
              }`}
            >
              <TshirtCanvasFront view="front" svgPath={getSvgPath("front")} />
            </div>
          </CardContent>
        </Card>
        <Card className={selectedView !== "back" ? "opacity-50" : ""}>
          <CardContent>
            <div
              className={`w-full h-full relative ${
                selectedView !== "back" ? "pointer-events-none" : ""
              }`}
            >
              <TshirtCanvasBack view="front" svgPath={getSvgPath("front")} />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default DesignArea;
