import { BusinessUnitProcessDto } from "./BusinessUnit";
import { JobProcessedDetails } from "./ProcessDetails";

export interface ProductRuleJob {
  id: number | undefined | null;
  productName: string | undefined | null;
  sizeCategory: string | undefined | null;
  size: string | undefined | null;
  category: string | undefined | null;
  processList?: BusinessUnitProcessDto[];
  processedDetailList: JobProcessedDetails[];
  type: string | undefined | null;
}
