export interface ProductService{
  id: number | undefined | null;
  name: string | undefined | null;
  category: string | undefined | null;
  type: string | undefined | null;
  desc: string | undefined | null;
  cost: number | undefined | null;
  status: boolean | undefined | null;
}
