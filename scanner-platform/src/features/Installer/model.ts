import { InstallerRecord, ScannerApplication } from "@/client/types.gen";

export interface InstallerProps {
  application: ScannerApplication;
  installer?: InstallerRecord;
}
