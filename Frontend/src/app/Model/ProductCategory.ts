export interface ProductCategory {
  id: number | undefined | null;
  name: string | undefined | null;
  isSub: boolean | undefined | null;
  parent_product_category_id: parent;
  status: boolean | undefined | null;
}
export interface parent {
  id: number | undefined | null;
  name: string | undefined | null;
}
