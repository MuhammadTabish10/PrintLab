import { BusinessUnitProcessDto } from "./BusinessUnit";
import { Ctp } from "./Ctp";
import { PressMachine } from "./PressMachine";
import { JobProcessedDetails } from "./ProcessDetails";
import { Vendor } from "./Vendor";

export interface ProductRule {
  productRulePaperStockList: ProductRulePaperStockList[] | null | undefined;
  processedDetailList: JobProcessedDetails[] | null | undefined;
  processList: BusinessUnitProcessDto[] | null | undefined;
  pressMachine: PressMachine | null | undefined;
  impositionValue: boolean | null | undefined;
  businessCategory: string | null | undefined;
  jobColorFront: string | null | undefined;
  jobColorBack: string | null | undefined;
  sizeCategory: string | null | undefined;
  productName: string | null | undefined;
  printSide: string | null | undefined;
  quantity: string | null | undefined;
  status: string | null | undefined;
  size: string | null | undefined;
  type: string | null | undefined;
  id: number | null | undefined;
  ctp: Ctp | null | undefined;
}

export interface ProductRulePaperStockList {
  customerFriendlyName: string | null | undefined;
  paperStock: string | null | undefined;
  dimension: string | null | undefined;
  status: boolean | null | undefined;
  madeIn: string | null | undefined;
  vendor: Vendor | null | undefined;
  brand: string | null | undefined;
  gsm: string | null | undefined;
  id: number | null | undefined;
}
