import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { Toaster } from "react-hot-toast";
import rootReducer from "./reducer"; // Ensure this is correctly set up

// ✅ Configure store
const store = configureStore({
  reducer: rootReducer,
});

// ✅ Get root element
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found!");
}

// ✅ Create root and render App
ReactDOM.createRoot(rootElement).render(
  // <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster />
      </BrowserRouter>
    </Provider>
  // </React.StrictMode>
);
