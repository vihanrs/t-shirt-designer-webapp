import { configureStore } from "@reduxjs/toolkit";
import tshirtReducer from "../features/tshirtSlice";
// import canvasReducer from "../features/canvasSlice";

export const store = configureStore({
  reducer: {
    tshirt: tshirtReducer,
    // canvas: canvasReducer,
  },
});

export default store;
