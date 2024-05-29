import { MasterCustomerStatement } from "src/app/Model/MasterCustomerStatement";

export const RequestBodyMasterCustomerStatement = {
  class: <MasterCustomerStatement>{
    id: undefined,
    date: undefined,
    time: undefined,
    debit: undefined,
    credit: undefined,
    order: undefined,
    balance: undefined,
    dateList: [],
    status: undefined,
    description: undefined,
    orderPaymentHistory: undefined,
  }
};