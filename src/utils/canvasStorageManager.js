const STORAGE_KEYS = {
  FRONT_CANVAS: "tshirt-designer-front",
  BACK_CANVAS: "tshirt-designer-back",
};

const canvasStorageManager = {
  // Save canvas objects
  saveCanvasObjects: (view, canvas) => {
    if (!canvas) return;
    try {
      const storageKey =
        view === "front" ? STORAGE_KEYS.FRONT_CANVAS : STORAGE_KEYS.BACK_CANVAS;

      // Clear existing design for this view before saving
      localStorage.removeItem(storageKey);
      // Get and save new objects
      const objects = canvas.getObjects().map((obj) => obj.toJSON());
      localStorage.setItem(
        view === "front" ? STORAGE_KEYS.FRONT_CANVAS : STORAGE_KEYS.BACK_CANVAS,
        JSON.stringify(objects)
      );
    } catch (error) {
      console.error("Error saving canvas objects:", error);
    }
  },

  // Load canvas objects
  loadCanvasObjects: (view) => {
    try {
      const stored = localStorage.getItem(
        view === "front" ? STORAGE_KEYS.FRONT_CANVAS : STORAGE_KEYS.BACK_CANVAS
      );

      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("Error loading canvas objects:", error);
      return null;
    }
  },

  // Clear stored objects for a specific view
  clearCanvasStorage: (view) => {
    if (view === "all") {
      localStorage.clear();
    } else {
      localStorage.removeItem(
        view === "front" ? STORAGE_KEYS.FRONT_CANVAS : STORAGE_KEYS.BACK_CANVAS
      );
    }
  },

  // Setup canvas event listeners for auto-saving
  // setupCanvasAutoSave: (canvas, view) => {
  //   if (!canvas) return;

  //   const events = [
  //     "object:modified",
  //     "object:added",
  //     "object:removed",
  //     "path:created",
  //   ];

  //   events.forEach((eventType) => {
  //     canvas.on(eventType, () => {
  //       canvasStorageManager.saveCanvasObjects(view, canvas);
  //     });
  //   });
  // },
};

export default canvasStorageManager;
