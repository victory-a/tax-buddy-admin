"use client";

import * as React from "react";
import { Upload, FileText } from "lucide-react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/text-input";

export interface FileInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: string;
  helperText?: string;
  errorText?: string;
  /** Optional callback fired with the chosen FileList. */
  onFilesChange?: (files: File[]) => void;
  /** Reject files larger than this size (bytes). */
  maxFileSizeBytes?: number;
  containerClassName?: string;
  /** Variant: full-width drop area or compact picker button. */
  variant?: "drop" | "compact";
}

const fileExtensionLabel = (name: string) => {
  const extension = name.includes(".") ? name.split(".").pop()?.trim() : "";
  return extension ? extension.toUpperCase() : null;
};

const formatBytes = (bytes: number) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.min(
    sizes.length - 1,
    Math.floor(Math.log(bytes) / Math.log(k)),
  );
  return `${(bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
};

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  (
    {
      id,
      label,
      helperText,
      errorText,
      className,
      containerClassName,
      multiple,
      accept,
      disabled,
      required,
      onFilesChange,
      onChange,
      maxFileSizeBytes,
      variant = "drop",
      ...props
    },
    forwardedRef,
  ) => {
    const reactId = React.useId();
    const inputId = id ?? reactId;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    const innerRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(
      forwardedRef,
      () => innerRef.current as HTMLInputElement,
    );

    const [files, setFiles] = React.useState<File[]>([]);
    const [isDragging, setIsDragging] = React.useState(false);
    const [sizeError, setSizeError] = React.useState<string | null>(null);

    const displayError = errorText ?? sizeError ?? undefined;
    const hasError = Boolean(displayError);

    const applyFiles = React.useCallback(
      (next: File[]): boolean => {
        const selected = multiple ? next : next.slice(0, 1);

        if (maxFileSizeBytes !== undefined) {
          const oversized = selected.find((file) => file.size > maxFileSizeBytes);
          if (oversized) {
            setSizeError(`File must be ${formatBytes(maxFileSizeBytes)} or smaller.`);
            return false;
          }
        }

        setSizeError(null);
        setFiles(selected);
        onFilesChange?.(selected);
        return true;
      },
      [maxFileSizeBytes, multiple, onFilesChange],
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const list = e.target.files ? Array.from(e.target.files) : [];
      applyFiles(list);
      onChange?.(e);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (disabled) return;
      const dropped = Array.from(e.dataTransfer.files ?? []);
      if (dropped.length === 0) return;
      if (!applyFiles(dropped)) return;

      const selected = multiple ? dropped : dropped.slice(0, 1);
      if (innerRef.current && typeof DataTransfer !== "undefined") {
        const dt = new DataTransfer();
        selected.forEach((f) => dt.items.add(f));
        innerRef.current.files = dt.files;
      }
    };

    const openPicker = () => innerRef.current?.click();

    return (
      <div className={cn("flex flex-col gap-1.5 w-full", containerClassName)}>
        {label ? (
          <Label htmlFor={inputId} required={required}>
            {label}
          </Label>
        ) : null}

        {variant === "drop" ? (
          <div
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-disabled={disabled || undefined}
            data-invalid={hasError || undefined}
            aria-describedby={
              hasError ? errorId : helperText ? helperId : undefined
            }
            onClick={openPicker}
            onKeyDown={(e) => {
              if (disabled) return;
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openPicker();
              }
            }}
            onDragOver={(e) => {
              e.preventDefault();
              if (!disabled) setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={cn(
              "flex w-full rounded-lg border border-dashed bg-surface-container-lowest",
              "border-outline-variant transition-colors cursor-pointer",
              "hover:border-on-tertiary-container hover:bg-surface-container-low",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-tertiary-container/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              files.length === 0
                ? "flex-col items-center justify-center gap-2 px-6 py-8 text-center"
                : "items-center px-4 py-4",
              isDragging &&
                "border-on-tertiary-container bg-surface-container-low",
              hasError && "border-error",
              disabled && "opacity-60 cursor-not-allowed",
              className,
            )}
          >
            {files.length === 0 ? (
              <>
                <span className="flex size-10 items-center justify-center rounded-full bg-surface-container text-on-surface-variant">
                  <Upload className="size-5" />
                </span>
                <div className="flex flex-col gap-0.5">
                  <p className="text-body-md text-on-surface">
                    <span className="font-semibold text-on-tertiary-container">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  {accept ? (
                    <p className="text-body-sm text-on-surface-variant">
                      {accept.split(",").join(", ")}
                    </p>
                  ) : null}
                </div>
              </>
            ) : (
              <div className="flex w-full min-w-0 flex-col gap-2">
                {files.map((file, idx) => {
                  const extension = fileExtensionLabel(file.name);

                  return (
                    <div
                      key={`${file.name}-${idx}`}
                      className="flex w-full min-w-0 items-center gap-3"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-container text-on-surface-variant">
                        <FileText className="size-5" />
                      </span>
                      <div className="min-w-0 flex-1 text-left">
                        <p className="truncate text-body-md font-medium text-on-surface">
                          {file.name}
                        </p>
                        <p className="text-body-sm text-on-surface-variant">
                          {formatBytes(file.size)}
                          {extension ? ` · ${extension}` : null}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <input
              ref={innerRef}
              id={inputId}
              type="file"
              multiple={multiple}
              accept={accept}
              disabled={disabled}
              required={required}
              onChange={handleChange}
              className="sr-only"
              {...props}
            />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openPicker}
              disabled={disabled}
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded border border-outline-variant cursor-pointer",
                "bg-surface-container-lowest px-4 text-body-md text-on-surface",
                "hover:bg-surface-container-low active:bg-surface-container",
                "disabled:opacity-60 disabled:cursor-not-allowed",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-tertiary-container/30",
                hasError && "border-error",
              )}
            >
              <Upload className="size-4" />
              Choose file{multiple ? "s" : ""}
            </button>
            <span className="text-body-sm text-on-surface-variant truncate">
              {files.length > 0
                ? files.length === 1
                  ? files[0].name
                  : `${files.length} files selected`
                : "No file selected"}
            </span>
            <input
              ref={innerRef}
              id={inputId}
              type="file"
              multiple={multiple}
              accept={accept}
              disabled={disabled}
              required={required}
              onChange={handleChange}
              className="sr-only"
              {...props}
            />
          </div>
        )}

        {hasError ? (
          <p id={errorId} className="text-body-sm text-error">
            {displayError}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-body-sm text-on-surface-variant">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  },
);
FileInput.displayName = "FileInput";

export { FileInput };
