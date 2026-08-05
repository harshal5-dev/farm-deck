import { createRoot } from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";

import "@/styles/index.css";
import App from "@/app/App";
import store from "@/app/store";
import { ThemeProvider } from "@/theme";
import { AuthProvider } from "@/features/auth";
import ErrorBoundary from "@/components/feedback/error-boundary";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

createRoot(document.getElementById("root")).render(
  <ReduxProvider store={store}>
    <ThemeProvider>
      <AuthProvider>
        <ErrorBoundary fullscreen>
          <TooltipProvider>
            <App />
          </TooltipProvider>
        </ErrorBoundary>
        <Toaster richColors />
      </AuthProvider>
    </ThemeProvider>
  </ReduxProvider>
);
