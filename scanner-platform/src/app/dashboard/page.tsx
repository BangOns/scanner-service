import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardView } from "@/features/Dashboard";

export default function DashboardPage() {
  return (
    <AppLayout>
      <DashboardView />
    </AppLayout>
  );
}
