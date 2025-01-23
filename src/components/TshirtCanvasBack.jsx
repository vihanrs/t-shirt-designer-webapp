import { useEffect, useRef } from "react";
import * as fabric from "fabric";
import { CANVAS_CONFIG } from "../constants/designConstants";
import { useDispatch, useSelector } from "react-redux";
import { useCanvas } from "@/hooks/useCanvas";

const TshirtCanvasBack = ({ svgPath }) => {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null); // Store Fabric.js instance
  const { setBackCanvas, setSelectedObject, setActiveCanvas } = useCanvas();
  const tshirtColor = useSelector((state) => state.tshirt.tshirtColor);
  const selectedView = useSelector((state) => state.tshirt.selectedView);
  const dispatch = useDispatch();

  // Initialize Fabric.js canvas only once
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      ...CANVAS_CONFIG,
      preserveObjectStacking: true,
    });

    fabricCanvasRef.current = canvas; // Store instance in ref
    setBackCanvas(canvas);

    if (selectedView === "back") {
      dispatch(setActiveCanvas(canvas));
    }

    canvas.on("selection:created", (e) => {
      setSelectedObject(e.selected[0]);
    });

    canvas.on("selection:updated", (e) => {
      setSelectedObject(e.selected[0]);
    });

    canvas.on("selection:cleared", () => {
      setSelectedObject(null);
    });

    // Cleanup on unmount
    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
      if (selectedView === "back") {
        setActiveCanvas(null);
      }
      setSelectedObject(null);
    };
  }, [dispatch]); // Run once on mount

  // useEffect to handle view changes
  useEffect(() => {
    if (selectedView === "back" && fabricCanvasRef.current) {
      setActiveCanvas(fabricCanvasRef.current);
    }
  }, [selectedView, dispatch]);

  // Update clipPath whenever svgPath changes
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !svgPath) return;

    const clipPath = new fabric.Path(svgPath);
    const scale = CANVAS_CONFIG.height / 810;
    clipPath.set({
      scaleX: scale * 0.9,
      scaleY: scale * 0.9,
      left: 5,
      top: 64,
      originX: "left",
      originY: "top",
      absolutePositioned: true,
    });

    canvas.clipPath = clipPath;
    canvas.renderAll();
  }, [svgPath]); // Update only when svgPath changes

  return (
    <div className="relative w-full h-auto">
      <div className="absolute inset-0 pointer-events-none">
        <svg
          viewBox="0 0 810 810"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <path d={svgPath} fill={tshirtColor} stroke="#000" strokeWidth="1" />
        </svg>
      </div>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10"
        width={CANVAS_CONFIG.width}
        height={CANVAS_CONFIG.height}
      />
    </div>
  );
};

export default TshirtCanvasBack;
