import { useRef, useState } from "react";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 10 * 1024 * 1024;

function ImageUploader({ file, previewUrl, onFileSelect, disabled }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState("");

  function validateAndSelect(nextFile) {
    if (!nextFile) return;
    if (!ACCEPTED_TYPES.includes(nextFile.type)) {
      setValidationError("Please choose a JPG, PNG, WEBP, or GIF image.");
      return;
    }
    if (nextFile.size > MAX_SIZE) {
      setValidationError("Please choose an image smaller than 10 MB.");
      return;
    }
    setValidationError("");
    onFileSelect(nextFile);
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    if (!disabled) validateAndSelect(event.dataTransfer.files[0]);
  }

  function handleKeyDown(event) {
    if ((event.key === "Enter" || event.key === " ") && !disabled) {
      event.preventDefault();
      inputRef.current?.click();
    }
  }

  return (
    <>
      <div
        className={`drop-zone ${isDragging ? "is-dragging" : ""} ${file ? "has-image" : ""}`}
        onDragEnter={(event) => {
          event.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setIsDragging(false);
        }}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={file ? "Choose a different clothing image" : "Upload a clothing image"}
      >
        <input
          ref={inputRef}
          className="file-input"
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          disabled={disabled}
          onChange={(event) => validateAndSelect(event.target.files[0])}
        />

        {file && previewUrl ? (
          <div
            className="image-preview"
            role="img"
            aria-label="Selected clothing preview"
            style={{ backgroundImage: `url("${previewUrl}")` }}
          >
            <div className="image-overlay">
              <span>Change image</span>
            </div>
            <div className="file-badge">{file.name}</div>
          </div>
        ) : (
          <div className="upload-prompt">
            <div className="upload-icon" aria-hidden="true">↥</div>
            <h3>Drop a clothing image here</h3>
            <p>or <span>browse your files</span></p>
            <small>JPG, PNG, WEBP or GIF · Max 10 MB</small>
          </div>
        )}
      </div>
      {validationError && <p className="file-error" role="alert">{validationError}</p>}
    </>
  );
}

export default ImageUploader;
