export interface User {
  id: string;
  username: string;
  fullname?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  gen?: string;
  birthday?: Date;
  address?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
