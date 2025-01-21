import { useEffect, useRef } from "react";
import * as fabric from "fabric";
import { CANVAS_CONFIG } from "../constants/designConstants";
import { useDispatch, useSelector } from "react-redux";
import {
  setCanvas,
  setSelectedObject,
  clearSelectedObject,
} from "../features/canvasSlice";

const TshirtCanvasBack = ({ svgPath }) => {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null); // Store Fabric.js instance
  const tshirtColor = useSelector((state) => state.tshirt.tshirtColor);
  const dispatch = useDispatch();

  // Initialize Fabric.js canvas only once
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      ...CANVAS_CONFIG,
      preserveObjectStacking: true,
    });

    fabricCanvasRef.current = canvas; // Store instance in ref
    dispatch(setCanvas(canvas));

    canvas.on("selection:created", (e) => {
      dispatch(setSelectedObject(e.selected[0]));
    });

    canvas.on("selection:updated", (e) => {
      dispatch(setSelectedObject(e.selected[0]));
    });

    canvas.on("selection:cleared", () => {
      dispatch(clearSelectedObject());
    });

    // Cleanup on unmount
    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
      dispatch(setCanvas(null));
      dispatch(clearSelectedObject());
    };
  }, [dispatch]); // Run once on mount

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
