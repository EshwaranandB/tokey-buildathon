import { useEffect, useState } from "react";
import { useAuth } from "../lib/store";
import { SectionHeader } from "../components/primitives/Card";
import { EmptyState } from "../components/primitives/EmptyState";
import { ReceiptText } from "lucide-react";

export function ReceiptsPage() {
  const { api } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // In live mode, we need an authority ID to fetch receipts
    // For now, show a helpful empty state directing users to authorities
    setLoading(false);
  }, [api]);

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <SectionHeader title="Receipts" description="Immutable audit trail. Every state change produces a receipt chained by hash. Receipts are authority-bound — view them from the authority detail page." />

      {loading ? (
        <div className="animate-pulse space-y-2">
          <div className="h-12 bg-surface rounded" />
          <div className="h-12 bg-surface rounded" />
          <div className="h-12 bg-surface rounded" />
        </div>
      ) : (
        <EmptyState icon={<ReceiptText className="h-5 w-5" />} title="No authority selected" description="Navigate to an authority detail page to view its complete receipt chain. Receipts are produced on issuance, delegation, spend approval, and execution." />
      )}
    </div>
  );
}

