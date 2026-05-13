import SponsorApplicationsView from "@/components/page/sponsor-applications/SponsorApplicationsView";
import { demoSponsorApplicationsData } from "@/demoData/sponsorApplications";

const SponsorApplicationsPage = async () => {
  return (
    <>
      <SponsorApplicationsView applications={demoSponsorApplicationsData as never[]} />
    </>
  );
};

export default SponsorApplicationsPage;
