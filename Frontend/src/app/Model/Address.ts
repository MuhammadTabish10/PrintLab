import { BillingAddress } from "./BillingAddress";
import { ShippingAddress } from "./ShippingAddress";

export interface Address {
  billingAddress: BillingAddress | null | undefined;
  shippingAddress: ShippingAddress | null | undefined;
}
