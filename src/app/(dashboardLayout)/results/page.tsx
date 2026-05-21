export const dynamic = "force-dynamic";

import ResultsView from "@/components/page/results/ResultsView";
import { myFetch } from "@/utils/myFetch";

const ResultsPage = async () => {
  let initialEvents: any[] = [];
  let initialDrivers: any[] = [];

  try {
    const eventsRes = await myFetch("/event?limit=100&fields=_id,name,class", {
      method: "GET",
      cache: "no-store",
    });
    if (eventsRes.success && eventsRes.data) {
      initialEvents = Array.isArray(eventsRes.data) ? eventsRes.data : (eventsRes.data.data || []);
    }
  } catch (error) {
    console.error("Error fetching initial events on server-side:", error);
  }

  try {
    const driversRes = await myFetch("/user?role=driver&limit=100&fields=_id,email,fullName,vehicleName", {
      method: "GET",
      cache: "no-store",
    });
    if (driversRes.success && driversRes.data) {
      initialDrivers = Array.isArray(driversRes.data) ? driversRes.data : (driversRes.data.data || []);
    }
  } catch (error) {
    console.error("Error fetching initial drivers on server-side:", error);
  }

  return (
    <>
      <ResultsView initialEvents={initialEvents} initialDrivers={initialDrivers} />
    </>
  );
};

export default ResultsPage;

