import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ✅ Configure global defaults for ALL queries
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,   // No refetch on tab switch
      refetchOnMount: false,          // No refetch on component remount
      refetchOnReconnect: false,      // No refetch on network reconnect
      staleTime: 5 * 60 * 1000,      // 5 minutes default cache
      retry: 1,                       // Retry failed requests once
    },
  },
});
console.log("ALL ENV:", import.meta.env);
createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
