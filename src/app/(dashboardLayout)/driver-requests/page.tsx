import DriverRequestsView from "@/components/page/driver-requests/DriverRequestsView";
import { demoDriverRequestsData } from "@/demoData/driverRequests";

const DriverRequestsPage = async () => {
  return (
    <>
      <DriverRequestsView requests={demoDriverRequestsData as never[]} />
    </>
  );
};

export default DriverRequestsPage;

