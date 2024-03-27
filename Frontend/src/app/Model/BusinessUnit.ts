import { Vendor } from "./Vendor";

export interface BusinessUnit {
  id: number | undefined | null;
  name: string | undefined | null;
  processList?: BusinessUnitProcessDto[];
}

export interface BusinessUnitProcessDto {
  id: number | undefined | null;
  process: string | undefined | null;
  billable: boolean | undefined | null;
  vendors?: Vendor[];
}

