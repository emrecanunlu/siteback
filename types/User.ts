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
  isEmailVerified: boolean;
};

export type UpdateUserDto = {
  firstname: string;
  lastname: string;
  mobilePhone?: string;
  email: string;
  dateOfBirth?: string;
  gender?: Gender;
};

export type NearestChauffeur = User & {
  location: {
    x: number;
    y: number;
  };
  distance: number;
};
