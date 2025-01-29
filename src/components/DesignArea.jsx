import { useSelector, useDispatch } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TSHIRT_TYPES } from "../constants/designConstants";
import TshirtCanvasFront from "./TshirtCanvasFront";
import TshirtCanvasBack from "./TshirtCanvasBack";
import { setSelectedView } from "../features/tshirtSlice";
import { useCanvas } from "@/hooks/useCanvas";

const DesignArea = () => {
  // Get values from Redux store
  const dispatch = useDispatch();
  const selectedType = useSelector((state) => state.tshirt.selectedType);
  const selectedView = useSelector((state) => state.tshirt.selectedView);
  const { activeCanvas, setSelectedObject } = useCanvas();

  const getSvgPath = (view) => {
    const tshirtType = TSHIRT_TYPES[selectedType];
    return view === "front" ? tshirtType.frontPath : tshirtType.backPath;
  };

  const handleViewChange = (view) => {
    if (view !== selectedView) {
      // Clear selected object before switching views
      if (activeCanvas) {
        activeCanvas.discardActiveObject();
        activeCanvas.renderAll();
      }
      setSelectedObject(null);
      dispatch(setSelectedView(view));
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Toggle Buttons */}
      <div className="flex gap-4 mb-5">
        <Button
          onClick={() => handleViewChange("front")}
          variant={selectedView === "front" ? "default" : "outline"}
        >
          Front View
        </Button>
        <Button
          onClick={() => handleViewChange("back")}
          variant={selectedView === "back" ? "default" : "outline"}
        >
          Back View
        </Button>
      </div>

      {/* Conditional Rendering: Only show the selected canvas */}
      <div className="flex justify-center">
        {selectedView === "front" && (
          <Card>
            <CardContent>
              <TshirtCanvasFront svgPath={getSvgPath("front")} />
            </CardContent>
          </Card>
        )}
        {selectedView === "back" && (
          <Card>
            <CardContent>
              <TshirtCanvasBack svgPath={getSvgPath("back")} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DesignArea;
