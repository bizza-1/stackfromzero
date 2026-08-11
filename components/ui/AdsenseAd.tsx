"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type AdsenseAdProps = {
  className?: string;
  style?: CSSProperties;
  slotId?: string;
};

const DEFAULT_PUBLISHER_ID = "NEXT_PUBLIC_ADSENSE_PUBLISHER_ID";
const DEFAULT_SLOT_ID = "NEXT_PUBLIC_ADSENSE_SLOT_ID";

export default function AdsenseAd({ className, style, slotId }: AdsenseAdProps) {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || DEFAULT_PUBLISHER_ID;
  const resolvedSlotId = slotId || process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID || DEFAULT_SLOT_ID;
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (publisherId !== DEFAULT_PUBLISHER_ID && resolvedSlotId !== DEFAULT_SLOT_ID) {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
      setIsLoaded(true);
    }
  }, [publisherId, resolvedSlotId]);

  const showRealAd = publisherId !== DEFAULT_PUBLISHER_ID && resolvedSlotId !== DEFAULT_SLOT_ID;

  return (
    <div className={className} style={style}>
      {showRealAd ? (
        <>
          <ins
            className="adsbygoogle"
            style={{ display: "block", textAlign: "center" }}
            data-ad-client={publisherId}
            data-ad-slot={resolvedSlotId}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
          {!isLoaded && <div className="text-center text-secondary-custom small py-3">Loading AdSense…</div>}
        </>
      ) : (
        <div className="border border-dashed rounded-4 p-4 text-center bg-card text-secondary-custom">
          <div className="fw-semibold mb-1">Ad placeholder</div>
          <div className="small">Replace the dummy AdSense values later.</div>
        </div>
      )}
    </div>
  );
}
