import { useSelector, useDispatch } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TSHIRT_TYPES } from "../constants/designConstants";
import TshirtCanvasFront from "./TshirtCanvasFront";
import { setSelectedView } from "../features/tshirtSlice";
import TshirtCanvasBack from "./TshirtCanvasBack";

const DesignArea = () => {
  // Get these values from Redux store
  const dispatch = useDispatch();
  const selectedType = useSelector((state) => state.tshirt.selectedType);
  const selectedView = useSelector((state) => state.tshirt.selectedView);

  const getSvgPath = (view) => {
    const tshirtType = TSHIRT_TYPES[selectedType];
    return view === "front" ? tshirtType.frontPath : tshirtType.backPath;
  };

  const handleViewChange = (value) => {
    if (value) {
      dispatch(setSelectedView(value));
    }
  };

  return (
    <>
      <div className="text-center justify-center pb-5">
        <ToggleGroup
          type="single"
          value={selectedView}
          onValueChange={handleViewChange}
        >
          <ToggleGroupItem value="front" className="w-full">
            <p className="h-fit w-full">Front</p>
          </ToggleGroupItem>
          <ToggleGroupItem value="back" className="w-full">
            <p className="h-fit w-full">Back</p>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Front View</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="w-full h-[600px] relative">
              <TshirtCanvasFront view="front" svgPath={getSvgPath("front")} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Front View</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="w-full h-[600px] relative">
              <TshirtCanvasBack view="front" svgPath={getSvgPath("front")} />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default DesignArea;

{
  /* <Tabs defaultValue="front" className="w-[500px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="front">Front</TabsTrigger>
        <TabsTrigger value="back">Back</TabsTrigger>
      </TabsList>

      <TabsContent value="front">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Front View</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="w-full h-[600px] relative">
              <TshirtCanvas view="front" svgPath={getSvgPath("front")} />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="back">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Back View</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="w-full h-[600px] relative">
              <TshirtCanvas view="back" svgPath={getSvgPath("back")} />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs> */
}
