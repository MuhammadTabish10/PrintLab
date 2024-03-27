export interface Business {
  id: number | null;
  businessName: string | null;
  businessBranchList?: BusinessBranch[];
}

export interface BusinessBranch {
  id: number | null | undefined;
  branchName: string | null | undefined;
  address: string | null | undefined;
  city: string | null | undefined;
  pointOfContact: string | null | undefined;
  phoneNumber: string | null | undefined;
}
