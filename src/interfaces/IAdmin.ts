export interface IAdmin {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
  lastLoginDate: string;
}

export interface INoticationAll {
  title: string;
  message: string;
  type: string;
  link: string;
}
