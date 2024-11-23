import { useEffect, useState } from "react";

//graphql
import { GET_OPTION_AGE_COUNT } from "../../GraphQL/Queries";
import { useQuery } from "@apollo/client";
//components
import Progress from "../custom/Progress";
//props
import { AgeBracket } from "../../interface/data";

interface SurveyAgeResponseProps {
  age: AgeBracket;
  selectedOption: string;
}

const SurveyAgeResponse = ({ age, selectedOption }: SurveyAgeResponseProps) => {
  const { data, loading, error, refetch } = useQuery<{
    optionCountAge: number;
  }>(GET_OPTION_AGE_COUNT, {
    variables: {
      optionId: selectedOption,
      ageBracketId: age.id,
    },
  });

  useEffect(() => {
    refetch();
  }, [selectedOption]);

  if (!data?.optionCountAge) {
    return;
  }

  const { optionCountAge } = data;
  return (
    <div className="w-full p-2 border border-gray-400 bg-white">
      <div className="w-full flex justify-between">
        <h1 className="font-semibold text-lg">{age.segment}</h1>
        <h1>{optionCountAge}/</h1>
      </div>

      <Progress value={optionCountAge} max={1000} />
    </div>
  );
};

export default SurveyAgeResponse;
