interface Window {
  modules: Record<string, string>;
  build?: string;
  webpack: Record<string, [[string, Record<string, any>]]>;
}
