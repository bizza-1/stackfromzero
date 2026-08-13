import type { Metadata } from "next";
import Link from "next/link";
import BackgroundRemover from "@/components/ui/tools/BackgroundRemover";

export const metadata: Metadata = { title: "Free Background Remover", description: "Remove an image background in your browser and download a transparent PNG. Your image is never uploaded.", alternates: { canonical: "/tools/background-remover" } };

export default function BackgroundRemoverPage() { return <div className="container py-5"><nav aria-label="Breadcrumb" className="mb-4"><Link href="/tools" className="text-decoration-none small text-secondary-custom"><i className="bi bi-arrow-left me-1" />All tools</Link></nav><div className="mb-4"><span className="badge rounded-pill bg-primary bg-opacity-10 text-primary border border-primary mb-3 px-3 py-2"><i className="bi bi-image-alt me-1" />Image editing</span><h1 className="display-6 fw-bold mb-3">Background remover</h1><p className="lead text-secondary-custom mb-2" style={{ maxWidth: "700px" }}>Turn a photo into a transparent PNG in a few clicks. The AI model runs locally in your browser, so your image stays private.</p><p className="small text-secondary-custom mb-0"><i className="bi bi-shield-lock me-1" />The first use downloads the processing model; after that, removal happens on your device.</p></div><BackgroundRemover /></div>; }
