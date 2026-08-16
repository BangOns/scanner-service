import { AppLayout } from "@/components/layout/AppLayout";
import { ScannerDetailView } from "@/features/ScannerApplication/sections/ScannerDetailView";

export default async function ScannerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AppLayout>
      <ScannerDetailView id={id} />
    </AppLayout>
  );
}
