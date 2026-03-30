import { NextResponse } from "next/server";
import { saveUploadedFile } from "@/lib/local-db";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const subfolder = (formData.get("subfolder") as string) || "general";

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const results = [];

    for (const file of files) {
      // Validate file type
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");

      if (!isImage && !isVideo) {
        continue; // Skip unsupported types
      }

      // Validate size (50MB max)
      if (file.size > 50 * 1024 * 1024) {
        continue;
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const url = saveUploadedFile(buffer, file.name, subfolder);

      if (!url) {
        return NextResponse.json(
          { error: "File upload failed. The filesystem may be read-only (Vercel). Use an external storage service for production." },
          { status: 503 }
        );
      }

      results.push({
        id: `upload-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        type: isVideo ? "video" : "image",
        url,
        name: file.name,
      });
    }

    return NextResponse.json({ success: true, files: results });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
