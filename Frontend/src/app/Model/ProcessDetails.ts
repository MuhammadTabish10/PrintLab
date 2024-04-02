export interface JobProcessedDetails {
  id: number | undefined | null;
  amount: number | undefined | null;
  vendor: string | undefined | null;
  payment: string | undefined | null;
  jobProcessed: boolean | undefined | null;
  processName: string | undefined | null;
  timeStamp: Date | undefined | null;
  status: boolean | undefined | null;
}
