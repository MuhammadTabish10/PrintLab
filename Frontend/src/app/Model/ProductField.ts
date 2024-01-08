export interface ProductField {
  createdAt: string | null | undefined;
  id: number | null | undefined;
  name: string | null | undefined;
  productFieldValuesList: ProductFieldValue[];
  status: string | null | undefined;
  type: string | null | undefined;
}

export interface ProductFieldValue {
  id: number | null | undefined;
  name: string | null | undefined;
  status: string | null | undefined;
}
