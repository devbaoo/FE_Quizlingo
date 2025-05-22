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

export interface IPackageFeature {
  doubleXP: boolean;
  premiumLessons?: boolean; 
  unlimitedLives: boolean;
}
export interface IPackageUpdateCreate {
  name: string;
  description: string;
  price: number;
  duration: number;
  discount: number;
  discountEndDate: string;
  features?: IPackageFeature;
}

export interface IPackage {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  isActive: boolean;
  discount: number;
  discountEndDate: string; 
  createdAt: string;
  updatedAt: string;
  features: IPackageFeature;
}


