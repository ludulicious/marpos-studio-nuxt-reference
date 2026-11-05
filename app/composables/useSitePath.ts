import { sitePath } from "~~/shared/utils/site-path";

export function useSitePath() {
  const config = useRuntimeConfig();
  return (path: string) => sitePath(path, config.app.baseURL);
}
