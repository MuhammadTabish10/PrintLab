import { Business } from "./Business";
import { BusinessUnitProcessDto } from "./BusinessUnit";
import { Customer } from "./Customer";
import { JobProcessedDetails } from "./ProcessDetails";

export interface ProductionJob {
  id: number | null | undefined;
  jobId: string | null | undefined;
  sizeCategory: string | null | undefined;
  size: string | null | undefined;
  client: Customer | null | undefined;
  businessName?: Business[];
  productCategory: any;
  productName: string | null | undefined;
  description: string | null | undefined;
  qty: number | null | undefined;
  rate: number | null | undefined;
  amount: number | null | undefined;
  linkedInvoice: string | null | undefined;
  privateNotes: string | null | undefined;
  orderTrackingNotes: string | null | undefined;
  productionNotes: string | null | undefined;
  businessCategory: string | null | undefined;
  proof?: Proof[];
  ctpFileName: string | null | undefined;
  locationOfFile: string | null | undefined;
  sentOn: Date | null | undefined;
  designPackageFile: string | null | undefined;
  locationOfDesignFile: string | null | undefined;
  jobStartDate: Date | null | undefined;
  productionStartDate: Date | null | undefined;
  productionEndDate: Date | null | undefined;
  packingAndQADate: Date | null | undefined;
  deliveryDate: Date | null | undefined;
  expiryDate: Date | null | undefined;
  sendTo: string | null | undefined;
  type: string | null | undefined;
  productionUser: string | null | undefined;
  processList?: BusinessUnitProcessDto[];
  processedDetailList: JobProcessedDetails[];
}
export interface Proof {
  id: number | null | undefined;
  fileData: File | null | undefined;
}
