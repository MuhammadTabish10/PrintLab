export interface Transactions {
  id: number | null,
  plateDimension: string;
  vendor: string;
  qty: number;
  unitPrice: number;
  amount: number;
  user: string;
  paymentMode: { name: string }[];
}
