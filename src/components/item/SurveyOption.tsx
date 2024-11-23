import { useState } from "react";
import SurveyAgeResponse from "./SurveyAgeResponse";
//props
import { QueryProps, AgeBracket } from "../../interface/data";

//layout
import SurveyAgeRanking from "../../layout/SurveyAgeRanking";

interface SurveyOptionProps {
  query: QueryProps;
  ageList: AgeBracket[];
  selectedBaragnay: string;
  selectGender: string
}

const SurveyOption = ({
  query,
  ageList,
  selectedBaragnay,
  selectGender
}: SurveyOptionProps) => {
  const [selectedOption, setSelectedOption] = useState<string>("all");

  const handleSelectedOption = (value: string) => {
    setSelectedOption(value);
  };
  return (
    <div className="w-full h-auto bg-slate-200 p-3">
      <div className="w-full flex gap-2 px-2">
        <div
          onClick={() => handleSelectedOption("all")}
          className={`w-auto max-w-60 p-2 border border-gray-500 rounded cursor-pointer truncate text-ellipsis px-2 ${
            selectedOption === "all" ? "bg-blue-300" : `bg-white`
          }`}
        >
          <h1 className="font-medium text-lg text-[#333]">All</h1>
        </div>
        {query.options.map((item) => (
          <div
            key={item.id}
            onClick={() => handleSelectedOption(item.id)}
            className={`w-auto max-w-60 p-2 border border-gray-500 rounded cursor-pointer truncate text-ellipsis px-2 ${
              selectedOption === item.id ? "bg-blue-300" : `bg-white`
            }`}
          >
            <h1 className="font-medium text-lg text-[#333]">{item.title}</h1>
          </div>
        ))}
      </div>
      {selectedOption === "all" ? (
        <div className="w-full">
          <SurveyAgeRanking
            ageList={ageList}
            queryId={query.id}
            selectedBaragnay={selectedBaragnay}
            selectGender={selectGender}
          />
        </div>
      ) : (
        <div className="w-full flex flex-col gap-1 px-2 mt-2 rounded">
          {ageList.map((item) => (
            <SurveyAgeResponse selectedOption={selectedOption} age={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SurveyOption;
