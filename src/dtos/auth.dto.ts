export interface ILoginReq {
  username: string;
  password: string;
}

export interface INguoiDungRecord {
  UserId: string;
  Username: string;
  PasswordHash: string;
  FullName: string;
  RoleId: number;
  IsActive: boolean;
}

export interface IJwtPayload {
  UserId: string;
  RoleId: number;
}

export interface ILoginRes {
  token: string;
}