import { Business, BusinessBranch } from "./Business";
import { MasterCustomerStatement } from "./MasterCustomerStatement";
import { Order } from "./Order";
import { User } from "./User";

export interface OrderPaymentHistory {
  id: number | undefined | null;
  order: Order | undefined | null;
  type: string | undefined | null;
  amount: number | undefined | null;
  status: boolean | undefined | null;
  business: Business[];
  description: string | undefined | null;
  timeStamp: Date | string | undefined | null;
  paymentReceivedBy: User[];
  businessBranch: BusinessBranch[];
  masterCustomerStatement: MasterCustomerStatement | undefined | null;
}
