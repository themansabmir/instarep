export function extractExternalEventId(payload: unknown): string {
  if (typeof payload !== "object" || payload === null) {
    return crypto.randomUUID();
  }

  const record = payload as Record<string, unknown>;
  const entry = Array.isArray(record.entry) ? record.entry[0] : undefined;
  if (entry && typeof entry === "object") {
    const entryRecord = entry as Record<string, unknown>;
    const messaging = Array.isArray(entryRecord.messaging) ? entryRecord.messaging[0] : undefined;
    if (messaging && typeof messaging === "object") {
      const msg = messaging as Record<string, unknown>;
      const message = msg.message as Record<string, unknown> | undefined;
      if (message?.mid && typeof message.mid === "string") return message.mid;
    }
    const changes = Array.isArray(entryRecord.changes) ? entryRecord.changes[0] : undefined;
    if (changes && typeof changes === "object") {
      const change = changes as Record<string, unknown>;
      const value = change.value as Record<string, unknown> | undefined;
      if (value?.id && typeof value.id === "string") return value.id;
    }
    if (entryRecord.id && typeof entryRecord.id === "string") {
      return `${entryRecord.id}-${Date.now()}`;
    }
  }

  return crypto.randomUUID();
}

export function extractEventType(payload: unknown): string {
  if (typeof payload !== "object" || payload === null) return "unknown";

  const record = payload as Record<string, unknown>;
  if (typeof record.object === "string") return record.object;

  const entry = Array.isArray(record.entry) ? record.entry[0] : undefined;
  if (entry && typeof entry === "object") {
    const entryRecord = entry as Record<string, unknown>;
    const changes = Array.isArray(entryRecord.changes) ? entryRecord.changes[0] : undefined;
    if (changes && typeof changes === "object") {
      const change = changes as Record<string, unknown>;
      if (typeof change.field === "string") return change.field;
    }
    if (Array.isArray(entryRecord.messaging)) return "messaging";
  }

  return "unknown";
}
