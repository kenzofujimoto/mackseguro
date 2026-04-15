import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/react";
import App from "./App.tsx";
import AppErrorBoundary from "./components/system/AppErrorBoundary.tsx";
import { getClerkPublishableKey } from "./lib/clerkConfig.ts";
import "./index.css";

const clerkPublishableKey = getClerkPublishableKey();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={clerkPublishableKey}
      signInUrl="/auth/sign-in"
      signUpUrl="/auth/sign-up"
      signInFallbackRedirectUrl="/trilhas"
      signUpFallbackRedirectUrl="/trilhas"
      afterSignOutUrl="/"
    >
      <AppErrorBoundary>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppErrorBoundary>
    </ClerkProvider>
  </React.StrictMode>
);
