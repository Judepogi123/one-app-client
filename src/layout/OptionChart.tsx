import { Chart } from "react-google-charts";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

//props
import { AgeBracket, GenderProps, SurveyOptionProps } from "../interface/data";
//graphql
import { OPTION_AGE_RANK, SURVEY_OPTION_RANK } from "../GraphQL/Queries";
import { useQuery } from "@apollo/client";

//
import OptionAgeItem from "../components/item/OptionAgeItem";

interface OptionChartProps {
  responseList: SurveyOptionProps[];
  title: string;
  queryId: string;
  ageList: AgeBracket[];
  selectedBaragnay: string;
  selectGender: string;
  selectedMunicipal: string;
  type: string;
  genderList: GenderProps[]
}
type DataList = (string | number)[][];
const OptionChart = ({
  responseList,
  title,
  queryId,
  ageList,
  selectedBaragnay,
  selectGender,
  selectedMunicipal,
  type,
  genderList
}: OptionChartProps) => {
  const [dataList, setResponseList] = useState<DataList>([]);

  const handleGetPlus = ()=> {
    const copy = [...responseList]
    return copy.filter((item)=> item.forAll)[0].overAllResponse
  }
  const main = () => {
    try {
      const temp: DataList = responseList.map((item, index) => [
        `${item.title} - (${item.overAllResponse})`,
        item.overAllResponse,
      ]);

      // Add the header row
      temp.unshift(["Option", "Responses"]);

      // Update the state with the new response list
      setResponseList(temp);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    main();
  }, [responseList]);

  const options = {
    title: title,
    titleTextStyle: {
      fontSize: 20,
      bold: true,
      color: "#333",
    },
    legend: {
      textStyle: {
        fontSize: 20,
        color: "#555",
      },
      position: "right",
    },
  };

  return (
    <div className="w-full ">
      <Chart
        chartType="PieChart"
        data={dataList}
        options={options}
        width={"100%"}
        height={"400px"}
        style={{
          backgroundColor: "red",
        }}
      />
      <div className="w-full h-auto flex flex-col gap-3">
        {responseList && responseList.map((item,index) => (
          <div
            key={item.id}
            className=" w-full px-2 border border-gray-600 rounded"
          >
            <div className="w-full p-2 rounded flex gap-2 bg-blue-200">
              <h1 className="text-lg font-medium">{index + 1}.</h1>
              <h1 className="text-gray-950 text-lg font-medium">
                {item.title} ({item.overAllResponse})
              </h1>
            </div>
            <div className="w-full h-auto flex gap-1 mt-2 py-2">
              {ageList.map((age) => (
                <OptionAgeItem
                genderList={genderList}
                  overAll={item.overAllResponse}
                  selectGender={selectGender}
                  selectedBaragnay={selectedBaragnay}
                  selectedMunicipal={selectedMunicipal}
                  queryId={queryId}
                  optionId={item.id}
                  age={age}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OptionChart;
