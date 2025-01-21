import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // T-shirt customization
  selectedType: "crew-neck",
  tshirtColor: "#FFFFFF",
  frontObjects: [],
  selectedView: "front",
};

export const tshirtSlice = createSlice({
  name: "designer",
  initialState,
  reducers: {
    setSelectedType: (state, action) => {
      state.selectedType = action.payload;
    },
    setTshirtColor: (state, action) => {
      state.tshirtColor = action.payload;
    },
    setFrontObjects(state, action) {
      state.frontObjects = action.payload;
    },
    setSelectedView: (state, action) => {
      state.selectedView = action.payload;
    },
  },
});

export const {
  setSelectedType,
  setTshirtColor,
  setFrontObjects,
  setSelectedView,
} = tshirtSlice.actions;

export default tshirtSlice.reducer;
