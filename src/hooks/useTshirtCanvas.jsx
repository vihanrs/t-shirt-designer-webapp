import { useEffect, useRef } from "react";
import * as fabric from "fabric";
import { CANVAS_CONFIG } from "../constants/designConstants";
import { useDispatch, useSelector } from "react-redux";
import { useCanvas } from "@/hooks/useCanvas";
import canvasStorageManager from "@/utils/canvasStorageManager";

export const useTshirtCanvas = ({ svgPath, view }) => {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const tshirtColor = useSelector((state) => state.tshirt.tshirtColor);
  const selectedView = useSelector((state) => state.tshirt.selectedView);
  const dispatch = useDispatch();

  const { setActiveCanvas, setSelectedObject, setFrontCanvas, setBackCanvas } =
    useCanvas();

  // Function to save canvas objects
  const saveCanvas = () => {
    if (fabricCanvasRef.current) {
      canvasStorageManager.saveCanvasObjects(view, fabricCanvasRef.current);
    }
  };
  // Initialize Fabric.js Canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      ...CANVAS_CONFIG,
      preserveObjectStacking: true,
    });

    fabricCanvasRef.current = canvas;

    if (view === "front") setFrontCanvas(canvas);
    if (view === "back") setBackCanvas(canvas);

    if (selectedView === view) {
      setActiveCanvas(canvas);
    }

    // Save canvas data when the page is about to unload (refresh/close)
    window.addEventListener("beforeunload", saveCanvas);

    // Load saved objects
    const savedObjects = canvasStorageManager.loadCanvasObjects(view);
    if (savedObjects) {
      savedObjects.forEach((obj) => addFabricObject(canvas, obj));
      canvas.renderAll();
    }

    // Handle Object Selection
    canvas.on("selection:created", (e) => {
      setSelectedObject(e.selected[0]);
    });

    canvas.on("selection:updated", (e) => {
      setSelectedObject(e.selected[0]);
    });

    canvas.on("selection:cleared", () => {
      setSelectedObject(null);
    });

    // Cleanup
    return () => {
      saveCanvas();
      canvas.dispose();
      fabricCanvasRef.current = null;
      if (selectedView === view) {
        setActiveCanvas(null);
      }
      setSelectedObject(null);
    };
  }, [dispatch, view]); // Runs on mount

  // Switch Active Canvas When View Changes
  useEffect(() => {
    if (selectedView === view && fabricCanvasRef.current) {
      setActiveCanvas(fabricCanvasRef.current);
    }
  }, [selectedView, dispatch, view]);

  // Load SVG ClipPath & Saved Objects
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
  }, [svgPath]);

  return { canvasRef, fabricCanvasRef, tshirtColor };
};

// Helper function to add objects to canvas
const addFabricObject = (canvas, objectData) => {
  switch (objectData.type) {
    case "Line":
      canvas.add(
        new fabric.Line(
          [objectData.x1, objectData.y1, objectData.x2, objectData.y2],
          {
            left: objectData.left || 0,
            top: objectData.top || 0,
            stroke: objectData.stroke || "black",
            strokeWidth: objectData.strokeWidth || 2,
            strokeLineCap: objectData.strokeLineCap || "round",
            strokeLineJoin: objectData.strokeLineJoin || "miter",
            opacity: objectData.opacity || 1,
            angle: objectData.angle || 0,
            scaleX: objectData.scaleX || 1,
            scaleY: objectData.scaleY || 1,
          }
        )
      );
      break;
    case "Textbox":
      canvas.add(
        new fabric.Textbox(objectData.text, {
          left: objectData.left,
          top: objectData.top,
          width: objectData.width,
          fontSize: objectData.fontSize,
          fontFamily: objectData.fontFamily,
          textAlign: objectData.textAlign,
          fill: objectData.fill,
          scaleX: objectData.scaleX,
          scaleY: objectData.scaleY,
          angle: objectData.angle,
          opacity: objectData.opacity,
        })
      );
      break;
    case "Image":
      if (!objectData.src.startsWith("data:image")) return;
      const imgElement = new Image();
      imgElement.src = objectData.src;
      imgElement.onload = () => {
        const fabricImg = new fabric.Image(imgElement, {
          left: objectData.left || 0,
          top: objectData.top || 0,
          scaleX: objectData.scaleX || 1,
          scaleY: objectData.scaleY || 1,
          angle: objectData.angle || 0,
          opacity: objectData.opacity || 1,
        });
        canvas.add(fabricImg);
        canvas.renderAll();
      };
      break;
  }
};
