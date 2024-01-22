import { ProductCategory } from "./ProductCategory";

export interface ProductService{
  id: number | undefined | null;
  name: string | undefined | null;
  productCategory: ProductCategory;
  type: string | undefined | null;
  description: string | undefined | null;
  cost: number | undefined | null;
  status: boolean | undefined | null;
}
