import createApp from "./app.js";
import { config } from "./lib/env.js";

const startServer = async (): Promise<void> => {
  try {
    const app = await createApp();
    const PORT = config.port;

    app.listen(PORT, () => {
      console.log(`🚀 Server started successfully in ${config.nodeEnv} mode`);
      console.log(`⏱️ Server time: ${new Date().toISOString()}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();
