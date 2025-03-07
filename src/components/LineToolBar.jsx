import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useCanvas } from "@/hooks/useCanvas";

const LineToolBar = ({ manualSync }) => {
  const { selectedObject, activeCanvas } = useCanvas();
  const [color, setColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(3);

  useEffect(() => {
    if (selectedObject && selectedObject.type === "line") {
      setColor(selectedObject.fill || "#000000");
    }
  }, [selectedObject]);

  // Only show for text objects
  if (!selectedObject || selectedObject.type !== "line") {
    return null;
  }

  const handleColorChange = (e) => {
    if (!selectedObject || !activeCanvas) return;
    const newColor = e.target.value;
    setColor(newColor);
    selectedObject.set("stroke", newColor);
    activeCanvas.renderAll();
    manualSync();
  };

  const handleStrokeWidthChange = (e) => {
    if (!selectedObject || !activeCanvas) return;
    const newSize = parseInt(e.target.value, 10);
    if (isNaN(newSize) || newSize < 1) return; // Prevent invalid input
    setStrokeWidth(newSize);
    selectedObject.set("strokeWidth", newSize);
    activeCanvas.renderAll();
    manualSync();
  };

  return (
    <div className="flex flex-col gap-3 mt-4">
      <Label className="text-lg font-bold">Edit Line</Label>
      <Separator />
      <Label>Line Color</Label>
      <Input
        type="color"
        value={color}
        onChange={handleColorChange}
        className="w-15 border rounded"
      />
      <Label>Line Weight</Label>
      <Input
        type="number"
        value={strokeWidth}
        min="1"
        onChange={handleStrokeWidthChange}
        className="w-20 border rounded"
      />
    </div>
  );
};

export default LineToolBar;
