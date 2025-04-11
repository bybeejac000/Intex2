import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    headers: {
      "Content-Security-Policy": [
        "default-src 'self';",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval';",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
        "font-src 'self' https://fonts.gstatic.com data:;",
        "img-src 'self' data: https://api.cineniche.click;",
        "connect-src 'self' https://api.cineniche.click https://cineniche.click;",
        "frame-ancestors 'none';",
        "object-src 'none';",
        "base-uri 'self';",
        "form-action 'self';",
      ].join(" "),
    },
  },
});
