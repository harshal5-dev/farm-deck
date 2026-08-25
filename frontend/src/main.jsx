import { createRoot } from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";

import "@/styles/index.css";
import App from "@/app/App";
import store from "@/app/store";
import { setCredentials } from "@/features/auth";

// TEMP DEV BYPASS (remove before shipping) — lets the UI be reviewed
// without the backend: open any /?dev_auth=1&role=owner URL.
if (import.meta.env.DEV) {
  const params = new URLSearchParams(window.location.search);
  if (params.get("dev_auth")) {
    const user = {
      id: "dev-owner",
      emailId: "dev@farmdeck.local",
      fullName: "Dev Reviewer",
      role: params.get("role") || "owner",
      status: "active",
      profilePicture: "farmer",
    };
    sessionStorage.setItem("dev_user", JSON.stringify(user));
  }
  if (sessionStorage.getItem("dev_user")) {
    store.dispatch(
      setCredentials(JSON.parse(sessionStorage.getItem("dev_user")))
    );
  }
}
import { ThemeProvider } from "@/theme";
import ErrorBoundary from "@/components/feedback/error-boundary";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

createRoot(document.getElementById("root")).render(
  <ReduxProvider store={store}>
    <ThemeProvider>
        <ErrorBoundary fullscreen>
          <TooltipProvider>
            <App />
          </TooltipProvider>
        </ErrorBoundary>
        <Toaster richColors />
    </ThemeProvider>
  </ReduxProvider>
);
