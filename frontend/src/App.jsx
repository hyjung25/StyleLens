import { useEffect, useState } from "react";
import ImageUploader from "./components/ImageUploader.jsx";
import ResultCard from "./components/ResultCard.jsx";

const API_URL = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://127.0.0.1:8000" : "https://stylelens-ssqa.onrender.com")
).replace(/\/$/, "");

function App() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  function selectFile(nextFile) {
    setFile(nextFile);
    setResult(null);
    setError("");
  }

  async function analyzeImage() {
    if (!file) return;
    if (!API_URL) {
      setError("Image analysis is not available yet. Please try again later.");
      return;
    }

    setIsLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.detail || "We couldn't analyze that image.");
      }

      setResult(data);
    } catch (requestError) {
      const message =
        requestError instanceof TypeError
          ? "We couldn't reach the analysis server. Please try again shortly."
          : requestError.message;
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  function reset() {
    setFile(null);
    setResult(null);
    setError("");
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href={import.meta.env.BASE_URL} aria-label="StyleLens home">
          <span className="brand-mark" aria-hidden="true">S</span>
          <span>StyleLens</span>
        </a>
        <span className="header-note">AI wardrobe analysis</span>
      </header>

      <main>
        <section className="hero">
          <p className="eyebrow"><span /> Your outfit, decoded</p>
          <h1>See the style in<br /><em>every detail.</em></h1>
          <p className="hero-copy">
            Upload one clear clothing photo and get a thoughtful breakdown of
            its color, pattern, style, and ideal season.
          </p>
        </section>

        <section className={`workspace ${result ? "has-result" : ""}`} aria-label="Clothing analyzer">
          <div className="upload-panel">
            <div className="panel-heading">
              <span>01</span>
              <div>
                <h2>Add your image</h2>
                <p>One item works best</p>
              </div>
            </div>

            <ImageUploader
              file={file}
              previewUrl={previewUrl}
              onFileSelect={selectFile}
              disabled={isLoading}
            />

            {error && <div className="error-message" role="alert">{error}</div>}

            <button
              className="analyze-button"
              type="button"
              onClick={analyzeImage}
              disabled={!file || isLoading}
            >
              {isLoading ? (
                <><span className="spinner" aria-hidden="true" /> Analyzing your piece…</>
              ) : (
                <>Analyze clothing <span aria-hidden="true">↗</span></>
              )}
            </button>
          </div>

          <div className="result-panel" aria-live="polite">
            {result ? (
              <ResultCard result={result} onReset={reset} />
            ) : (
              <div className="result-placeholder">
                <div className="placeholder-icon" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <p className="placeholder-kicker">Your analysis</p>
                <h2>Details will appear here</h2>
                <p>Upload an image and let StyleLens take a closer look.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer>
        <span>StyleLens</span>
        <p>Built with React, FastAPI &amp; OpenAI</p>
      </footer>
    </div>
  );
}

export default App;
