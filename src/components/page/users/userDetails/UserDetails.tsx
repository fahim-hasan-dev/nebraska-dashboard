import { IUser } from "@/types/user";
import { getImageUrl } from "@/utils/imageUrl";
import { Badge } from "@/components/ui/badge";
import { Shield, Mail, Phone, MapPin, Truck, CheckCircle2, AlertCircle } from "lucide-react";

interface UserDetailsProps {
  user: IUser;
}

const UserDetails = ({ user }: UserDetailsProps) => {
  if (!user) return <p className="text-gray-500 text-center py-4">No user data available.</p>;

  // Initials for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* User Header Profile */}
      <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
          {user.image ? (
            <img
              src={getImageUrl(user.image)}
              alt={user.fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xl font-bold text-gray-400">
              {getInitials(user.fullName)}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1.5 min-w-0">
          <h3 className="font-bold text-gray-900 text-lg truncate">
            {user.fullName || "Unnamed User"}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {/* Role Badge */}
            <Badge
              className={`capitalize font-bold text-xs py-0.5 px-2.5 shadow-none rounded-full border ${
                user.role === "admin"
                  ? "bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-50"
                  : user.role === "driver"
                  ? "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-50"
                  : "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-50"
              }`}
            >
              {user.role}
            </Badge>

            {/* Status Badge */}
            <Badge
              className={`capitalize font-bold text-xs py-0.5 px-2.5 shadow-none rounded-full border ${
                user.status === "active"
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                  : user.status === "restricted"
                  ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-50"
                  : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {user.status}
            </Badge>
          </div>
        </div>
      </div>

      {/* Information Grid */}
      <div className="grid gap-4 text-sm font-medium">
        <div className="grid grid-cols-[100px_1fr] gap-4 items-start py-1">
          <span className="text-gray-400 flex items-center gap-1.5 font-semibold">
            <Mail className="w-4 h-4 text-gray-400 shrink-0" />
            Email
          </span>
          <span className="text-gray-800 break-all select-all font-semibold">
            {user.email}
          </span>
        </div>

        <div className="grid grid-cols-[100px_1fr] gap-4 items-start py-1">
          <span className="text-gray-400 flex items-center gap-1.5 font-semibold">
            <Phone className="w-4 h-4 text-gray-400 shrink-0" />
            Phone
          </span>
          <span className="text-gray-800 break-all select-all font-semibold">
            {user.phone || "Not provided"}
          </span>
        </div>

        <div className="grid grid-cols-[100px_1fr] gap-4 items-start py-1">
          <span className="text-gray-400 flex items-center gap-1.5 font-semibold">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
            Address
          </span>
          <span className="text-gray-800 break-words font-semibold">
            {user.address || "Not provided"}
          </span>
        </div>

        {user.role === "driver" && (
          <div className="grid grid-cols-[100px_1fr] gap-4 items-start py-1">
            <span className="text-gray-400 flex items-center gap-1.5 font-semibold">
              <Truck className="w-4 h-4 text-gray-400 shrink-0" />
              Vehicle
            </span>
            <span className="text-amber-600 break-words font-bold">
              {user.vehicleName || "Not provided"}
            </span>
          </div>
        )}

        <div className="grid grid-cols-[100px_1fr] gap-4 items-start py-1 border-t border-gray-100 pt-3">
          <span className="text-gray-400 flex items-center gap-1.5 font-semibold">
            <Shield className="w-4 h-4 text-gray-400 shrink-0" />
            Verified
          </span>
          <span className="flex items-center gap-1.5">
            {user.verified ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-emerald-600 font-bold">Yes</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-amber-600 font-bold">No</span>
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
