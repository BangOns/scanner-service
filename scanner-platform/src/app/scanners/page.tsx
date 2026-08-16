import { Suspense } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ScannerApplicationListView } from "@/features/ScannerApplication";

export default function ScannersPage() {
  return (
    <AppLayout>
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full" />
          </div>
        }
      >
        <ScannerApplicationListView />
      </Suspense>
    </AppLayout>
  );
}
