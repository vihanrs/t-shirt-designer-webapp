import { CANVAS_CONFIG } from "@/constants/designConstants";
import { useTshirtCanvas } from "@/hooks/useTshirtCanvas";

const TshirtCanvasBack = ({ svgPath }) => {
  const { canvasRef, tshirtColor } = useTshirtCanvas({
    svgPath,
    view: "back",
  });

  return (
    <div className="relative w-full h-auto">
      <div className="absolute inset-0 pointer-events-none">
        <svg viewBox="0 0 810 810" className="w-full h-full">
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
