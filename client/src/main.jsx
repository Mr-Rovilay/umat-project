import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "@/components/ui/sonner";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { TooltipProvider } from "./components/ui/tooltip";
import { BrowserRouter } from "react-router-dom";
import Store from "./redux/store";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={Store}>
      <TooltipProvider>
        <BrowserRouter>
          <Toaster position="top-right" expand={true} richColors />
          <App />
        </BrowserRouter>
      </TooltipProvider>
    </Provider>
  </StrictMode>
);
