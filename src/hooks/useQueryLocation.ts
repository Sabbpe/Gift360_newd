import { useLocation } from "wouter";
import { useEffect, useState } from "react";

export function useQueryLocation() {
  const [location] = useLocation();
  const [query, setQuery] = useState(window.location.search);

  useEffect(() => {
    const handleUrlChange = () => {
      setQuery(window.location.search);
    };

    window.addEventListener("popstate", handleUrlChange);
    window.addEventListener("pushstate", handleUrlChange);
    window.addEventListener("replacestate", handleUrlChange);

    return () => {
      window.removeEventListener("popstate", handleUrlChange);
      window.removeEventListener("pushstate", handleUrlChange);
      window.removeEventListener("replacestate", handleUrlChange);
    };
  }, []);

  return { path: location, query };
}
