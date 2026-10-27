export type WaitlistEntry = { email: string; note?: string; source?: string; company?: string };

const EMAIL = /^[a-z0-9._%][a-z0-9._%+-]*@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/i;

export function isEmail(value: string) {
  return EMAIL.test(value.trim());
}

// Saves the entry through /api/waitlist, which appends it to the Google Sheet.
// Throws on failure so the form can show its error state.
export async function joinWaitlist(entry: WaitlistEntry): Promise<void> {
  const res = await fetch("/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error ?? `HTTP ${res.status}`);
  }
}
