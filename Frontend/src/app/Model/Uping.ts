import { PaperSize } from "./PressMachine";

export interface Uping {
  id: number | null | undefined;
  productSize: string;
  category: string;
  l1: number;
  l2: number;
  unit: string;
  mm: string;
  inch: string;
  status: boolean;
  upingPaperSize: UpingPaperSize[];
}

export interface UpingPaperSize {
  id: number;
  paperSize: PaperSize;
  value: number;
}
