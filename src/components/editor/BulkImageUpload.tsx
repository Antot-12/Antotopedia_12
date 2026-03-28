"use client";

import { useState, useCallback } from "react";

type Props = {
  onUploadComplete: (urls: string[]) => void;
  onClose: () => void;
  postFolder: string;
};

export default function BulkImageUpload({ onUploadComplete, onClose, postFolder }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles).filter((f) => f.type.startsWith("image/"));
    setFiles((prev) => [...prev, ...fileArray]);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadAll = async () => {
    if (files.length === 0) return;

    setUploading(true);
    const urls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        setProgress((prev) => ({ ...prev, [file.name]: 0 }));

        const fd = new FormData();
        fd.append("file", file);
        fd.append("postFolder", postFolder);
        fd.append("kind", "image");

        const res = await fetch("/api/upload", {
          method: "POST",
          body: fd,
        });

        if (!res.ok) throw new Error("Upload failed");

        const data = await res.json();
        urls.push(data.url);

        setProgress((prev) => ({ ...prev, [file.name]: 100 }));
      } catch (err) {
        console.error("Upload error:", err);
        setProgress((prev) => ({ ...prev, [file.name]: -1 }));
      }
    }

    setUploading(false);
    onUploadComplete(urls);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center pt-10 overflow-y-auto">
      <div className="card bg-black/95 border-white/20 p-6 w-full max-w-3xl m-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Bulk Image Upload</h3>
            <p className="text-xs text-white/60">Upload multiple images at once</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white transition text-xl"
            disabled={uploading}
          >
            ✕
          </button>
        </div>

        {/* Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition ${
            dragActive
              ? "border-accent bg-accent/10"
              : "border-white/20 hover:border-accent/50"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={() => setDragActive(true)}
          onDragLeave={() => setDragActive(false)}
        >
          <div className="text-4xl mb-3">📸</div>
          <div className="text-white/80 mb-2">
            Drag & drop images here, or click to browse
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
            className="hidden"
            id="bulk-upload-input"
            disabled={uploading}
          />
          <label
            htmlFor="bulk-upload-input"
            className="btn btn-soft inline-block cursor-pointer"
          >
            Choose Images
          </label>
          <div className="text-xs text-white/50 mt-2">
            Supports JPG, PNG, GIF, WebP
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-white/80">
                {files.length} image{files.length !== 1 ? "s" : ""} selected
              </div>
              {!uploading && (
                <button
                  onClick={() => setFiles([])}
                  className="text-xs text-white/50 hover:text-white transition"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  {/* Thumbnail */}
                  <div className="w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-white/10">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white/90 truncate">{file.name}</div>
                    <div className="text-xs text-white/50">{formatFileSize(file.size)}</div>

                    {/* Progress */}
                    {progress[file.name] !== undefined && (
                      <div className="mt-1">
                        {progress[file.name] === -1 ? (
                          <div className="text-xs text-red-400">Upload failed</div>
                        ) : progress[file.name] === 100 ? (
                          <div className="text-xs text-green-400">✓ Uploaded</div>
                        ) : (
                          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-accent transition-all"
                              style={{ width: `${progress[file.name]}%` }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Remove */}
                  {!uploading && (
                    <button
                      onClick={() => removeFile(index)}
                      className="text-white/50 hover:text-red-400 transition"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={uploadAll}
            disabled={files.length === 0 || uploading}
            className="btn btn-primary flex-1"
          >
            {uploading ? "Uploading..." : `Upload ${files.length} Image${files.length !== 1 ? "s" : ""}`}
          </button>
          <button
            onClick={onClose}
            disabled={uploading}
            className="btn btn-soft"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
