export interface Customer {
  id: number | null | undefined;
  title: string | null | undefined;
  name: string | null | undefined;
  middleName: string | null | undefined;
  lastName: string | null | undefined;
  email: string | null | undefined;
  phoneNo: string | null | undefined;
  mobileNo: string | null | undefined;
  website: string | null | undefined;
  createdAt: Date | null | undefined;
  businessName: string | null | undefined;
  subCustomer: boolean | null | undefined;
  billParentCustomer: boolean | null | undefined;
  parentCustomerId: number | null | undefined;
  billingStreetAddress: string | null | undefined;
  billingCity: string | null | undefined;
  billingProvince: string | null | undefined;
  billingPostalCode: string | null | undefined;
  billingCountry: string | null | undefined;
  sameAsBilling: boolean | null | undefined;
  shippingStreetAddress: string | null | undefined;
  shippingCity: string | null | undefined;
  shippingProvince: string | null | undefined;
  shippingPostalCode: string | null | undefined;
  shippingCountry: string | null | undefined;
  openingBalance: string | null | undefined;
  asOf: Date | null | undefined;
  primaryPaymentMethod: string | null | undefined;
  terms: string | null | undefined;
  tax: string | null | undefined;
  status: string | null | undefined;
}
