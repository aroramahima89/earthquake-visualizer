import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // 👈 Expose the server to external hosts
    port: 5178, // 👈 Use the same port Vite picks
    strictPort: true, // 👈 Keep the same port (optional)
    allowedHosts: ["*"], // 👈 Let CodeSandbox proxy through
    cors: true, // 👈 Avoid CORS blocks in iframe
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
});
