import { BusinessUnitProcessDto } from "./BusinessUnit";

export interface ProductRuleJob {
  id: number | undefined | null;
  productName: string | undefined | null;
  sizeCategory: string | undefined | null;
  size: string | undefined | null;
  category: string | undefined | null;
  processList: BusinessUnitProcessDto[];
  type: string | undefined | null;
}
