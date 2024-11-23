import { useEffect } from "react";
import { useParams } from "react-router-dom";
//props
import { AgeBracket, GenderProps, OptionProps } from "../../interface/data";
//graphql
import { SURVEY_OPTION_RANK } from "../../GraphQL/Queries";
import { useQuery } from "@apollo/client";
//props
interface OptionAgeItemProps {
  age: AgeBracket;
  optionId: string;
  queryId: string;
  selectedBaragnay: string;
  selectGender: string;
  selectedMunicipal: string;
  overAll: number;
  genderList: GenderProps[];
}

interface OptionGenderItemProps {
  optionId: string;
  queryId: string;
  selectedBaragnay: string;
  selectGender: string;
  selectedMunicipal: string;
  gender: GenderProps;
  surveyID: string | undefined;
  ageId: string
  genderOverAll: number
}

const OptionAgeItem = ({
  age,
  optionId,
  queryId,
  selectedBaragnay,
  selectGender,
  selectedMunicipal,
  overAll,
  genderList,
}: OptionAgeItemProps) => {
  const { surveyID } = useParams();
  const { data, loading } = useQuery<{ optionRank: number }>(
    SURVEY_OPTION_RANK,
    {
      variables: {
        queryId: queryId,
        surveyId: surveyID,
        zipCode: parseInt(selectedMunicipal, 10) || 4905,
        barangayId: selectedBaragnay,
        genderId: selectGender,
        optionId: optionId,
        ageBracketId: age.id,
      },
    }
  );

  if (loading) {
    return (
      <div className="w-full p-2">
        <h1 className="text-gray-500">Loading...</h1>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const getPercentage = () => {
    if (!overAll || overAll === 0) return 0;
    return ((data.optionRank / overAll) * 100).toFixed(2);
  };

  return (
    <div className="w-full p-2 border border-gray-400">
      <div className="w-auto">
        <h1 className="font-semibold text-xl p-2 bg-blue-400 w-auto rounded">
          {age.segment}
        </h1>
        <div className="w-full">
          <h1 className="font-semibold text-lg">Respondents: {data.optionRank}</h1>
          <h1 className="text-lg font-medium text-gray-700">
            Percentage: {getPercentage()}%
          </h1>
        </div>
      </div>

      <div className="w-full flex justify-between mt-2">
        {genderList.map((item) => (
          <GenderItem
          genderOverAll={data.optionRank as number}
          ageId={age.id}
            key={item.id}
            gender={item}
            selectGender={selectGender}
            selectedBaragnay={selectedBaragnay}
            selectedMunicipal={selectedMunicipal}
            queryId={queryId}
            optionId={optionId}
            surveyID={surveyID}
          />
        ))}
      </div>
    </div>
  );
};

export default OptionAgeItem;

const GenderItem = ({
  optionId,
  queryId,
  selectedBaragnay,
  selectedMunicipal,
  surveyID,
  gender,
  ageId,
  genderOverAll
}: OptionGenderItemProps) => {
  const { data, loading } = useQuery<{ optionGenderRank: number }>(
    SURVEY_OPTION_RANK,
    {
      variables: {
        queryId: queryId,
        surveyId: surveyID,
        zipCode: parseInt(selectedMunicipal, 10) || 4905,
        barangayId: selectedBaragnay,
        genderId: gender.id,
        optionId: optionId,
        ageBracketId: ageId
      },
    }
  );
  const getPercentage = () => {
    if (!genderOverAll || genderOverAll === 0 || !data) return 0;
    return ((data.optionGenderRank / genderOverAll) * 100).toFixed(2);
  };

  if(loading){
    return (
      <div className="w-full">
        <h1>Loading...</h1>
      </div>
    )
  }
  return (
    <div key={gender.id} className="w-full flex gap-1">
      <h1>{gender.name}:</h1>
      <h1 className=" font-semibold"> {data?.optionGenderRank} ({getPercentage()}%)</h1>
    </div>
  );
};
