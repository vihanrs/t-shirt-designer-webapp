import { canvasSyncManager } from "@/utils/canvasSyncManager";
import { useCallback, useEffect, useState } from "react";

export const useCanvasTextureSync = (options = {}) => {
  const { frontCanvas, backCanvas, selectedView = "front" } = options;

  const [designTextureFront, setDesignTextureFront] = useState(null);
  const [designTextureBack, setDesignTextureBack] = useState(null);

  useEffect(() => {
    const canvasMap = {
      front: { canvas: frontCanvas, setter: setDesignTextureFront },
      back: { canvas: backCanvas, setter: setDesignTextureBack },
    };

    const criticalEvents = [
      "object:modified",
      "object:added",
      "object:removed",
    ];

    const updateTexture = async (view) => {
      const { canvas, setter } = canvasMap[view];
      if (!canvas) return;

      try {
        const hasActiveObjects = canvas.getObjects().length > 0;
        if (!hasActiveObjects) return;

        const texture = await (selectedView === view
          ? canvasSyncManager.getCanvasTexture(canvas)
          : await canvasSyncManager.getCanvasTextureFromStorage(view));

        setter((prevTexture) =>
          prevTexture !== texture ? texture : prevTexture
        );
      } catch (error) {
        console.error(`${view} canvas texture update failed:`, error);
      }
    };

    const debouncedUpdateFront = canvasSyncManager.debounce(
      () => updateTexture("front"),
      100
    );
    const debouncedUpdateBack = canvasSyncManager.debounce(
      () => updateTexture("back"),
      100
    );

    // Setup events for front canvas
    if (frontCanvas) {
      criticalEvents.forEach((event) => {
        frontCanvas.on(event, debouncedUpdateFront);
      });
    }

    // Setup events for back canvas
    if (backCanvas) {
      criticalEvents.forEach((event) => {
        backCanvas.on(event, debouncedUpdateBack);
      });
    }

    // Initial updates
    updateTexture("front");
    updateTexture("back");

    // Cleanup
    return () => {
      if (frontCanvas) {
        criticalEvents.forEach((event) => {
          frontCanvas.off(event, debouncedUpdateFront);
        });
      }
      if (backCanvas) {
        criticalEvents.forEach((event) => {
          backCanvas.off(event, debouncedUpdateBack);
        });
      }
    };
  }, [frontCanvas, backCanvas, selectedView]);

  const manualTriggerSync = useCallback(
    async (view = "front") => {
      const canvasMap = {
        front: { canvas: frontCanvas, setter: setDesignTextureFront },
        back: { canvas: backCanvas, setter: setDesignTextureBack },
      };

      const { canvas, setter } = canvasMap[view];

      if (!canvas) {
        console.warn(
          `manualTriggerSync failed: No canvas available for ${view}`
        );
        return;
      }

      try {
        const texture = await canvasSyncManager.getCanvasTexture(canvas);

        if (!texture) {
          console.warn(`No texture received for ${view}`);
          return;
        }

        setter(texture);
      } catch (error) {
        console.error(`Manual ${view} canvas texture update failed:`, error);
      }
    },
    [frontCanvas, backCanvas] // Ensure it updates when canvases are available
  );

  return {
    designTextureFront,
    designTextureBack,
    manualTriggerSync,
  };
};
