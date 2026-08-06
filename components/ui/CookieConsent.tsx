"use client";

import { useEffect, useState } from "react";

const COOKIE_NAME = "sfz_cookie_consent";
const YEAR = 60 * 60 * 24 * 365;

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, maxAge = YEAR) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${maxAge};SameSite=Lax`;
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const existing = getCookie(COOKIE_NAME);
    if (!existing) setVisible(true);
  }, []);

  const accept = () => {
    setCookie(COOKIE_NAME, "1");
    setVisible(false);
  };

  const decline = () => {
    setCookie(COOKIE_NAME, "0");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-consent d-flex align-items-center justify-content-between px-3 py-2 shadow-lg">
      <div className="me-3">
        <strong>We use cookies</strong>
        <div className="small">We use cookies to improve your experience. By continuing, you agree to our use of cookies.</div>
      </div>
      <div className="d-flex gap-2">
        <button className="btn btn-outline-light btn-sm" onClick={decline} aria-label="Decline cookies">
          Decline
        </button>
        <button className="btn btn-success btn-sm" onClick={accept} aria-label="Accept cookies">
          Accept
        </button>
      </div>
    </div>
  );
}
