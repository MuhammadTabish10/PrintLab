import { ProductRule } from "./ProductRule";
import { Vendor } from "./Vendor";

export interface BusinessUnit {
  id: number | undefined | null;
  name: string | undefined | null;
  processList?: BusinessUnitProcessDto[];
}

export interface BusinessUnitProcessDto {
  id: number | undefined | null;
  process: string | undefined | null;
  type: string | undefined | null;
  productRuleJobList?: ProductRule[];
  vendors?: Vendor[];
}

