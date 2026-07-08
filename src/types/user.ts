export interface IUser {
  _id: string;
  fullName: string;
  email?: string;
  phone: string;
  address: string;
  role: "admin" | "fan" | "driver";
  verified: boolean;
  status: "active" | "restricted" | "deleted";
  vehicleName?: string;
  image?: string;
}
