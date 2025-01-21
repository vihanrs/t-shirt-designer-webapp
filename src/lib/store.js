import { configureStore } from "@reduxjs/toolkit";
import tshirtReducer from "../features/tshirtSlice";
import canvasReducer from "../features/canvasSlice";

export const store = configureStore({
  reducer: {
    tshirt: tshirtReducer,
    canvas: canvasReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these specific action types
        ignoredActions: ["canvas/setCanvas", "canvas/setSelectedObject"],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["payload.fabricCanvas", "payload.selectedObject"],
        // Ignore these paths in the state
        ignoredPaths: ["canvas.fabricCanvas", "canvas.selectedObject"],
      },
    }),
});

export default store;
