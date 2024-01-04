export interface ShippingAddress {
  sameAsBilling: boolean | undefined | null;
  streetAddress: string | undefined | null;
  city: string | undefined | null;
  province: string | undefined | null;
  postalCode: string | undefined | null;
  country: string | undefined | null;
}
