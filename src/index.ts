import createApp from "./app.js";
import { config } from "./lib/env.js";
import { logger } from "@/lib/utils.js";

const log = logger.extend("app:index");
const error = logger.extend("app:index:error");

const startServer = async (): Promise<void> => {
  try {
    const app = await createApp();
    const PORT = config.port;

    app.listen(PORT, () => {
      log(`Server started successfully in ${config.nodeEnv} mode`);
      log(`Server time: ${new Date().toISOString()}`);
    });
  } catch (err) {
    error("Failed to start server: %O", err);
    process.exit(1);
  }
};

startServer();
