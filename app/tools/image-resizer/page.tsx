import type { Metadata } from "next";
import Link from "next/link";
import ImageResizer from "@/components/ui/tools/ImageResizer";

export const metadata: Metadata = { title: "Free Image Resizer", description: "Resize images in your browser by exact pixel dimensions. Export JPEG, PNG, or WebP without uploading your file.", alternates: { canonical: "/tools/image-resizer" } };

export default function ImageResizerPage() { return <div className="container py-5"><nav aria-label="Breadcrumb" className="mb-4"><Link href="/tools" className="text-decoration-none small text-secondary-custom"><i className="bi bi-arrow-left me-1" />All tools</Link></nav><div className="mb-4"><span className="badge rounded-pill bg-primary bg-opacity-10 text-primary border border-primary mb-3 px-3 py-2"><i className="bi bi-aspect-ratio me-1" />Image editing</span><h1 className="display-6 fw-bold mb-3">Image resizer</h1><p className="lead text-secondary-custom mb-2" style={{ maxWidth: "700px" }}>Resize images to exact dimensions, preserve the aspect ratio when you need to, and export JPEG, PNG, or WebP.</p><p className="small text-secondary-custom mb-0"><i className="bi bi-shield-lock me-1" />100% client-side. Your image never leaves your browser.</p></div><ImageResizer /></div>; }
