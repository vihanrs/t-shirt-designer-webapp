import { STORAGE_KEYS } from "./canvasStorageManager";
import * as fabric from "fabric";
// canvasSyncManager.js
export const canvasSyncManager = {
  getCanvasTexture: (fabricCanvas) => {
    if (!fabricCanvas) return null;
    try {
      // Force a render before getting the texture
      fabricCanvas.renderAll();

      // Use the upper canvas which contains the actual visible content
      const dataURL = fabricCanvas.toDataURL({
        format: "png",
        quality: 1,
        multiplier: 1,
        enableRetinaScaling: true,
      });

      return dataURL;
    } catch (error) {
      console.error("Error generating texture:", error);
      return null;
    }
  },

  // getCanvasTextureFromStorage: (storageKey) => {
  //   try {
  //     const storedData = localStorage.getItem(storageKey);
  //     return storedData ? `data:image/png;base64,${storedData}` : null;
  //   } catch (error) {
  //     console.error("Error retrieving canvas texture from storage:", error);
  //     return null;
  //   }
  // },

  getCanvasTextureFromStorage: (view) => {
    return new Promise((resolve, reject) => {
      try {
        const storageKey =
          view === "front"
            ? STORAGE_KEYS.FRONT_CANVAS
            : STORAGE_KEYS.BACK_CANVAS;

        const storedObjects = localStorage.getItem(storageKey);
        if (!storedObjects) {
          resolve(null);
          return;
        }

        // Parse the stored JSON objects
        const parsedObjects = JSON.parse(storedObjects);

        // Create a temporary canvas
        const tempCanvas = new fabric.Canvas(null, {
          width: 600, // Set appropriate width
          height: 600, // Set appropriate height
        });

        // Use fabric.util.enlivenObjects to recreate canvas objects
        fabric.util.enlivenObjects(
          parsedObjects,
          (objects) => {
            // Add recreated objects to the canvas
            objects.forEach((obj) => {
              tempCanvas.add(obj);
            });

            // Generate texture
            const dataURL = tempCanvas.toDataURL({
              format: "png",
              quality: 1,
              multiplier: 1,
              enableRetinaScaling: true,
            });

            resolve(dataURL);
          },
          (error) => {
            console.error("Error enlivening objects:", error);
            resolve(null);
          }
        );
      } catch (error) {
        console.error("Error retrieving canvas texture from storage:", error);
        reject(error);
      }
    });
  },

  // utility function
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
};
