import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

import { FONT_OPTIONS } from "../constants/designConstants";
import { useCanvas } from "@/hooks/useCanvas";

const TextToolBar = ({ manualSync }) => {
  const { activeCanvas, selectedObject } = useCanvas();

  const [text, setText] = useState("");
  const [color, setColor] = useState("#000000");
  const [font, setFont] = useState("arial");
  const [fontSize, setFontSize] = useState(20);

  useEffect(() => {
    if (selectedObject && selectedObject.type === "textbox") {
      setText(selectedObject.text || "");
      setColor(selectedObject.fill || "#000000");
      setFont(selectedObject.fontFamily || "arial");
      setFontSize(selectedObject.fontSize || 20);
    }
  }, [selectedObject]);

  // Only show for text objects
  if (!selectedObject || selectedObject.type !== "textbox") {
    return null;
  }

  const handleColorChange = (e) => {
    if (!selectedObject || !activeCanvas) return;
    const newColor = e.target.value;
    setColor(newColor);
    selectedObject.set("fill", newColor);
    activeCanvas.renderAll();
    manualSync();
  };

  const handleTextChange = (e) => {
    if (!selectedObject || !activeCanvas) return;
    const newText = e.target.value;
    setText(newText);
    selectedObject.set("text", newText);
    activeCanvas.renderAll();
    manualSync();
  };

  const handleFontChange = (newFont) => {
    if (!selectedObject || !activeCanvas) return;
    setFont(newFont);
    selectedObject.set("fontFamily", newFont);
    activeCanvas.renderAll();
    manualSync();
  };

  const handleFontSizeChange = (e) => {
    if (!selectedObject || !activeCanvas) return;
    const newSize = parseInt(e.target.value, 10);
    if (isNaN(newSize) || newSize < 1) return; // Prevent invalid input
    setFontSize(newSize);
    selectedObject.set("fontSize", newSize);
    activeCanvas.renderAll();
    manualSync();
  };

  return (
    <div className="flex flex-col gap-3 mt-4">
      <Label className="text-lg font-bold ">Edit Text</Label>
      <Separator />
      <Label>Your Text</Label>
      <Input
        className="w-[110px]"
        type="text"
        value={text}
        onChange={handleTextChange}
      />
      <Label>Font Type</Label>
      <Select value={font} onValueChange={handleFontChange}>
        <SelectTrigger className="w-[110px]">
          <SelectValue placeholder="Select Font" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {FONT_OPTIONS.map((font) => (
              <SelectItem key={font.value} value={font.value}>
                {font.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className="flex gap-2 items-center">
        <Label className="w-10">Font Size</Label>
        <Input
          type="number"
          value={fontSize}
          min="1"
          onChange={handleFontSizeChange}
          className="w-[62px] border rounded"
        />
      </div>
      <div className="flex gap-2 items-center">
        <Label className="w-10">Font Color</Label>
        <Input
          type="color"
          value={color}
          onChange={handleColorChange}
          className="w-[62px] border rounded"
        />
      </div>
    </div>
  );
};

export default TextToolBar;
