import { Chart } from "react-google-charts";
import { useState, useEffect } from "react";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
//import { useParams } from "react-router-dom";

//props
import {
  AgeBracket,
  CustomOptionProps,
  GenderProps,
  SurveyOptionProps,
} from "../interface/data";
//graphql
// import { OPTION_AGE_RANK, SURVEY_OPTION_RANK } from "../GraphQL/Queries";
// import { useQuery } from "@apollo/client";

//
import OptionAgeItem from "../components/item/OptionAgeItem";
//import { calculatePercentage } from "../utils/helper";

interface OptionChartProps {
  responseList: SurveyOptionProps[];
  title: string;
  queryId: string;
  ageList: AgeBracket[];
  selectedBaragnay: string;
  selectGender: string;
  selectedMunicipal: string;
  type: string;
  genderList: GenderProps[];
  withCustomOption: boolean;
  customOptions: CustomOptionProps[];
  queryType: string;
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
  genderList,
  customOptions,
  withCustomOption,
  queryType,
}: OptionChartProps) => {
  const [dataList, setResponseList] = useState<DataList>([]);
  const [customDataList, setCustomDataList] = useState<DataList>([]);
  const [hideLastOption, setHideLastOption] = useState(false);

  // const handleGetPlus = ()=> {
  //   const copy = [...responseList]
  //   return copy.filter((item)=> item.forAll)[0].overAllResponse
  // }

  const handleGroupDuplicate = () => {
    const grouped: any = {};

    customOptions.forEach((item) => {
      if (!grouped[item.value]) {
        grouped[item.value] = [];
      }
      grouped[item.value].push(item.value);
    });
    return Object.values(grouped) as string[][];
  };

  const main = () => {
    try {
      const temp: DataList = [...responseList]
        .sort((a, b) => b.overAllResponse - a.overAllResponse)
        .filter((item) => {
          if (hideLastOption) {
            if (queryType !== "Single") {
              return (
                item.title.trim() !== "Wala pa po ako mapili" &&
                item.title.trim() !== "Lahat sila"
              );
            }
          }
          return item;
        })
        .map((item, i) => [
          `${i + 1}. ${item.title} - (${item.overAllResponse})`,
          item.overAllResponse,
        ]);

      const chunk: string[][] = handleGroupDuplicate();
      const data: DataList = chunk.map((item) => [`${item[0]}`, item.length]);
      data.unshift(["Custom Option", "Count"]);
      setCustomDataList(data);

      // Add the header row
      temp.unshift(["Option", "Responses"]);

      setResponseList(temp);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    main();
  }, [responseList, hideLastOption]);

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
    pieSliceText: "percentage",
    sliceVisibilityThreshold: 0,
  };

  return (
    <div className="w-full ">
      {withCustomOption ? (
        <Chart
          chartType="ColumnChart"
          data={customDataList}
          options={options}
          width={"100%"}
          height={"400px"}
        />
      ) : (
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
      )}
      {queryType !== "Single" && (
        <div className="w-full flex justify-end py-8">
          <div className="w-auto flex items-center gap-2">
            <Switch
              id="hideLast"
              checked={hideLastOption}
              onCheckedChange={() => setHideLastOption(!hideLastOption)}
            />
            <Label htmlFor="hideLast">Hide last option</Label>
          </div>
        </div>
      )}

      <div className="w-full h-auto flex flex-col gap-3">
        {responseList &&
          [...responseList]
            .sort((a, b) => {
              return b.overAllResponse - a.overAllResponse;
            })
            .filter((opt) => {
              if (hideLastOption) {
                if (queryType !== "Single") {
                  return (
                    opt.title.trim() !== "Wala pa po ako mapili" &&
                    opt.title.trim() !== "Lahat sila"
                  );
                }
              }

              return opt;
            })
            .map((item, index) => (
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
