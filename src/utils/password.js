export async function hashPassword(password) {
  const value = String(password ?? "");
  if (globalThis.crypto?.subtle) {
    const data = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  // Deterministic fallback for offline test environments; production authentication is server-side.
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) hash = Math.imul(hash ^ value.charCodeAt(i), 16777619);
  return `fallback-${(hash >>> 0).toString(16)}`;
}

export async function verifyPassword(password, expectedHash) {
  if (!expectedHash) return false;
  return (await hashPassword(password)) === expectedHash;
}
