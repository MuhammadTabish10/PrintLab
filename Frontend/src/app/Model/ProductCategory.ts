export interface ProductCategory {
  id: number | undefined | null;
  name: string | undefined | null;
  isSub: boolean | undefined | null;
  parentProductCategory: parent| undefined | null;
  status: boolean | undefined | null;
}
export interface parent {
  id: number | undefined | null;
  name: string | undefined | null;
}
