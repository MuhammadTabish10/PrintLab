export interface Vendor {
  id: number | undefined | null;
  name: string | undefined | null;
  date: Date | undefined | null;
  contactName: string | undefined | null;
  contactNumber: string | undefined | null;
  email: string | undefined | null;
  address: string | undefined | null;
  notes: string | undefined | null;
  status: boolean | undefined | null;
  vendorProcessList: VendorProcessList[];
  isActive: boolean | undefined | null;
  isVerified: boolean | undefined | null;
  isLock: boolean | undefined | null;
  timeStamp: any;
  since: any;
  rating: any;
}

export interface VendorProcessList {
  id: number | undefined | null;
  productProcess: ProductProcess | undefined | null;
  materialType: string | undefined | null;
  rateSqft: number | undefined | null;
  notes: string | undefined | null;
}

export interface ProductProcess {
  id: number | undefined | null;
  name: string | undefined | null;
  status: string | undefined | null;
}
