import { ALL_SURVEY_LIST } from "../GraphQL/Queries";
// import { useState } from "react";
//props
import { SurveyInfoProps } from "../interface/data";
//graphql
import { useQuery } from "@apollo/client";
//ui
import { Skeleton } from "../components/ui/skeleton";

//utils
import { formatTimestamp } from "../utils/date";

interface SurveyListProps {
  setSelectedSurvey: React.Dispatch<
    React.SetStateAction<{
      id: string;
      title: string | undefined;
    } | null>
  >;
}

const SurveyList = ({ setSelectedSurvey }: SurveyListProps) => {
  const { data, loading } = useQuery<{ surveyList: SurveyInfoProps[] }>(
    ALL_SURVEY_LIST
  );

  const handleSelectSurvey = (id: string, title: string) => {
    setSelectedSurvey({ id, title });
  };
  if (!data) {
    return;
  }

  const { surveyList } = data;
  return (
    <div className="w-full h-auto flex flex-col gap-1">
      {loading ? (
        <>
          <Skeleton className="w-full h-12" />
        </>
      ) : (
        surveyList.map((item) => (
          <div
            key={item.id}
            className="w-full h-auto flex justify-between p-2 border rounded border-gray-500 cursor-pointer hover:bg-slate-200"
            onClick={()=> handleSelectSurvey(item.id, item.name as string)}
          >
            <div className="w">
              <h1 className="text-lg font-medium">{item.name}</h1>
              <h1>{item.tagID}</h1>
            </div>
            <h1>{formatTimestamp(item.timestamp)}</h1>
          </div>
        ))
      )}
    </div>
  );
};

export default SurveyList;
