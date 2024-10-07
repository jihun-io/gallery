const fs = require("fs").promises;
const path = require("path");
const ExifReader = require("exifreader");
const sharp = require("sharp");

const PHOTOS_DIR = path.join(process.cwd(), "public", "photos");
const OUTPUT_FILE = path.join(process.cwd(), "public", "exif-data.json");

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

async function getExifData(filePath) {
  try {
    const data = await fs.readFile(filePath);
    const tags = await ExifReader.load(data);
    const dimensions = await getImageDimensions(filePath);
    const fileName = path.basename(filePath);
    const extensions = [".jpg", ".jpeg", ".png", ".gif"];
    return {
      fileName: fileName,
      title: fileName
        .replace(new RegExp(extensions.join("|"), "i"), "")
        .replace(/-/g, " "),
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
    const files = await fs.readdir(PHOTOS_DIR);
    const exifDataPromises = files
      .filter((file) =>
        [".jpg", ".jpeg", ".png", ".gif"].includes(
          path.extname(file).toLowerCase()
        )
      )
      .map((file) => getExifData(path.join(PHOTOS_DIR, file)));

    const exifDataList = await Promise.all(exifDataPromises);
    const validExifData = exifDataList.filter((data) => data !== null);

    await fs.writeFile(OUTPUT_FILE, JSON.stringify(validExifData, null, 2));
    console.log(`EXIF data saved to ${OUTPUT_FILE}`);
  } catch (error) {
    console.error("Error processing photos:", error);
  }
}

processPhotos();
