// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { store } from "./lib/store";
import { Provider } from "react-redux";
import { CanvasProvider } from "./hooks/useCanvas";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <Provider store={store}>
    <CanvasProvider>
      <App />
    </CanvasProvider>
  </Provider>
  // </StrictMode>
);
