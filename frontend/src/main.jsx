import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./app/App";
import { ThemeProvider } from "./theme";
import { AuthProvider } from "./auth";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/sonner";
import { Provider } from "react-redux";
import store from "./app/store";
import ErrorBoundary from "./components/shared/error-boundary";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ThemeProvider>
      <AuthProvider>
        <ErrorBoundary fullscreen>
          <TooltipProvider>
            <App />
          </TooltipProvider>
        </ErrorBoundary>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  </Provider>
);
