import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { LoaderProvider } from "./hooks/useLoaderStore.jsx";
import { GlobalLoader } from "./components";
import { useLoader } from "./hooks/useLoaderStore.jsx";

// Global Loader Component that listens to loader state
const GlobalLoaderWrapper = () => {
  const { isLoading, message, variant } = useLoader();
  return (
    <GlobalLoader isLoading={isLoading} message={message} variant={variant} />
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LoaderProvider>
      <App />
      <GlobalLoaderWrapper />
    </LoaderProvider>
  </StrictMode>
);
