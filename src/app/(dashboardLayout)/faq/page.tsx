import FaqView from "@/components/page/faq/FaqView";
import { demoFaqData } from "@/demoData/faq";

const FAQPage = async () => {
  return (
    <>
      <FaqView faqs={demoFaqData} />
    </>
  );
};

export default FAQPage;
