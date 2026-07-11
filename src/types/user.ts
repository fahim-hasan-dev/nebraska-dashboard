export interface IUser {
  _id: string;
  fullName: string;
  email?: string;
  phone: string;
  address: string;
  role: "admin" | "fan" | "driver";
  verified: boolean;
  status: "active" | "restricted" | "deleted";
  tractorName?: string[];
  image?: string;
  adminCreated?: boolean;
}
