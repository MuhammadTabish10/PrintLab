import { OrderPaymentHistory } from "src/app/Model/OrderPaymentHistory";

export const RequestBodyOrderPaymentHistory = {
  class: <OrderPaymentHistory>{
    id: undefined,
    type: undefined,
    order: undefined,
    amount: undefined,
    status: undefined,
    business: [],
    timeStamp: undefined,
    description: undefined,
    businessBranch: [],
    paymentReceivedBy: [],
    masterCustomerStatement: undefined,
  }
};
