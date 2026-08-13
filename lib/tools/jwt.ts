// ============================================================
// JWT decoder & inspector
// ------------------------------------------------------------
// Decodes (does NOT verify) a JSON Web Token entirely in the browser. Splits the
// three base64url segments, parses header + payload JSON, and annotates the
// well-known registered/OIDC/OAuth2/Spring-Security claims.
//
// Verification is deliberately out of scope: checking the signature requires the
// signing secret or public key, which should never be pasted into a web page.
// The UI makes the "not verified" status explicit.
// ============================================================

export type JwtClaim = {
  key: string;
  value: unknown;
  description?: string;
  isTimestamp: boolean;
};

export type JwtDecodeSuccess = {
  ok: true;
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  headerJson: string;
  payloadJson: string;
  signature: string;
  algorithm: string | null;
  claims: JwtClaim[];
  warnings: string[];
};

export type JwtDecodeResult = { ok: false; error: string } | JwtDecodeSuccess;

/** Registered (RFC 7519) + common OIDC / OAuth2 / Spring Security claims. */
const CLAIM_DESCRIPTIONS: Record<string, string> = {
  // RFC 7519 registered claims
  iss: "Issuer — the service that created and signed this token",
  sub: "Subject — who the token is about (usually a user ID)",
  aud: "Audience — the recipient(s) the token is meant for",
  exp: "Expiration — the token is rejected after this time",
  nbf: "Not before — the token is rejected before this time",
  iat: "Issued at — when the token was created",
  jti: "JWT ID — a unique identifier for this token",
  // OpenID Connect
  name: "Full name (OIDC profile)",
  given_name: "First name (OIDC profile)",
  family_name: "Last name (OIDC profile)",
  preferred_username: "Preferred username (OIDC)",
  email: "Email address (OIDC)",
  email_verified: "Whether the email has been verified (OIDC)",
  nonce: "Value binding the token to a specific auth request (OIDC)",
  auth_time: "When the user actually authenticated (OIDC)",
  azp: "Authorized party — the client the token was issued to",
  acr: "Authentication context class reference (OIDC)",
  amr: "Authentication methods used (OIDC)",
  sid: "Session ID (OIDC)",
  // OAuth2 / Spring Security
  scope: "OAuth2 scopes granted (space-delimited)",
  scp: "OAuth2 scopes granted (array form)",
  client_id: "OAuth2 client that requested the token",
  token_type: "Type of token (e.g. Bearer)",
  authorities: "Granted authorities / roles (Spring Security)",
  roles: "Assigned roles",
  groups: "Group memberships",
  realm_access: "Realm-level roles (Keycloak)",
  resource_access: "Per-client roles (Keycloak)",
  typ: "Token type declared in the payload (e.g. Keycloak 'Bearer')",
};

const TIMESTAMP_CLAIMS = new Set(["exp", "nbf", "iat", "auth_time", "updated_at"]);

/** Decode a base64url string to a UTF-8 JS string. */
function base64UrlDecode(segment: string): string {
  const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.length % 4 === 0 ? base64 : base64 + "=".repeat(4 - (base64.length % 4));
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
  return new TextDecoder("utf-8").decode(bytes);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Format a relative time like "in 3 hours" / "5 minutes ago". Pure (takes now). */
export function relativeFromNow(targetMs: number, nowMs: number): string {
  const diffSec = Math.round((targetMs - nowMs) / 1000);
  const future = diffSec >= 0;
  const abs = Math.abs(diffSec);

  let value: number;
  let unit: string;
  if (abs < 60) {
    value = abs;
    unit = "second";
  } else if (abs < 3600) {
    value = Math.round(abs / 60);
    unit = "minute";
  } else if (abs < 86_400) {
    value = Math.round(abs / 3600);
    unit = "hour";
  } else if (abs < 2_592_000) {
    value = Math.round(abs / 86_400);
    unit = "day";
  } else if (abs < 31_536_000) {
    value = Math.round(abs / 2_592_000);
    unit = "month";
  } else {
    value = Math.round(abs / 31_536_000);
    unit = "year";
  }

  const label = `${value} ${value === 1 ? unit : `${unit}s`}`;
  if (abs === 0) return "just now";
  return future ? `in ${label}` : `${label} ago`;
}

export function decodeJwt(token: string): JwtDecodeResult {
  const trimmed = token.trim().replace(/^Bearer\s+/i, "");
  if (!trimmed) return { ok: false, error: "Paste a JWT to decode." };

  const parts = trimmed.split(".");
  if (parts.length !== 3) {
    return {
      ok: false,
      error: `A JWT has three dot-separated parts (header.payload.signature); this has ${parts.length}.`,
    };
  }

  let header: unknown;
  let payload: unknown;
  try {
    header = JSON.parse(base64UrlDecode(parts[0]));
  } catch {
    return { ok: false, error: "The header (first segment) isn't valid base64url-encoded JSON." };
  }
  try {
    payload = JSON.parse(base64UrlDecode(parts[1]));
  } catch {
    return { ok: false, error: "The payload (second segment) isn't valid base64url-encoded JSON." };
  }

  if (!isPlainObject(header)) {
    return { ok: false, error: "The header decoded, but it isn't a JSON object." };
  }
  if (!isPlainObject(payload)) {
    return { ok: false, error: "The payload decoded, but it isn't a JSON object." };
  }

  const algorithm = typeof header.alg === "string" ? header.alg : null;

  const warnings: string[] = [];
  if (algorithm && algorithm.toLowerCase() === "none") {
    warnings.push(
      'alg is "none": this token is unsigned and can be forged by anyone. A correctly configured backend must reject it.',
    );
  }
  if (!("exp" in payload)) {
    warnings.push("No exp claim — this token has no built-in expiry, so it stays valid until revoked server-side.");
  }

  const claims: JwtClaim[] = Object.entries(payload).map(([key, value]) => ({
    key,
    value,
    description: CLAIM_DESCRIPTIONS[key],
    isTimestamp: TIMESTAMP_CLAIMS.has(key) && typeof value === "number",
  }));

  return {
    ok: true,
    header,
    payload,
    headerJson: JSON.stringify(header, null, 2),
    payloadJson: JSON.stringify(payload, null, 2),
    signature: parts[2],
    algorithm,
    claims,
    warnings,
  };
}
