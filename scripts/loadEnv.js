import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function isLocalEnvironment() {
  try {
    // 프로젝트 루트 디렉토리 찾기
    let currentDir = __dirname;
    while (currentDir !== path.parse(currentDir).root) {
      const envLocalPath = path.join(currentDir, ".env.local");
      try {
        await fs.access(envLocalPath);
        console.log(".env.local found at:", envLocalPath);
        return true;
      } catch {
        currentDir = path.dirname(currentDir);
      }
    }
    return false;
  } catch (error) {
    console.error("Error checking for local environment:", error);
    return false;
  }
}

async function loadEnv() {
  console.log("Starting to load environment variables...");

  const isLocal = await isLocalEnvironment();

  if (isLocal) {
    console.log("Local environment detected");
    // 프로젝트 루트 디렉토리 찾기
    let currentDir = __dirname;
    while (currentDir !== path.parse(currentDir).root) {
      const envLocalPath = path.join(currentDir, ".env.local");
      try {
        await fs.access(envLocalPath);
        console.log("Loading environment variables from:", envLocalPath);
        const envConfig = await fs.readFile(envLocalPath, "utf8");
        const parsedEnv = dotenv.parse(envConfig);
        Object.assign(process.env, parsedEnv);
        console.log("Environment variables loaded successfully");
        break;
      } catch {
        currentDir = path.dirname(currentDir);
      }
    }
  } else {
    console.log("Production environment detected, using process.env");
  }

  return process.env;
}
const env = await loadEnv();

export default env;
