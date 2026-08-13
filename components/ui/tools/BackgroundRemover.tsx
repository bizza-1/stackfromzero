"use client";

import { useEffect, useState } from "react";

function download(url: string, name: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
}

export default function BackgroundRemover() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  useEffect(() => () => { if (result) URL.revokeObjectURL(result); }, [result]);

  function selectImage(selected?: File) {
    if (!selected) return;
    if (!selected.type.startsWith("image/")) { setError("Choose an image file (PNG, JPEG, WebP, etc.)."); return; }
    if (preview) URL.revokeObjectURL(preview);
    if (result) URL.revokeObjectURL(result);
    setFile(selected); setPreview(URL.createObjectURL(selected)); setResult(null); setError(""); setStatus("");
  }

  async function remove() {
    if (!file) return;
    setError(""); setStatus("Loading the on-device model…");
    try {
      const { removeBackground } = await import("@imgly/background-removal");
      setStatus("Separating the subject from its background…");
      const output = await removeBackground(file, { progress: (_key, current, total) => setStatus(`Processing image… ${Math.round((current / total) * 100)}%`) });
      if (result) URL.revokeObjectURL(result);
      setResult(URL.createObjectURL(output)); setStatus("Done — your PNG has a transparent background.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not remove the background. Please try another image."); setStatus("");
    }
  }

  return <div className="card bg-card border-custom rounded-4"><div className="card-body p-4">
    <label htmlFor="background-image" className="h6 fw-bold d-block mb-2">Choose an image</label>
    <input id="background-image" className="form-control bg-card border-custom text-body" type="file" accept="image/*" onChange={(e) => selectImage(e.target.files?.[0])} />
    <p className="small text-secondary-custom mt-2 mb-4">The model runs in your browser. Images are never uploaded to this site.</p>
    {preview && <div className="row g-4 align-items-start">
      <div className="col-md-6"><p className="small fw-semibold mb-2">Original</p><img src={preview} alt="Original upload" className="img-fluid rounded-3 border border-custom" /></div>
      <div className="col-md-6"><p className="small fw-semibold mb-2">Transparent result</p>{result ? <div className="rounded-3 border border-custom p-2" style={{ backgroundImage: "linear-gradient(45deg,#d1d5db 25%,transparent 25%),linear-gradient(-45deg,#d1d5db 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#d1d5db 75%),linear-gradient(-45deg,transparent 75%,#d1d5db 75%)", backgroundSize: "20px 20px", backgroundPosition: "0 0,0 10px,10px -10px,-10px 0" }}><img src={result} alt="Background removed" className="img-fluid" /></div> : <div className="rounded-3 border border-custom p-5 text-center text-secondary-custom">Your transparent PNG will appear here.</div>}</div>
    </div>}
    {error && <div className="alert alert-danger mt-4 mb-0" role="alert">{error}</div>}
    {status && <p className="small text-secondary-custom mt-4 mb-0" role="status"><i className="bi bi-arrow-repeat me-2" aria-hidden="true" />{status}</p>}
    <div className="d-flex flex-wrap gap-2 mt-4"><button type="button" className="btn btn-primary" disabled={!file || Boolean(status) && !result} onClick={remove}><i className="bi bi-magic me-2" aria-hidden="true" />Remove background</button>{result && <button type="button" className="btn btn-outline-light" onClick={() => download(result, `${file?.name.replace(/\.[^.]+$/, "") ?? "image"}-transparent.png`)}><i className="bi bi-download me-2" aria-hidden="true" />Download PNG</button>}</div>
  </div></div>;
}
