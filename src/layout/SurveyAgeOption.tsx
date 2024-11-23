import { useEffect } from "react";
import { useParams } from "react-router-dom";
//import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
//props
import { AgeBracket } from "../interface/data";
//props
import { OPTION_AGE_RANK } from "../GraphQL/Queries";
import { useQuery } from "@apollo/client";

interface SurveyAgeOptionProps {
  age: AgeBracket;
  queryId: string;
  selectedBaragnay: string;
  selectGender: string;
}

interface OptionProps {
  id: string;
  ageCountRank: number;
  title: string;
  fileUrl: {
    url: string;
    id: string;
  };
}

interface QueryProps {
  id: string;
  options: OptionProps[];
}

const SurveyAgeOption = ({
  age,
  queryId,
  selectedBaragnay,
  selectGender,
}: SurveyAgeOptionProps) => {
  const { surveyID } = useParams();
  const { data, refetch } = useQuery<{ queries: QueryProps }>(
    OPTION_AGE_RANK,
    {
      variables: {
        id: surveyID,
        ageBracketId: age.id,
        queryId: queryId,
        barangayId: selectedBaragnay,
        genderId: selectGender,
      },
    }
  );

  useEffect(() => {
    refetch();
  }, [selectGender]);

  if (!data) {
    return;
  }

  const sortedOptions = [...data.queries.options]
    .sort((a, b) => b.ageCountRank - a.ageCountRank);

  return (
    <div className="w-full p-2 border border-gray-400 bg-white">
      <div className="w-full flex justify-between">
        <h1 className="font-semibold text-lg">{age.segment}</h1>
      </div>

      <div className="w-full flex gap-2">
        {sortedOptions.map((item, i) => (
          <div className="w-auto max-w-40 p-2 border border-gray-500 rounded">
            <div className="w-full p-1">
              <h1 className="w-auto text-center text-lg font-semibold border rounded-full bg-blue-400 text-white">
                {i + 1}
              </h1>
            </div>
            <div className="w-full py-1">
              <h1 className="text-center text-lg">{item.title}</h1>
            </div>
            <div>
              <h1 className="font-medium text-lg text-center">
                ({item.ageCountRank})
              </h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SurveyAgeOption;
