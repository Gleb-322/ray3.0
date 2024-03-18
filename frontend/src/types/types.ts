export interface IDate {
  date: string;
}
export interface IPatients {
  name: string | null | undefined;
  phone: string | null | undefined;
  email?: string | null | undefined;
  date: string | undefined;
  time: string | null | undefined;
}
export interface IAdmin {
  login: string | null | undefined;
  password: string | null | undefined;
}
