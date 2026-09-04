/** Human presentation only. Canonical Core enum values and opaque IDs stay intact. */
const OPAQUE_ID = /^(auth|res|spend|rcpt|cred|act|order|pay|receipt|exec)_[A-Za-z0-9-]+/i;

export function humanize(value: string): string {
  if (!value || OPAQUE_ID.test(value)) return value;
  return value.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim()
    .toLowerCase().replace(/(^|\s)\S/g, (letter) => letter.toUpperCase());
}

export const formatStatus = humanize;
export const formatAgentName = humanize;
export const formatFieldLabel = humanize;
