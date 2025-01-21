import { createSlice } from "@reduxjs/toolkit";

const canvasSlice = createSlice({
  name: "canvas",
  initialState: {
    fabricCanvas: null, // Reference to the Fabric.js canvas
    selectedObject: null,
  },
  reducers: {
    setCanvas(state, action) {
      state.fabricCanvas = action.payload;
    },
    setSelectedObject(state, action) {
      state.selectedObject = action.payload;
    },
    clearSelectedObject(state) {
      state.selectedObject = null;
    },
  },
});

export const { setCanvas, setSelectedObject, clearSelectedObject } =
  canvasSlice.actions;
export default canvasSlice.reducer;
