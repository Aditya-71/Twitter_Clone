import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { ToastContainer } from "react-toastify";
import { SocketContextProvider } from "../context/socketContext";

const Root = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <RecoilRoot>
        <BrowserRouter>
          <SocketContextProvider>
            <App />
          </SocketContextProvider>
          <ToastContainer />
        </BrowserRouter>
      </RecoilRoot>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
