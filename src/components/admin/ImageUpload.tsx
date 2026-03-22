'use client';

import React, { useRef, useState } from 'react';

interface Props {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}

export default function ImageUpload({ value, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [mode, setMode] = useState<'upload' | 'url'>(value ? 'url' : 'upload');
  const [fileName, setFileName] = useState('');

  const handlePickClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please choose a valid image file.');
      e.target.value = '';
      return;
    }

    const maxSizeMb = 5;
    if (file.size > maxSizeMb * 1024 * 1024) {
      alert(`Image is too large. Please choose a file smaller than ${maxSizeMb}MB.`);
      e.target.value = '';
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    setIsReading(true);

    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        onChange(result);
        setMode('upload');
      }
      setIsReading(false);
    };

    reader.onerror = () => {
      setIsReading(false);
      alert('Failed to read image file.');
    };

    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onChange('');
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isDataImage = value.startsWith('data:image/');
  const previewSrc = value;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`px-3 py-2 text-[10px] font-semibold tracking-[0.15em] uppercase rounded-sm border transition-all ${
            mode === 'upload'
              ? 'border-foreground/30 text-foreground bg-foreground/10'
              : 'border-foreground/10 text-foreground/40 hover:border-foreground/20 hover:text-foreground/70'
          }`}
        >
          Upload
        </button>

        <button
          type="button"
          onClick={() => setMode('url')}
          className={`px-3 py-2 text-[10px] font-semibold tracking-[0.15em] uppercase rounded-sm border transition-all ${
            mode === 'url'
              ? 'border-foreground/30 text-foreground bg-foreground/10'
              : 'border-foreground/10 text-foreground/40 hover:border-foreground/20 hover:text-foreground/70'
          }`}
        >
          Image URL
        </button>
      </div>

      {mode === 'upload' ? (
        <div className="border border-dashed border-foreground/15 rounded-sm p-4 bg-foreground/[0.02]">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <button
              type="button"
              onClick={handlePickClick}
              className="min-h-[48px] px-4 py-2.5 bg-foreground text-background text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:bg-accent transition-all"
            >
              {isReading ? 'Reading...' : 'Choose Image'}
            </button>

            {value && (
              <button
                type="button"
                onClick={handleRemove}
                className="min-h-[48px] px-4 py-2.5 border border-red-500/20 text-red-400/70 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:border-red-500/40 hover:text-red-400 transition-all"
              >
                Remove
              </button>
            )}
          </div>

          <p className="mt-3 text-[11px] text-foreground/30">
            Allowed: PNG, JPG, WEBP, GIF. Max 5MB.
          </p>

          {fileName && <p className="mt-1 text-[11px] text-foreground/45">Selected: {fileName}</p>}
        </div>
      ) : (
        <div className="space-y-2">
          <input
            type="url"
            value={isDataImage ? '' : value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full bg-foreground/5 border border-foreground/10 rounded-sm px-3 py-3 text-[13px] text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-foreground/30 transition-colors min-h-[48px]"
          />
          <p className="text-[10px] text-foreground/25">
            Paste an image URL if the image is already hosted online.
          </p>
        </div>
      )}

      {previewSrc && (
        <div className="relative w-full overflow-hidden rounded-sm border border-foreground/10 bg-foreground/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewSrc}
            alt="Preview"
            className="w-full h-56 object-cover"
            onError={() => {
              alert('Preview failed. Please choose a valid image.');
              handleRemove();
            }}
          />
        </div>
      )}
    </div>
  );
}
