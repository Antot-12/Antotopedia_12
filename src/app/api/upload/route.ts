import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

function normalizeFolderName(s: string) {
  const v = s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  return v || "untitled";
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    const baseRaw = (form.get("postFolder") as string | null) ?? "";
    const kindRaw = (form.get("kind") as string | null) ?? "image";

    const base = normalizeFolderName(baseRaw || "untitled");
    const kind = kindRaw === "cover" ? "cover" : "images";
    const folder = `posts/${base}/${kind}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
          { folder, resource_type: "image" },
          (err, res) => {
            if (err || !res) return reject(err || new Error("Upload failed"));
            resolve({ secure_url: res.secure_url, public_id: res.public_id });
          }
      );
      stream.end(buffer);
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      folderBase: base,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Upload failed" }, { status: 500 });
  }
}
