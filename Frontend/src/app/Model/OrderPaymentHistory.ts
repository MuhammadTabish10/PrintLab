import { Business, BusinessBranch } from "./Business";
import { Order } from "./Order";
import { User } from "./User";

export interface OrderPaymentHistory {
  id: number | undefined | null;
  timeStamp: Date | string | undefined | null;
  amount: number | undefined | null;
  type: string | undefined | null;
  description: string | undefined | null;
  paymentRecievedBy: User | undefined | null;
  business: Business | undefined | null;
  branch: BusinessBranch | undefined | null;
  status: boolean | undefined | null;
  orderId: Order | undefined | null;
}