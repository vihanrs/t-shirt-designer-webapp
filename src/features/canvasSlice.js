import { createSlice } from "@reduxjs/toolkit";

const canvasSlice = createSlice({
  name: "canvass",
  initialState: {
    frontCanvas: null,
    backCanvas: null,
    selectedObject: null,
    activeCanvas: null, // Reference to currently active canvas
  },
  reducers: {
    setFrontCanvas(state, action) {
      state.frontCanvas = action.payload;
      if (state.activeCanvas === null) {
        state.activeCanvas = action.payload; // Set as active by default
      }
    },
    setBackCanvas(state, action) {
      state.backCanvas = action.payload;
    },
    setActiveCanvas(state, action) {
      state.activeCanvas = action.payload;
    },
    setSelectedObject(state, action) {
      state.selectedObject = action.payload;
    },
    clearSelectedObject(state) {
      state.selectedObject = null;
    },
  },
});

export const {
  setFrontCanvas,
  setBackCanvas,
  setActiveCanvas,
  setSelectedObject,
  clearSelectedObject,
} = canvasSlice.actions;
export default canvasSlice.reducer;
