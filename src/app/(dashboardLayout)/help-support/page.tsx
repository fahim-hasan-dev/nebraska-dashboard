import HelpSupportView from "@/components/page/help-support/HelpSupportView";
import { demoHelpSupportData } from "@/demoData/helpSupport";

const HelpSupportPage = async () => {
  return (
    <>
      <HelpSupportView tickets={demoHelpSupportData as never[]} />
    </>
  );
};

export default HelpSupportPage;
