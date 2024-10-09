import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";
import fetch from "node-fetch";
import { fileURLToPath } from "url";
import { encodeFilename } from "../utils/filenameEncoding.js";
import env from "./loadEnv.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.join(__dirname, "..", "public", "photos");
const originalDir = path.join(outputDir, "originals");
const OUTPUT_JSON = path.join(process.cwd(), "public", "photoName.json");

const sizes = [320, 640, 1024, 1920];
const formats = ["webp", "jpg"];

const WORKER_URL = env.CDN_URL;

// 파일명 매핑을 저장할 객체
let fileNameMapping = [];

async function getFileList() {
  const response = await fetch(`${WORKER_URL}/list-files`);
  if (!response.ok) {
    throw new Error(`Failed to fetch file list: ${response.statusText}`);
  }
  return await response.json();
}

async function downloadImage(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.statusText}`);
  }
  return await response.arrayBuffer();
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function saveOriginalImage(imageBuffer, fileName) {
  const encodedFileName = encodeFilename(fileName);
  const outputPath = path.join(originalDir, encodedFileName);
  if (await fileExists(outputPath)) {
    console.log(`Original already exists: ${fileName}`);
    return false;
  }
  await fs.writeFile(outputPath, Buffer.from(imageBuffer));
  console.log(`Saved original: ${fileName}`);

  // 파일명 매핑 추가
  fileNameMapping.push({
    title: path.parse(fileName).name,
    filename: encodedFileName,
  });

  return true;
}

async function optimizeImage(imageBuffer, fileName) {
  const image = sharp(Buffer.from(imageBuffer));
  const metadata = await image.metadata();

  let optimized = false;
  const encodedFileName = encodeFilename(fileName);

  for (const size of sizes) {
    if (size > metadata.width) continue;

    for (const format of formats) {
      const outputFileName = `${
        path.parse(encodedFileName).name
      }-${size}.${format}`;
      const outputPath = path.join(outputDir, outputFileName);

      if (await fileExists(outputPath)) {
        console.log(`Optimized version already exists: ${outputFileName}`);
        continue;
      }

      await image
        .resize(size)
        .toFormat(format, { quality: 80 })
        .toFile(outputPath);

      console.log(`Optimized: ${outputFileName}`);
      optimized = true;
    }
  }

  return optimized;
}

async function processFiles(files) {
  for (const file of files) {
    if (!/\.(jpg|jpeg|png|webp)$/i.test(file.name)) continue;

    console.log(`Processing: ${file.name}`);

    const originalPath = path.join(originalDir, encodeFilename(file.name));
    let imageBuffer;

    if (await fileExists(originalPath)) {
      console.log(`Using existing original: ${file.name}`);
      imageBuffer = await fs.readFile(originalPath);
      // 기존 파일에 대한 매핑 추가
      fileNameMapping.push({
        title: file.name,
        filename: encodeFilename(file.name),
      });
    } else {
      console.log(`Downloading: ${file.name}`);
      imageBuffer = await downloadImage(`${WORKER_URL}${file.url}`);
      await saveOriginalImage(imageBuffer, file.name);
    }

    const optimized = await optimizeImage(imageBuffer, file.name);

    if (!optimized) {
      console.log(`All optimized versions already exist for: ${file.name}`);
    }
  }
}

async function saveFileNameMapping() {
  await fs.writeFile(OUTPUT_JSON, JSON.stringify(fileNameMapping, null, 2));
  console.log(`File name mapping saved to ${OUTPUT_JSON}`);
}

async function main() {
  try {
    await fs.mkdir(outputDir, { recursive: true });
    await fs.mkdir(originalDir, { recursive: true });

    console.log("Fetching file list from Cloudflare Worker...");
    const files = await getFileList();
    console.log(`Found ${files.length} files.`);

    await processFiles(files);
    await saveFileNameMapping();
    console.log("Image optimization completed successfully!");
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();
