export interface User {
  id: number | null | undefined;
  createdAt: Date | string | null | undefined | [number, number, number, number, number, number, number];
  name: string | null | undefined;
  email: string | null | undefined;
  password: string | null | undefined;
  phone: string | null | undefined;
  cnic: string | null | undefined;
  roles: Roles[] | null | undefined;
  status: boolean | null | undefined;
}

export interface Roles {
  id: number | null | undefined;
  name: string | null | undefined;
  permissions: Permission[] | null | undefined;
}
export interface Permission {
  id: number | null | undefined;
  name: string | null | undefined;
  value: boolean | null | undefined;
}
