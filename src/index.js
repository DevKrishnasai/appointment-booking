import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Entry from "./Entry";
import ContextProvider from "./services/ContextProvider";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminPage from "./Pages/AdminPage";
import { Toaster } from "react-hot-toast";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Entry />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
        <Toaster position="top-center" />
      </Router>
    </ContextProvider>
  </React.StrictMode>
);
