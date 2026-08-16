import { AppLayout } from "@/components/layout/AppLayout";
import { ScannerAgentVersionView } from "@/features/ScannerAgentVersion";

export default function VersionsPage() {
  return (
    <AppLayout>
      <ScannerAgentVersionView />
    </AppLayout>
  );
}
