export interface Invoice {
  id: number | undefined | null;
  invoiceNo: number | undefined | null;
  customer: string | undefined | null;
  customerEmail: string | undefined | null;
  sendLater: boolean | undefined | null;
  billingAddress: string | undefined | null;
  terms: string | undefined | null;
  invoiceDate: Date | undefined | null;
  dueDate: Date | undefined | null;
  invoiceProductDtoList: InvoiceProduct[];
  message: string | undefined | null;
  statement: string | undefined | null;
  status: boolean | undefined | null;
}
export interface InvoiceProduct {
  id: number | undefined | null;
  dateRow: Date | undefined | null;
  productRow: string | undefined | null;
  description: string | undefined | null;
  qty: number | undefined | null;
  rate: number | undefined | null;
  amount: number | undefined | null;
  status: boolean | undefined | null;
}
