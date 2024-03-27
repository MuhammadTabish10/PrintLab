import { Vendor } from "./Vendor";

export interface Pressmachine {
  id: number | null | undefined;
  name: string | null | undefined;
  plateDimension: string | null | undefined;
  gripperMargin: string | null | undefined;
  maxSheetSize: string | null | undefined;
  minSheetSize: string | null | undefined;
  maxSPH: number | null | undefined;
  impression_1000_rate: number | null | undefined;
  is_selected: boolean | null | undefined;
  status: string | null | undefined;
  vendor: Vendor | null | undefined;
  pressMachineSize: PressMachineSizeList[]
}
export interface PressMachineSizeList {
  id: number | null | undefined;
  paperSize: PaperSize | null | undefined;
  value: number | null | undefined;
}
export interface PaperSize {
  id: number | null | undefined;
  label: string | null | undefined;
  status: string | null | undefined;
  pressMachineSize: PressMachineSizeList[];
}
