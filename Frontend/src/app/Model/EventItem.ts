export interface EventItem {
  status: string | undefined | null;
  date: string | undefined | null;
  icon: string | undefined | null;
  color: string | undefined | null;
  routerLink: string[] | undefined | null;
  queryParams: { [key: string]: number } | undefined | null;
  red: string | undefined | null;
}
