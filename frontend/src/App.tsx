import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { OverviewPage } from "./pages/OverviewPage";
import { AuthoritiesPage } from "./pages/AuthoritiesPage";
import { GrantAuthorityPage } from "./pages/GrantAuthorityPage";
import { AuthorityDetailPage } from "./pages/AuthorityDetailPage";
import { AgentsPage } from "./pages/AgentsPage";
import { TransactionsPage } from "./pages/TransactionsPage";
import { TransactionDetailPage } from "./pages/TransactionDetailPage";
import { ApprovalsPage } from "./pages/ApprovalsPage";
import { ReceiptsPage } from "./pages/ReceiptsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { SignInPage } from "./pages/SignInPage";
import { IntegrationsPage } from "./pages/IntegrationsPage";
import { IntegrationDetailPage } from "./pages/IntegrationDetailPage";
import { McpPage } from "./pages/McpPage";
import { ApiPage } from "./pages/ApiPage";
import { WebhooksPage } from "./pages/WebhooksPage";
import { useAuth } from "./lib/store";
import { Skeleton } from "./components/primitives/Skeleton";

export default function App() {
  const { actor, checking } = useAuth();

  if (checking) {
    return (
      <div className="flex h-full items-center justify-center bg-canvas">
        <div className="w-48">
          <Skeleton lines={3} />
        </div>
      </div>
    );
  }

  if (!actor) {
    return (
      <Routes>
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="*" element={<Navigate to="/sign-in" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/authorities" element={<AuthoritiesPage />} />
        <Route path="/authorities/new" element={<GrantAuthorityPage />} />
        <Route path="/authorities/:id" element={<AuthorityDetailPage />} />
        <Route path="/agents" element={<AgentsPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/transactions/:id" element={<TransactionDetailPage />} />
        <Route path="/approvals" element={<ApprovalsPage />} />
        <Route path="/receipts" element={<ReceiptsPage />} />
        <Route path="/integrations" element={<IntegrationsPage />} />
        <Route path="/integrations/:id" element={<IntegrationDetailPage />} />
        <Route path="/mcp" element={<McpPage />} />
        <Route path="/api" element={<ApiPage />} />
        <Route path="/webhooks" element={<WebhooksPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/sign-in" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
