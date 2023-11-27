export interface Transactions {
  id: number | null,
  plateDimension: string | null;
  vendor: string | null;
  qty: number | null;
  unitPrice: number | null;
  amount: number | null;
  user: string | null;
  paymentMode: { name: string }[] | null;
}
