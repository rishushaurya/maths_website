import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

// Ensure data directory exists
function ensureDir(dir: string) {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch {
    // On read-only filesystems (e.g. Vercel), this will fail silently
  }
}

// Read a JSON data file, return default if not exists
export function readData<T>(filename: string, defaultValue: T): T {
  ensureDir(DATA_DIR);
  const filePath = path.join(DATA_DIR, filename);
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(raw) as T;
    }
  } catch {
    // If file is corrupted, return default
  }
  return defaultValue;
}

// Write data to a JSON file
// Returns true on success, false on failure (e.g. read-only filesystem on Vercel)
export function writeData<T>(filename: string, data: T): boolean {
  ensureDir(DATA_DIR);
  const filePath = path.join(DATA_DIR, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error(`[local-db] Write failed for ${filename}:`, err instanceof Error ? err.message : err);
    return false;
  }
}

// Save an uploaded file to public/uploads and return the public URL
// Returns null if the filesystem is read-only
export function saveUploadedFile(
  fileBuffer: Buffer,
  originalName: string,
  subfolder: string = "general"
): string | null {
  const uploadsDir = path.join(process.cwd(), "public", "uploads", subfolder);
  
  try {
    ensureDir(uploadsDir);

    // Generate unique filename
    const ext = path.extname(originalName);
    const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9-_]/g, "_");
    const uniqueName = `${baseName}-${Date.now()}${ext}`;
    const filePath = path.join(uploadsDir, uniqueName);

    fs.writeFileSync(filePath, fileBuffer);

    return `/uploads/${subfolder}/${uniqueName}`;
  } catch (err) {
    console.error("[local-db] File upload failed:", err instanceof Error ? err.message : err);
    return null;
  }
}

// Delete an uploaded file
export function deleteUploadedFile(publicUrl: string): boolean {
  try {
    const filePath = path.join(process.cwd(), "public", publicUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
  } catch {
    // Ignore errors (read-only FS, file missing, etc.)
  }
  return false;
}
