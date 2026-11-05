const WHITESPACE_SPLIT_REGEX = /\s+/;

/**
 * Two-letter initials for avatar fallback (name preferred, then email local-part).
 */
export function userInitials(name: string | null, email: string): string {
  const n = name?.trim();
  if (n) {
    const parts = n.split(WHITESPACE_SPLIT_REGEX).filter(Boolean);
    if (parts.length >= 2) {
      const a = parts[0]?.[0];
      const b = parts[parts.length - 1]?.[0];
      if (a && b) return `${a}${b}`.toUpperCase();
    }
    if (parts[0] && parts[0].length >= 2) return parts[0].slice(0, 2).toUpperCase();
    if (parts[0]?.[0]) return `${parts[0][0]}`.toUpperCase();
  }
  const local = email.split("@")[0] ?? email;
  if (local.length >= 2) return local.slice(0, 2).toUpperCase();
  return local.slice(0, 1).toUpperCase() || "?";
}
