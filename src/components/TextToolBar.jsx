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
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const TextToolBar = () => {
  const selectedObject = useSelector((state) => state.canvas.selectedObject);
  const canvas = useSelector((state) => state.canvas.fabricCanvas);

  const [text, setText] = useState("");
  const [color, setColor] = useState("#000000");
  const [font, setFont] = useState("arial");
  const [fontSize, setFontSize] = useState(20);

  useEffect(() => {
    if (selectedObject && selectedObject.type === "textbox") {
      console.log(selectedObject);
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
    if (!selectedObject || !canvas) return;
    const newColor = e.target.value;
    setColor(newColor);
    selectedObject.set("fill", newColor);
    canvas.renderAll();
  };

  const handleTextChange = (e) => {
    if (!selectedObject || !canvas) return;
    const newText = e.target.value;
    setText(newText);
    selectedObject.set("text", newText);
    canvas.renderAll();
  };

  const handleFontChange = (newFont) => {
    if (!selectedObject || !canvas) return;
    setFont(newFont);
    selectedObject.set("fontFamily", newFont);
    canvas.renderAll();
  };

  const handleFontSizeChange = (e) => {
    if (!selectedObject || !canvas) return;
    const newSize = parseInt(e.target.value, 10);
    if (isNaN(newSize) || newSize < 1) return; // Prevent invalid input
    setFontSize(newSize);
    selectedObject.set("fontSize", newSize);
    canvas.renderAll();
  };

  return (
    <div className="flex flex-col gap-3 mt-4">
      <Label className="text-lg font-bold">Edit Your Text</Label>
      <Separator />
      <Label>Your Text</Label>
      <Input type="text" value={text} onChange={handleTextChange} />
      <Label>Font Type</Label>
      <Select value={font} onValueChange={handleFontChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Font" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="arial">Arial</SelectItem>
            <SelectItem value="calibri">Calibri</SelectItem>
            <SelectItem value="times-new-romen">Times New Roman</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Label>Font Size</Label>
      <Input
        type="number"
        value={fontSize}
        min="1"
        onChange={handleFontSizeChange}
        className="w-20 border rounded"
      />
      <Label>Font Color</Label>
      <Input
        type="color"
        value={color}
        onChange={handleColorChange}
        className="w-15 border rounded"
      />
    </div>
  );
};

export default TextToolBar;
