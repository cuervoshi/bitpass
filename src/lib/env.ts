// Environment variable configuration
export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  encryptionKey: process.env.ENCRYPTION_KEY || "YOUR_SECRET_HERE",
  // Add other environment variables as needed
};
