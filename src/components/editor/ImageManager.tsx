"use client";

import { useState, useRef, DragEvent } from "react";
import imageCompression from "browser-image-compression";

type UploadedImage = {
    url: string;
    publicId: string;
    name: string;
    size: number;
    altText: string;
};

type Props = {
    postSlug?: string;
    onInsert: (image: UploadedImage) => void;
    onGalleryUpdate?: (images: UploadedImage[]) => void;
};

export default function ImageManager({ postSlug, onInsert, onGalleryUpdate }: Props) {
    const [images, setImages] = useState<UploadedImage[]>([]);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [progress, setProgress] = useState(0);
    const [editingAlt, setEditingAlt] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFiles = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        setUploading(true);
        setProgress(0);

        try {
            const fileArray = Array.from(files);
            const totalFiles = fileArray.length;

            for (let i = 0; i < fileArray.length; i++) {
                const file = fileArray[i];

                // Optimize image
                const optimized = await imageCompression(file, {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                });

                // Upload to server
                const formData = new FormData();
                formData.append("file", optimized);
                if (postSlug) {
                    formData.append("slug", postSlug);
                }

                const response = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) throw new Error("Upload failed");

                const data = await response.json();

                const newImage: UploadedImage = {
                    url: data.url,
                    publicId: data.publicId,
                    name: file.name,
                    size: optimized.size,
                    altText: file.name.replace(/\.[^/.]+$/, ""),
                };

                setImages((prev) => {
                    const updated = [...prev, newImage];
                    onGalleryUpdate?.(updated);
                    return updated;
                });

                setProgress(((i + 1) / totalFiles) * 100);
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload images. Please try again.");
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    const updateAltText = (index: number, altText: string) => {
        setImages((prev) => {
            const updated = [...prev];
            updated[index].altText = altText;
            onGalleryUpdate?.(updated);
            return updated;
        });
    };

    const removeImage = (index: number) => {
        setImages((prev) => {
            const updated = prev.filter((_, i) => i !== index);
            onGalleryUpdate?.(updated);
            return updated;
        });
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className="card p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">🖼️ Image Manager</h3>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="btn btn-primary text-sm"
                >
                    📤 Upload Images
                </button>
            </div>

            {/* Drag & Drop Zone */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition ${dragActive
                        ? "border-accent bg-accent/10"
                        : "border-white/20 hover:border-accent/50"
                    } ${uploading ? "opacity-50 pointer-events-none" : ""}`}
            >
                <div className="text-4xl mb-3">🎨</div>
                <p className="text-white/70 mb-2">
                    Drag & drop images here or click to browse
                </p>
                <p className="text-xs text-white/50">
                    Supports: JPG, PNG, GIF, WebP • Max 10MB • Auto-optimized to 1920px
                </p>
            </div>

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFiles(e.target.files)}
                className="hidden"
            />

            {/* Upload Progress */}
            {uploading && (
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-white/70">Uploading...</span>
                        <span className="text-accent">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-accent to-cyan-400 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Image Gallery */}
            {images.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-white/80">
                        Uploaded Images ({images.length})
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {images.map((image, idx) => (
                            <div
                                key={idx}
                                className="group relative card p-2 hover:ring-2 hover:ring-accent transition"
                            >
                                {/* Image Preview */}
                                <div className="aspect-video rounded overflow-hidden bg-black/30 mb-2">
                                    <img
                                        src={image.url}
                                        alt={image.altText}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Image Info */}
                                <div className="space-y-1">
                                    <div className="text-xs text-white/60 truncate">
                                        {image.name}
                                    </div>
                                    <div className="text-xs text-white/40">
                                        {formatSize(image.size)}
                                    </div>

                                    {/* Alt Text Editor */}
                                    {editingAlt === idx ? (
                                        <input
                                            type="text"
                                            value={image.altText}
                                            onChange={(e) => updateAltText(idx, e.target.value)}
                                            onBlur={() => setEditingAlt(null)}
                                            placeholder="Alt text..."
                                            className="input text-xs w-full"
                                            autoFocus
                                        />
                                    ) : (
                                        <button
                                            onClick={() => setEditingAlt(idx)}
                                            className="text-xs text-accent hover:underline"
                                        >
                                            {image.altText ? `Alt: ${image.altText}` : "Add alt text"}
                                        </button>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                                    <button
                                        onClick={() => onInsert(image)}
                                        className="btn-ghost bg-black/70 p-1.5 rounded"
                                        title="Insert into post"
                                    >
                                        ✓
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(image.url);
                                            alert("URL copied!");
                                        }}
                                        className="btn-ghost bg-black/70 p-1.5 rounded"
                                        title="Copy URL"
                                    >
                                        📋
                                    </button>
                                    <button
                                        onClick={() => removeImage(idx)}
                                        className="btn-ghost bg-red-500/70 p-1.5 rounded text-white"
                                        title="Remove"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tips */}
            <div className="text-xs text-white/60 space-y-1">
                <p>💡 <strong>Tip:</strong> Click ✓ on any image to insert it into your post</p>
                <p>💡 <strong>Accessibility:</strong> Always add alt text to describe your images</p>
                <p>💡 <strong>Optimization:</strong> Images are automatically compressed for faster loading</p>
            </div>
        </div>
    );
}
