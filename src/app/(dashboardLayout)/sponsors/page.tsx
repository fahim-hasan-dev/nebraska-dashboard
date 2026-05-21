export const dynamic = "force-dynamic";

import SponsorsView from "@/components/page/sponsors/SponsorsView";
import { myFetch } from "@/utils/myFetch";

const SponsorsPage = async () => {
  let initialSponsors: any[] = [];

  try {
    const response = await myFetch("/sponsor?limit=100", {
      method: "GET",
      cache: "no-store", // Ensure server-side fetch is dynamic
    });

    if (response.success && Array.isArray(response.data)) {
      initialSponsors = response.data;
    }
  } catch (error) {
    console.error("Error fetching initial sponsors on server-side:", error);
  }

  return (
    <>
      <SponsorsView initialSponsors={initialSponsors} />
    </>
  );
};

export default SponsorsPage;

