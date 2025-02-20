import { Gender } from "./Enum";

export type User = {
  id: string;
  email: string;
  fullname: string;
  firstname: string;
  lastname: string;
  mobilePhone: string;
  dateOfBirth?: string;
  avatarUrl: string | null;
  permissions: number[];
  roles: string[];
};

export type UpdateUserDto = {
  firstname: string;
  lastname: string;
  mobilePhone?: string;
  email: string;
  dateOfBirth?: string;
  gender: Gender;
};
