import React, { useState, useRef, useCallback } from 'react';
import { Upload, Image } from 'lucide-react';
import { mediaService } from '../../services/mediaService';
import ImageThumbnail from './ImageThumbnail';

interface MediaUploaderProps {
    imageUrls: string[];
    onImagesChange: (urls: string[]) => void;
    maxFiles?: number;
}

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
const MAX_SIZE = 2 * 1024 * 1024; // 2MB

interface UploadingFile {
    id: string;
    name: string;
    error?: string;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({ imageUrls, onImagesChange, maxFiles = 10 }) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploading, setUploading] = useState<UploadingFile[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFiles = useCallback(async (files: FileList | File[]) => {
        const fileArr = Array.from(files);
        const remaining = maxFiles - imageUrls.length;
        if (remaining <= 0) return;

        const toUpload = fileArr.slice(0, remaining);
        const tempIds: UploadingFile[] = toUpload.map((f, i) => ({
            id: `upload-${Date.now()}-${i}`,
            name: f.name,
        }));

        setUploading(prev => [...prev, ...tempIds]);

        for (let i = 0; i < toUpload.length; i++) {
            const file = toUpload[i];
            const tempId = tempIds[i].id;

            if (!ALLOWED_TYPES.includes(file.type)) {
                setUploading(prev => prev.map(u => u.id === tempId ? { ...u, error: 'Invalid type' } : u));
                continue;
            }

            if (file.size > MAX_SIZE) {
                setUploading(prev => prev.map(u => u.id === tempId ? { ...u, error: 'Too large (max 2MB)' } : u));
                continue;
            }

            try {
                const result = await mediaService.uploadFile(file);
                onImagesChange([...imageUrls, result.url]);
                setUploading(prev => prev.filter(u => u.id !== tempId));
            } catch (err: any) {
                setUploading(prev => prev.map(u => u.id === tempId ? { ...u, error: err.message || 'Upload failed' } : u));
            }
        }
    }, [imageUrls, maxFiles, onImagesChange]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    }, [handleFiles]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setIsDragOver(false);
    }, []);

    const removeImage = (index: number) => {
        onImagesChange(imageUrls.filter((_, i) => i !== index));
    };

    const removeUploadError = (id: string) => {
        setUploading(prev => prev.filter(u => u.id !== id));
    };

    return (
        <div className="space-y-4">
            {/* Drop zone */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`
                    flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all
                    ${isDragOver
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-slate-700 bg-slate-800/30 hover:border-slate-600 hover:bg-slate-800/50'
                    }
                `}
            >
                <Upload size={32} className={isDragOver ? 'text-blue-400' : 'text-slate-600'} />
                <p className="text-sm text-slate-400 mt-3">
                    {isDragOver ? 'Drop files here' : 'Drag and drop images here, or click to browse'}
                </p>
                <p className="text-xs text-slate-600 mt-1">PNG, JPG, SVG — max 2MB each</p>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                    multiple
                    onChange={e => { if (e.target.files) handleFiles(e.target.files); e.target.value = ''; }}
                    className="hidden"
                />
            </div>

            {/* Thumbnails */}
            {(imageUrls.length > 0 || uploading.length > 0) && (
                <div className="flex flex-wrap gap-3">
                    {imageUrls.map((url, i) => (
                        <ImageThumbnail
                            key={url + i}
                            url={url}
                            onRemove={() => removeImage(i)}
                        />
                    ))}
                    {uploading.map(u => (
                        <ImageThumbnail
                            key={u.id}
                            url=""
                            isLoading={!u.error}
                            error={u.error}
                            onRemove={() => removeUploadError(u.id)}
                        />
                    ))}
                </div>
            )}

            {imageUrls.length >= maxFiles && (
                <p className="text-xs text-amber-400">Maximum {maxFiles} images reached</p>
            )}
        </div>
    );
};

export default MediaUploader;
