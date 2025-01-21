import { useDispatch, useSelector } from "react-redux";
import * as fabric from "fabric";
import { Button } from "@/components/ui/button";
import { ImagePlus, Palette, Slash, Trash, Type } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CANVAS_CONFIG,
  DEFAULT_TEXT_CONFIG,
  TSHIRT_TYPES,
} from "../constants/designConstants";

import { setSelectedType, setTshirtColor } from "../features/tshirtSlice";
import { useRef } from "react";

const ToolBar = () => {
  // const { toast } = useToast();
  const dispatch = useDispatch();
  const selectedType = useSelector((state) => state.tshirt.selectedType);
  const canvas = useSelector((state) => state.canvas.fabricCanvas);
  const selectedObject = useSelector((state) => state.canvas.selectedObject);
  const fileInputRef = useRef(null); // use for handle image input

  const handleTypeChange = (value) => {
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
    if (!canvas || !e.target.files || !e.target.files[0]) return;

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
          left: (canvas.width - image.getScaledWidth()) / 2,
          top: (canvas.height - image.getScaledHeight()) / 2,
        });

        canvas.add(image);
        canvas.setActiveObject(image);
        canvas.renderAll();
      };
    };

    reader.readAsDataURL(file);
    // Reset input value to allow uploading the same image again
    e.target.value = "";
  };

  const handleAddText = () => {
    if (!canvas) return;

    const text = new fabric.Textbox("Add Your Text Here...", {
      ...DEFAULT_TEXT_CONFIG,
      left: canvas.width / 2 - 15,
      top: canvas.height / 2,
      width: 200,
      editable: false,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const handleAddLine = () => {
    if (!canvas) return;

    const line = new fabric.Line([100, 200, 250, 200], {
      stroke: "black",
      strokeWidth: 3,
      selectable: true,
      hasControls: true,
      strokeLineCap: "round",
    });

    canvas.add(line);
    canvas.setActiveObject(line);
    canvas.renderAll();
  };

  const handleDelete = () => {
    if (!canvas || !selectedObject) return;

    canvas.remove(selectedObject);
    canvas.discardActiveObject();
    canvas.renderAll();
  };

  return (
    <div className="flex flex-col gap-3">
      <Select value={selectedType} onValueChange={handleTypeChange}>
        <SelectTrigger className="w-[180px]">
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

        <span>Add Design</span>
      </Button>

      <Button onClick={handleAddText}>
        <Type />
        <span>Add Text</span>
      </Button>

      <Button onClick={handleAddLine}>
        <Slash />
        <span>Add Line</span>
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button>
            <Palette />
            <span>Tshirt Color</span>
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
            <div className="flex gap-3">
              {[
                "#FF0000",
                "#0000FF",
                "#00FF00",
                "#FFFF00",
                "#000000",
                "#808080",
                "#FFFFFF",
              ].map((color) => (
                <Button
                  key={color}
                  className="w-8 h-8 rounded-full p-0"
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
        <span>Delete</span>
      </Button>
    </div>
  );
};

export default ToolBar;
