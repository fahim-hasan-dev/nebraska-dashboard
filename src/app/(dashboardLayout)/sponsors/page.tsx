import SponsorsView from "@/components/page/sponsors/SponsorsView";
import { demoSponsorsData } from "@/demoData/sponsors";

const SponsorsPage = async () => {
  return (
    <>
      <SponsorsView initialSponsors={demoSponsorsData} />
    </>
  );
};

export default SponsorsPage;

