"use client";

import { useState, useRef, useCallback } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import imageCompression from "browser-image-compression";
import "react-image-crop/dist/ReactCrop.css";

type Props = {
  onUploadComplete: (url: string) => void;
  onClose: () => void;
  postFolder: string;
};

type ImageFile = {
  file: File;
  preview: string;
  edited?: string;
};

export default function MediaManager({ onUploadComplete, onClose, postFolder }: Props) {
  const [files, setFiles] = useState<ImageFile[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const [activeTab, setActiveTab] = useState<"upload" | "edit" | "video" | "audio">("upload");

  const handleFiles = async (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles).filter(
      (f) => f.type.startsWith("image/") || f.type.startsWith("video/") || f.type.startsWith("audio/")
    );

    const imageFiles: ImageFile[] = [];
    for (const file of fileArray) {
      if (file.type.startsWith("image/")) {
        // Compress image
        try {
          const compressed = await imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          });
          imageFiles.push({
            file: compressed,
            preview: URL.createObjectURL(compressed),
          });
        } catch (error) {
          imageFiles.push({
            file,
            preview: URL.createObjectURL(file),
          });
        }
      } else {
        imageFiles.push({
          file,
          preview: URL.createObjectURL(file),
        });
      }
    }
    setFiles((prev) => [...prev, ...imageFiles]);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const applyFilters = () => {
    if (selectedIndex === null || !imgRef.current) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imgRef.current;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Apply filters
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`;
    ctx.drawImage(img, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        const edited = URL.createObjectURL(blob);
        setFiles((prev) =>
          prev.map((f, i) => (i === selectedIndex ? { ...f, edited } : f))
        );
      }
    });
  };

  const applyCrop = () => {
    if (selectedIndex === null || !imgRef.current || !crop) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

    canvas.width = crop.width! * scaleX;
    canvas.height = crop.height! * scaleY;

    ctx.drawImage(
      imgRef.current,
      crop.x! * scaleX,
      crop.y! * scaleY,
      crop.width! * scaleX,
      crop.height! * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], files[selectedIndex].file.name, {
          type: "image/png",
        });
        const edited = URL.createObjectURL(blob);
        setFiles((prev) =>
          prev.map((f, i) =>
            i === selectedIndex ? { ...f, file, edited } : f
          )
        );
        setCrop(undefined);
      }
    });
  };

  const uploadFiles = async () => {
    setUploading(true);
    const urls: string[] = [];

    for (const fileData of files) {
      try {
        const fd = new FormData();
        fd.append("file", fileData.file);
        fd.append("postFolder", postFolder);
        fd.append("kind", fileData.file.type.startsWith("image/") ? "image" : "media");

        const res = await fetch("/api/upload", {
          method: "POST",
          body: fd,
        });

        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        urls.push(data.url);
      } catch (err) {
        console.error("Upload error:", err);
      }
    }

    setUploading(false);
    if (urls.length > 0) {
      // Create gallery if multiple images
      if (urls.length > 1 && files.every((f) => f.file.type.startsWith("image/"))) {
        const gallery = `\n\n<div class="image-gallery">\n${urls
          .map((url) => `  <img src="${url}" alt="Gallery image" />`)
          .join("\n")}\n</div>\n\n`;
        onUploadComplete(gallery);
      } else {
        onUploadComplete(urls.join("\n"));
      }
    }
    onClose();
  };

  const selectedFile = selectedIndex !== null ? files[selectedIndex] : null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center pt-10 overflow-y-auto">
      <div className="card bg-black/95 border-white/20 p-6 w-full max-w-5xl m-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Media Manager</h3>
            <p className="text-xs text-white/60">Upload, edit, and manage your media</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white transition text-xl"
            disabled={uploading}
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 border-b border-white/10">
          <button
            onClick={() => setActiveTab("upload")}
            className={`px-4 py-2 text-sm transition ${
              activeTab === "upload"
                ? "border-b-2 border-accent text-accent"
                : "text-white/70 hover:text-white"
            }`}
          >
            📤 Upload
          </button>
          <button
            onClick={() => setActiveTab("edit")}
            className={`px-4 py-2 text-sm transition ${
              activeTab === "edit"
                ? "border-b-2 border-accent text-accent"
                : "text-white/70 hover:text-white"
            }`}
            disabled={files.length === 0}
          >
            ✂️ Edit
          </button>
          <button
            onClick={() => setActiveTab("video")}
            className={`px-4 py-2 text-sm transition ${
              activeTab === "video"
                ? "border-b-2 border-accent text-accent"
                : "text-white/70 hover:text-white"
            }`}
          >
            🎥 Video
          </button>
          <button
            onClick={() => setActiveTab("audio")}
            className={`px-4 py-2 text-sm transition ${
              activeTab === "audio"
                ? "border-b-2 border-accent text-accent"
                : "text-white/70 hover:text-white"
            }`}
          >
            🎵 Audio
          </button>
        </div>

        {/* Upload Tab */}
        {activeTab === "upload" && (
          <div className="space-y-4">
            <div
              className="border-2 border-dashed rounded-xl p-8 text-center transition hover:border-accent/50"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className="text-4xl mb-3">📁</div>
              <div className="text-white/80 mb-2">Drag & drop files here</div>
              <input
                type="file"
                accept="image/*,video/*,audio/*"
                multiple
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
                className="hidden"
                id="media-upload"
              />
              <label htmlFor="media-upload" className="btn btn-primary inline-block cursor-pointer">
                Choose Files
              </label>
              <div className="text-xs text-white/50 mt-2">
                Images (auto-compressed), Videos, Audio
              </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="relative rounded-lg overflow-hidden border border-white/10 hover:border-accent cursor-pointer"
                    onClick={() => {
                      setSelectedIndex(index);
                      setActiveTab("edit");
                    }}
                  >
                    {file.file.type.startsWith("image/") ? (
                      <img
                        src={file.edited || file.preview}
                        alt="Upload"
                        className="w-full h-32 object-cover"
                      />
                    ) : file.file.type.startsWith("video/") ? (
                      <div className="w-full h-32 flex items-center justify-center bg-white/5">
                        <span className="text-4xl">🎥</span>
                      </div>
                    ) : (
                      <div className="w-full h-32 flex items-center justify-center bg-white/5">
                        <span className="text-4xl">🎵</span>
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFiles((prev) => prev.filter((_, i) => i !== index));
                      }}
                      className="absolute top-2 right-2 w-6 h-6 bg-black/80 rounded-full text-white/70 hover:text-red-400"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Edit Tab */}
        {activeTab === "edit" && selectedFile && (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="bg-black/40 rounded-xl p-4 min-h-[400px] flex items-center justify-center">
                {crop ? (
                  <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
                    <img
                      ref={imgRef}
                      src={selectedFile.edited || selectedFile.preview}
                      alt="Edit"
                      className="max-w-full max-h-[400px]"
                    />
                  </ReactCrop>
                ) : (
                  <img
                    ref={imgRef}
                    src={selectedFile.edited || selectedFile.preview}
                    alt="Edit"
                    className="max-w-full max-h-[400px]"
                    style={{
                      filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`,
                    }}
                  />
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-white/70 mb-2 block">Brightness</label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-white/60 text-right">{brightness}%</div>
              </div>

              <div>
                <label className="text-sm text-white/70 mb-2 block">Contrast</label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-white/60 text-right">{contrast}%</div>
              </div>

              <div>
                <label className="text-sm text-white/70 mb-2 block">Saturation</label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={saturation}
                  onChange={(e) => setSaturation(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-white/60 text-right">{saturation}%</div>
              </div>

              <div>
                <label className="text-sm text-white/70 mb-2 block">Blur</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={blur}
                  onChange={(e) => setBlur(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-white/60 text-right">{blur}px</div>
              </div>

              <div className="flex gap-2">
                <button onClick={applyFilters} className="btn btn-primary flex-1">
                  Apply Filters
                </button>
                <button
                  onClick={() => setCrop({ unit: "%", width: 50, height: 50, x: 25, y: 25 })}
                  className="btn btn-soft flex-1"
                >
                  Crop
                </button>
              </div>

              {crop && (
                <button onClick={applyCrop} className="btn btn-accent w-full">
                  ✓ Apply Crop
                </button>
              )}

              <button
                onClick={() => {
                  setBrightness(100);
                  setContrast(100);
                  setSaturation(100);
                  setBlur(0);
                  setCrop(undefined);
                  if (selectedIndex !== null) {
                    setFiles((prev) =>
                      prev.map((f, i) => (i === selectedIndex ? { ...f, edited: undefined } : f))
                    );
                  }
                }}
                className="btn btn-soft w-full"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Video Tab */}
        {activeTab === "video" && (
          <div className="space-y-4">
            <div className="text-sm text-white/70">
              Supported formats: MP4, WebM, OGG
            </div>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              className="input w-full"
            />
            <div className="text-xs text-white/50">
              Videos will be uploaded and can be embedded using HTML5 video tags
            </div>
          </div>
        )}

        {/* Audio Tab */}
        {activeTab === "audio" && (
          <div className="space-y-4">
            <div className="text-sm text-white/70">
              Supported formats: MP3, WAV, OGG
            </div>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              className="input w-full"
            />
            <div className="text-xs text-white/50">
              Audio files will be uploaded and can be embedded using HTML5 audio tags
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 mt-6 pt-6 border-t border-white/10">
          <button
            onClick={uploadFiles}
            disabled={files.length === 0 || uploading}
            className="btn btn-primary flex-1"
          >
            {uploading ? "Uploading..." : `Upload ${files.length} File${files.length !== 1 ? "s" : ""}`}
          </button>
          <button onClick={onClose} disabled={uploading} className="btn btn-soft">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
