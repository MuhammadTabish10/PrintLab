export interface LaminationVendor {
  id: number | null | undefined;
  timeStamp: Date | string | null | undefined;
  name: string | null | undefined;
  createdBy: string | null | undefined;
  process: string | null | undefined;
  type: string | null | undefined;
  rate: number | null | undefined;
  status: boolean | null | undefined;
}
