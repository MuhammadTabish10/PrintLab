export interface ProductCategory {
  id: number | undefined | null;
  name: string | undefined | null;
  isSub: boolean | undefined | null;
  parentProductCategory: Parent| undefined | null;
  status: boolean | undefined | null;
}
export interface Parent {
  id: number | undefined | null;
  name: string | undefined | null;
}
