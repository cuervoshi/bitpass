import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getVersion = (): string => {
  try {
    // Try to read from package.json
    const packagePath = join(__dirname, "..", "..", "package.json");
    const packageJson = JSON.parse(readFileSync(packagePath, "utf8"));
    return packageJson.version;
  } catch (error) {
    return "1.0.0"; // Default version if package.json can't be read
  }
};
