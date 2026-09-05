export function positiveMicros(value: string): number {
  if (!/^\d+(\.\d{1,6})?$/.test(value.trim())) throw new Error("Use a positive amount with at most six decimal places.");
  const [whole, fraction = ""] = value.trim().split(".");
  const amount = BigInt(whole) * 1000000n + BigInt(fraction.padEnd(6, "0"));
  if (amount <= 0n || amount > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error("Amount is outside the supported range.");
  return Number(amount);
}
export function scopeValues(value: string): string[] {
  const values = [...new Set(value.split(",").map(v => v.trim()).filter(Boolean))];
  if (!values.length) throw new Error("Every scope must contain at least one value.");
  return values;
}

