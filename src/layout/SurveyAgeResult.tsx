import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { Select,SelectContent,SelectItem,SelectTrigger,SelectValue } from "../components/ui/select";
// Props
import { SurveyAgeCountProps } from "../interface/data";

interface SurveyAgeResultProps {
  ageData: SurveyAgeCountProps[]; // Array of SurveyAgeCountProps
}

type DataList = (string | number)[][];

const SurveyAgeResult = ({ ageData }: SurveyAgeResultProps) => {
    
  const [ageDataList, setDataList] = useState<DataList>([]);

  const main = async () => {
    try {
      // Map to a 2D array, not a 3D array
      const temp: DataList = ageData.map((item) => [
        `${item.segment} - (${item.surveyAgeCount})`,
        item.surveyAgeCount,
      ]);
      
      temp.unshift(["Segment", "Count"]);

      setDataList(temp);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    main();
  }, [ageData]);

  const options = {
    title: "Survey Age Distribution",
  };

  return (
    <div className="w-full h-auto border">
        <div className=""></div>
      <Chart
        chartType="PieChart"
        data={ageDataList}
        options={options}
        width={"100%"}
        height={"400px"}
        style={{
            backgroundColor: "red"
        }}
      />
    </div>
  );
};

export default SurveyAgeResult;
