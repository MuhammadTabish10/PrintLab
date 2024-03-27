import { Business, BusinessBranch } from "./Business";

export interface Customer {
  id: number | null | undefined;
  name: string | null | undefined;
  email: string | null | undefined;
  whatsApp: string | null | undefined;
  mobileNo: string | null | undefined;
  statusId: string | null | undefined;
  since: Date | null | undefined;
  leadOwner: string | null | undefined;
  clientStatus: boolean | null | undefined;
  showLead: boolean | null | undefined;
  customerBusinessName: Business[]
  createdAt: Date | null | undefined;
  clientPreferred: string[] | null | undefined;
  primaryPaymentMethod: string[] | string | null | undefined;
  terms: string | null | undefined;
  tax: string | null | undefined;
  notes: string | null | undefined;
  status: string | null | undefined;
}
