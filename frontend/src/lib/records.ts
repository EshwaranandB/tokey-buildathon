import type { ApiClient } from "./api";
import type { Receipt } from "./types";
export interface Transaction {
  id: string; spend_request_id: string; authority_id: string; agent_id: string;
  amount_micros: number; currency: string; vendor: string; purpose: string; resource_type: string;
  rail: string; state: string; requested_at: string; reservation_id: string | null; receipt_id: string | null;
}
export async function transactions(api: ApiClient): Promise<Transaction[]> {
  const items: Transaction[] = [];
  for (let offset = 0; ; offset += 100) {
    const page = await api.dashboardTransactions(100, offset);
    items.push(...page.items);
    if (page.items.length < 100) return items;
  }
}
export function matchingReceipts(receipts: Receipt[], transaction: Transaction): Receipt[] {
  return receipts.filter(r => r.payload.spend_request_id === transaction.spend_request_id ||
    (transaction.reservation_id !== null && r.payload.reservation_id === transaction.reservation_id));
}
export async function latestRazorpayCapture(api: ApiClient): Promise<{ transaction: Transaction; receipt: Receipt } | null> {
  // ponytail: scans tenant history and reads receipts once per authority; replace with a server-side latest-capture projection at scale.
  const candidates = (await transactions(api)).filter(t => t.rail === "razorpay" && t.state === "CAPTURED" && t.reservation_id);
  const byAuthority = new Map<string, Receipt[]>();
  const captures: { transaction: Transaction; receipt: Receipt }[] = [];
  for (const transaction of candidates) {
    if (!byAuthority.has(transaction.authority_id)) byAuthority.set(transaction.authority_id, await api.getAuthorityReceipts(transaction.authority_id));
    for (const receipt of matchingReceipts(byAuthority.get(transaction.authority_id)!, transaction)) {
      if (receipt.event_type === "SPEND_CAPTURED_V2" && receipt.payload.rail === "razorpay")
        captures.push({ transaction, receipt });
    }
  }
  captures.sort((a,b) => Date.parse(b.receipt.created_at) - Date.parse(a.receipt.created_at));
  return captures[0] ?? null;
}
