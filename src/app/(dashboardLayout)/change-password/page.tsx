export const dynamic = "force-dynamic";

import ChangePasswordTab from "@/components/page/profile/ChangePasswordTab";

export default function ChangePasswordPage() {
  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm max-w-screen-md mx-auto my-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Change Password</h1>
        <p className="text-gray-500 text-sm mt-1">
          Keep your account secure by updating your password regularly.
        </p>
      </div>
      <ChangePasswordTab />
    </div>
  );
}
