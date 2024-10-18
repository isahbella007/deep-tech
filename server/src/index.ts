import { logger } from "./utils/logger";
import { handleSignals } from "./utils/gracefulShutdown";
import { config } from "./config/index";
import app from "./app";

const startServer = async () => {
  try {
    const server = app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`)
    });
    handleSignals(server);
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();