import { useLocation } from "react-router-dom";

export const useQueryParam = (key: string): string | null => {
  const { search } = useLocation();
  return new URLSearchParams(search).get(key);
};
