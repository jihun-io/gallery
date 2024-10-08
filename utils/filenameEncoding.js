// utils/filenameEncoding.js
import crypto from "crypto";
import path from "path";

export function encodeFilename(filename) {
  const { name, ext } = path.parse(filename);
  const md5 = crypto.createHash("md5").update(name).digest("hex");
  return `${md5}${ext}`;
}

export function getOriginalExt(filename) {
  return path.extname(filename);
}
