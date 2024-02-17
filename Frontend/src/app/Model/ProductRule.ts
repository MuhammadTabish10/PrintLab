import { Ctp } from "./Ctp";
import { Pressmachine } from "./PressMachine";
import { Vendor } from "./Vendor";

export interface ProductRule {
  id: number | null | undefined;
  title: string | null | undefined;
  printSide: string | null | undefined;
  jobColorFront: string | null | undefined;
  jobColorBack: string | undefined | null;
  category: string | null | undefined;
  size: string | null | undefined;
  quantity: string | null | undefined;
  impositionValue: boolean | null | undefined;
  status: boolean | null | undefined;
  pressMachine: Pressmachine | null | undefined;
  ctp: Ctp | null | undefined;
  productRulePaperStockList: ProductRulePaperStockList[];
}

export interface ProductRulePaperStockList {
  id: number | null | undefined;
  paperStock: string | null | undefined;
  customerFriendlyName: string | null | undefined;
  brand: string | null | undefined;
  madeIn: string | null | undefined;
  dimension: string | null | undefined;
  gsm: string | null | undefined;
  status: boolean | null | undefined;
  vendor: Vendor | null | undefined;
}
