import { useParams, useNavigate } from "react-router-dom";

//ui
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "../components/ui/table";

//Graphql
import { useQuery } from "@apollo/client";
import { SURVEY_RESPONSE_INFO } from "../GraphQL/Queries";

//typs
import { SurveyResponseProps } from "../interface/data";

const RespondentResponse = () => {
  const { surveyResponseID,responseID} = useParams();
  const navigate = useNavigate()
  const { data, loading, error } = useQuery<{
    surveyResponseInfo: SurveyResponseProps | null;
  }>(SURVEY_RESPONSE_INFO, {
    variables: {
      id: surveyResponseID,
    },
  });

  const handleNavigateRespondent = ()=>{
    
  }

  if (loading) {
    return (
      <div className="w-full h-full grid place-content-center">
        <h1>Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen grid place-content-center">
        <h1>Something went wrong fetching required data.</h1>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full h-screen grid place-content-center">
        <h1>No Data found with selected survey response.</h1>
      </div>
    );
  }

  const { surveyResponseInfo } = data;

  return (
    <div className="w-full h-auto p-4">
      <div className="w-full p-2 border border-slate-400 rounded grid grid-cols-1 lg:grid-cols-4 gap-2">
        <div className="w-auto flex gap-2">
          <h1>Barangay: </h1>
          <h1 className="font-medium">{surveyResponseInfo?.barangay.name}</h1>
        </div>

        <div className="w-auto flex gap-2">
          <h1>No. of voters: </h1>
          <h1 className="font-medium">
            {surveyResponseInfo?.barangay.population}
          </h1>
        </div>

        <div className="w-auto flex gap-2">
          <h1>Sample size: </h1>
          <h1 className="font-medium">
            {surveyResponseInfo?.barangay.sampleSize}
          </h1>
        </div>

        <div className="w-auto flex gap-2">
          <h1>No. of response: </h1>
          <h1 className="font-medium">
            {surveyResponseInfo?.respondentResponses.length}
          </h1>
        </div>
      </div>

      <Table className=" mt-2">
        <TableHeader className="border">
          {["Age bracket", "Segment"].map((item) => (
            <TableHead>{item}</TableHead>
          ))}
        </TableHeader>

        <TableBody>
          {surveyResponseInfo?.respondentResponses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center">
                No response found!
              </TableCell>
            </TableRow>
          ) : (
            surveyResponseInfo?.respondentResponses.map((item,i) => (
              <TableRow key={item.id} className="cursor-pointer" onClick={()=> navigate(`${item.id}`)}>
                <TableCell className="flex gap-3">{i +1}. <h1 className="font-medium">{item.age.segment}</h1> </TableCell>
                <TableCell>{item.gender.name}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RespondentResponse;
