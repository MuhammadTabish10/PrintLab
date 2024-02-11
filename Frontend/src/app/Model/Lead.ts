export interface Lead {
  id: number | null | undefined;
  companyName: string | null | undefined;
  contactName: string | null | undefined;
  createdAt: string | null | undefined | [number, number, number, number, number, number, number];
  leadAddress: LeadAddress[];
  about: LeadAbout | null | undefined;
  contact: LeadContact[];
  status: boolean | null | undefined;
  leadStatusType: string | null | undefined;
}

export interface LeadAddress {
  id: number | null | undefined;
  type: string | null | undefined;
  address: string | null | undefined;
  city: string | null | undefined;
  state: string | null | undefined;
  postalCode: string | null | undefined;
  country: string | null | undefined;
}

export interface LeadAbout {
  description: string | null | undefined;
  source: string | null | undefined;
}

export interface LeadContact {
  id: number | null | undefined;
  name: string | null | undefined;
  jobTitle: string | null | undefined;
  landLine: string | null | undefined;
  website: string | null | undefined;
  mobile: string | null | undefined;
  email: string | null | undefined;
  role: string | null | undefined;
}

export interface LeadContactDetails {
  landLine: string | null | undefined;
  website: string | null | undefined;
  mobile: string | null | undefined;
  email: string | null | undefined;
}
