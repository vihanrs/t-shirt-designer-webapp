import { useDispatch, useSelector } from "react-redux";
import * as fabric from "fabric";
import { Button } from "@/components/ui/button";
import { Box, ImagePlus, Palette, Slash, Trash, Type } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CANVAS_CONFIG,
  DEFAULT_TEXT_CONFIG,
  TSHIRT_TYPES,
  TSHIRT_COLOR_CODES,
} from "../constants/designConstants";

import { setSelectedType, setTshirtColor } from "../features/tshirtSlice";
import { useRef } from "react";
import SaveDesign from "./SaveDesign";
import { useCanvas } from "@/hooks/useCanvas";
import { FrontT } from "./FrontT";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import canvasStorageManager from "@/utils/canvasStorageManager";

const ToolBar = ({ manualSync }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null); // use for handle image input
  const selectedType = useSelector((state) => state.tshirt.selectedType);
  const { activeCanvas, selectedObject } = useCanvas();

  const handleTypeChange = (value) => {
    console.log("Selected Tshirt " + value);
    dispatch(setSelectedType(value));
  };

  const handleColorChange = (color) => {
    dispatch(setTshirtColor(color));
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAddImage = (e) => {
    if (!activeCanvas || !e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const imgObj = new Image();
      imgObj.src = event.target.result;

      imgObj.onload = () => {
        const image = new fabric.Image(imgObj);

        // Calculate scaling to fit within canvas
        const maxWidth = CANVAS_CONFIG.width * 0.5;
        const maxHeight = CANVAS_CONFIG.height * 0.5;

        if (image.width > maxWidth || image.height > maxHeight) {
          const scale = Math.min(
            maxWidth / image.width,
            maxHeight / image.height
          );
          image.scale(scale);
        }

        // Center the image
        image.set({
          left: (activeCanvas.width - image.getScaledWidth()) / 2,
          top: (activeCanvas.height - image.getScaledHeight()) / 2,
        });

        activeCanvas.add(image);
        activeCanvas.setActiveObject(image);
        activeCanvas.renderAll();
      };
    };

    reader.readAsDataURL(file);
    // Reset input value to allow uploading the same image again
    e.target.value = "";
  };

  const handleAddText = () => {
    if (!activeCanvas) return;

    const text = new fabric.Textbox("Add Your Text Here...", {
      ...DEFAULT_TEXT_CONFIG,
      left: activeCanvas.width / 2,
      top: activeCanvas.height / 2,
      width: 200,
      editable: false,
    });

    activeCanvas.add(text);
    activeCanvas.setActiveObject(text);
    activeCanvas.renderAll();
  };

  const handleAddLine = () => {
    if (!activeCanvas) return;

    const line = new fabric.Line([100, 200, 250, 200], {
      stroke: "black",
      strokeWidth: 3,
      selectable: true,
      hasControls: true,
      strokeLineCap: "round",
    });

    activeCanvas.add(line);
    activeCanvas.setActiveObject(line);
    activeCanvas.renderAll();
  };

  const handleDelete = () => {
    if (!activeCanvas || !selectedObject) return;

    activeCanvas.remove(selectedObject);
    activeCanvas.discardActiveObject();
    activeCanvas.renderAll();
    manualSync();
  };

  // Add a clear all function if needed
  const handleClearAll = () => {
    if (!activeCanvas) return;

    // Clear all objects from canvas
    activeCanvas.clear();

    // Clear storage for current view
    canvasStorageManager.clearCanvasStorage("all");

    // Re-initialize canvas with basic settings if needed
    activeCanvas.renderAll();
    manualSync();
  };

  return (
    <div className="flex flex-col gap-3 w-[110px]">
      <Select value={selectedType} onValueChange={handleTypeChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select T-Shirt" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {Object.entries(TSHIRT_TYPES).map(([value, { name }]) => (
              <SelectItem key={value} value={value}>
                {name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleAddImage}
        className="hidden"
      />
      <Button onClick={triggerFileInput}>
        <ImagePlus />

        <span>Design</span>
      </Button>

      <Button onClick={handleAddText}>
        <Type />
        <span>Text</span>
      </Button>

      <Button onClick={handleAddLine}>
        <Slash />
        <span>Line</span>
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button>
            <Palette />
            <span>Color</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="ml-5 w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Select Color</h4>
              <p className="text-sm text-muted-foreground">
                Select the base color of your t-shirt
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {TSHIRT_COLOR_CODES.map((color) => (
                <Button
                  key={color}
                  className="w-8 h-8 rounded-full p-0 border-2 border-gray-200 shadow hover:shadow-lg"
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange(color)}
                />
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <Button onClick={handleDelete} variant="destructive">
        <Trash />
        <span>Remove</span>
      </Button>
      <Button onClick={handleClearAll} variant="destructive">
        <Trash />
        <span>Clear All</span>
      </Button>
      {/* <SaveDesign /> */}
    </div>
  );
};

export default ToolBar;
