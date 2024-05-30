import { Order } from "./Order";
import { OrderPaymentHistory } from "./OrderPaymentHistory";

export interface MasterCustomerStatement {
  dateList: (Date)[];
  id: number | undefined | null;
  date: Date | undefined | null;
  time: string | undefined | null;
  order: Order | undefined | null;
  debit: number | undefined | null;
  credit: number | undefined | null;
  balance: number | undefined | null;
  status: boolean | undefined | null;
  description: string | undefined | null;
  paymentHistory: OrderPaymentHistory | undefined | null;
}
