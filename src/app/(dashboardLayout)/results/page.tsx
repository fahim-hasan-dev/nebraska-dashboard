import ResultsView from "@/components/page/results/ResultsView";
import { demoResultsData } from "@/demoData/results";

const ResultsPage = async () => {
  return (
    <>
      <ResultsView results={demoResultsData as never[]} />
    </>
  );
};

export default ResultsPage;

