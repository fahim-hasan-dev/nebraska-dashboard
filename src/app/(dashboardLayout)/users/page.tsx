export const dynamic = "force-dynamic";

import UsersTable from "@/components/page/users/UsersTable";
import { myFetch } from "@/utils/myFetch";

interface UsersPageProps {
  searchParams: Promise<{
    role?: string;
    searchTerm?: string;
    page?: string;
  }>;
}

const UsersPage = async ({ searchParams }: UsersPageProps) => {
  const { role, searchTerm, page } = await searchParams;

  // Build query parameters for the backend request
  const queryParams = new URLSearchParams();
  if (role) queryParams.append("role", role);
  if (searchTerm) queryParams.append("searchTerm", searchTerm);
  if (page) queryParams.append("page", page);
  queryParams.append("limit", "10");

  let users = [];
  let meta = { page: 1, totalPage: 1, total: 0, limit: 10 };

  try {
    // Fetch users from backend api
    const res = await myFetch(`/user?${queryParams.toString()}`, {
      method: "GET",
    });

    if (res.success && res.data) {
      users = res.data.users || [];
      meta = res.pagination || res.data.meta || {
        page: Number(page) || 1,
        totalPage: 1,
        total: users.length,
        limit: 10,
      };
    }
  } catch (error) {
    console.error("Error fetching users in UsersPage:", error);
  }

  return (
    <>
      <UsersTable
        users={users}
        meta={meta}
        filters={{ role, searchTerm }}
      />
    </>
  );
};

export default UsersPage;
