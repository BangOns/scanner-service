import { AppLayout } from "@/components/layout/AppLayout";
import { LicenseManagementView } from "@/features/License";

export default function LicensesPage() {
  return (
    <AppLayout>
      <LicenseManagementView />
    </AppLayout>
  );
}
