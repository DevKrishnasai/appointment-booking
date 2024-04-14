import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Entry from "./Entry";
import ContextProvider from "./services/ContextProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ContextProvider>
      <Entry />
    </ContextProvider>
  </React.StrictMode>
);
