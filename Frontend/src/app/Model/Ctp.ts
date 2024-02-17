import { Vendor } from "./Vendor";

export interface Ctp {
  id: number | null | undefined;
  date: Date | null | undefined;
  l1: number | null | undefined;
  l2: number | null | undefined;
  plateDimension: string | null | undefined;
  rate: number | null | undefined;
  status: boolean | null | undefined;
  vendor: Vendor | null | undefined;
}
