import pkg from "exifreader";
import { promises as fs } from "fs";
import { join, basename, extname } from "path";
const { load } = pkg;
import sharp from "sharp";

const PHOTOS_DIR = join(process.cwd(), "public", "photos", "originals");
const OUTPUT_FILE = join(process.cwd(), "public", "exif-data.json");
const FILENAME_MAPPING_FILE = join(process.cwd(), "public", "photoName.json");

async function getImageDimensions(filePath) {
  try {
    const metadata = await sharp(filePath).metadata();
    return {
      width: metadata.width,
      height: metadata.height,
    };
  } catch (error) {
    console.error(`Error getting image dimensions for ${filePath}:`, error);
    return { width: null, height: null };
  }
}

async function loadFileNameMapping() {
  try {
    const data = await fs.readFile(FILENAME_MAPPING_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading filename mapping:", error);
    return [];
  }
}

async function getExifData(filePath, fileNameMapping) {
  try {
    const data = await fs.readFile(filePath);
    const tags = await load(data);
    const dimensions = await getImageDimensions(filePath);
    const fileName = basename(filePath);

    // Find the corresponding title from the mapping
    const mappingEntry = fileNameMapping.find(
      (entry) => entry.filename === fileName
    );

    const sizes = mappingEntry.sizes;
    const title = mappingEntry ? mappingEntry.title : fileName;

    return {
      src: fileName,
      fileName: fileName.replace(/\.[^/.]+$/, ""),
      title: title
        .replace(/\.[^/.]+$/, "")
        .replace(/--/g, ": ")
        .replace(/-/g, " "),
      sizes: sizes,
      make: tags.Make?.description,
      model: tags.Model?.description,
      dateTime: tags.DateTime?.description,
      iso: tags.ISOSpeedRatings?.description,
      focalLength: tags.FocalLengthIn35mmFilm?.description,
      ev: tags.ExposureBiasValue?.description,
      fNumber: tags.FNumber?.description,
      exposureTime: tags.ExposureTime?.description,
      width: dimensions.width,
      height: dimensions.height,
    };
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return null;
  }
}

async function processPhotos() {
  try {
    const fileNameMapping = await loadFileNameMapping();
    const files = await fs.readdir(PHOTOS_DIR);
    const exifDataPromises = files
      .filter((file) =>
        [".jpg", ".jpeg", ".png", ".gif"].includes(extname(file).toLowerCase())
      )
      .map((file) => getExifData(join(PHOTOS_DIR, file), fileNameMapping));

    const exifDataList = await Promise.all(exifDataPromises);
    const validExifData = exifDataList.filter((data) => data !== null);

    await fs.writeFile(OUTPUT_FILE, JSON.stringify(validExifData, null, 2));
    console.log(`EXIF data saved to ${OUTPUT_FILE}`);
  } catch (error) {
    console.error("Error processing photos:", error);
  }
}

processPhotos();
