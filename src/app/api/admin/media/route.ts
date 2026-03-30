import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

export async function GET() {
  try {
    if (!fs.existsSync(UPLOADS_DIR)) {
      return NextResponse.json({ files: [] });
    }

    const allFiles: { name: string; url: string; folder: string; type: string; size: number; createdAt: number }[] = [];

    const scanDir = (dir: string, subfolder: string) => {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          scanDir(fullPath, path.join(subfolder, item));
        } else {
          allFiles.push({
            name: item,
            url: `/uploads/${subfolder ? subfolder.replace(/\\/g, "/") + "/" : ""}${item}`,
            folder: subfolder || "root",
            type: item.match(/\.(mp4|webm|ogg)$/i) ? "video" : "image",
            size: stat.size,
            createdAt: stat.birthtimeMs || stat.mtimeMs,
          });
        }
      }
    };

    scanDir(UPLOADS_DIR, "");
    
    // Sort by newest first
    allFiles.sort((a, b) => b.createdAt - a.createdAt);

    return NextResponse.json({ files: allFiles });
  } catch {
    return NextResponse.json({ files: [] });
  }
}

export async function DELETE(request: Request) {
  try {
    const { url } = await request.json();
    if (!url || !url.startsWith("/uploads/")) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "public", url);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        return NextResponse.json({ success: true });
      } catch {
        return NextResponse.json({ error: "Delete failed — read-only filesystem. Run locally to manage media." }, { status: 503 });
      }
    } else {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
  } catch {
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}
