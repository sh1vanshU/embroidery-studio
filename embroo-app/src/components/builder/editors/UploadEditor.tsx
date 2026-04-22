'use client';

import { useState, useRef, useCallback } from 'react';
import { useBuilderStore } from '@/stores/builderStore';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

export function UploadEditor() {
  const { activeZone, setZoneDesign } = useBuilderStore();
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File too large. Maximum size: 5MB (yours: ${(file.size / 1024 / 1024).toFixed(1)}MB)`;
    }
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return `Invalid extension. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`;
    }
    return null;
  }, []);

  const processFile = useCallback((file: File) => {
    setError(null);
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
    };
    reader.onerror = () => setError('Failed to read file. Please try again.');
    reader.readAsDataURL(file);
  }, [validateFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    // Reset input so same file can be re-selected
    e.target.value = '';
  }, [processFile]);

  const applyUpload = () => {
    if (activeZone && preview) {
      setZoneDesign(activeZone, {
        type: 'upload',
        uploadedFileUrl: preview,
        stitchType: 'embroidery',
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-[16px] p-10 text-center cursor-pointer transition-all bg-surface ${
          dragOver ? 'border-gold bg-gold/10' : 'border-[var(--border-strong)] hover:border-gold hover:bg-[var(--gold-muted)]'
        }`}
        role="button"
        tabIndex={0}
        aria-label="Upload design file"
        onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
      >
        <span className="text-[2.5rem] block mb-3">&#128228;</span>
        <div className="text-[0.85rem] text-text-secondary mb-2">
          Drag & drop your design here
        </div>
        <div className="text-[0.85rem] text-text-secondary mb-3">or</div>
        <button
          onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
          className="bg-gold text-charcoal-deep py-2.5 px-6 rounded-[8px] text-[0.8rem] font-semibold transition-all hover:bg-gold-light"
        >
          Browse Files
        </button>
        <div className="text-[0.7rem] text-text-muted mt-3">
          JPG, PNG &mdash; Max 5MB
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png"
          onChange={handleFileSelect}
          className="hidden"
          aria-hidden="true"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-[8px] text-[0.8rem] text-red-400 flex items-center gap-2">
          &#9888; {error}
        </div>
      )}

      {/* Warning */}
      <div className="p-3 bg-gold/[0.08] border border-[var(--border)] rounded-[8px] text-[0.75rem] text-gold flex items-center gap-2">
        &#9888; Complex designs may need simplification for embroidery
      </div>

      {/* Preview */}
      {preview && (
        <div className="text-center mt-4">
          <img
            src={preview}
            alt="Upload preview"
            className="max-w-[200px] mx-auto rounded-[8px] border border-[var(--border)]"
          />
          <button
            onClick={applyUpload}
            className="mt-3 bg-gold text-charcoal-deep py-2 px-5 rounded-[8px] text-[0.8rem] font-semibold transition-all hover:bg-gold-light"
          >
            Apply to Zone
          </button>
        </div>
      )}
    </div>
  );
}
