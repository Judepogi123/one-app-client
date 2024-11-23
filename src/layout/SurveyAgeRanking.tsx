//import { useParams } from "react-router-dom";
import { AgeBracket } from "../interface/data";
//graphql
// import { OPTION_AGE_RANK } from "../GraphQL/Queries";
// import { useQuery } from "@apollo/client";

//layout
import SurveyAgeOption from "./SurveyAgeOption";
//props
interface SurveyAgeRankingProps {
  ageList: AgeBracket[];
  queryId: string;
  selectedBaragnay: string
  selectGender: string
}
const SurveyAgeRanking = ({ ageList,queryId,selectedBaragnay,selectGender}: SurveyAgeRankingProps) => {
 
  return (
    <div className="w-full h-auto flex flex-col gap-2 mt-2">
      {ageList.map((item) => (
        <SurveyAgeOption age={item} queryId={queryId} selectedBaragnay={selectedBaragnay} selectGender={selectGender} />
      ))}
    </div>
  );
};

export default SurveyAgeRanking;
