import { useParams,useNavigate } from "react-router-dom";
import { useState } from "react";
//ui
import { Button } from "../components/ui/button";
import Modal from "../components/custom/Modal";
import { toast } from "sonner";
//props
import { AgeBracket, GenderProps, BarangayProps } from "../interface/data";

export interface RespondentResponseByIdProps {
  id: string;
  age: AgeBracket;
  genderId: string;
  gender: GenderProps;
  barnagay: BarangayProps;
  responses: {
    queryId: string;
    id: string;
    queries: {
      id: string;
      queries: string;
    };
    option: {
      queryId: string;
      desc: string;
      id: string;
      title: string;
    }[];
  }[];
}

//graphql
import { useQuery, useMutation } from "@apollo/client";
import { REMOVE_RESPONSE } from "../GraphQL/Mutation";
import { RESPONSE_INFO,SURVEY_RESPONSE_INFO } from "../GraphQL/Queries";
//icons
import { MdDeleteOutline } from "react-icons/md";
const ResponseRespondent = () => {
  const [onDelete, setOnDelete] = useState<boolean>(false);
  const navigate = useNavigate()
  const { responseID, surveyResponseID } = useParams();

  const { data, loading } = useQuery<{
    getRespondentResponseById: RespondentResponseByIdProps;
  }>(RESPONSE_INFO, {
    variables: {
      id: responseID,
    },
  });

  const [removeResponse, {loading: removeIsLoading}] = useMutation(REMOVE_RESPONSE, {
    refetchQueries: [SURVEY_RESPONSE_INFO],
    variables: { id: surveyResponseID },
  });

  const handleRemoveResponse = async()=>{
    try {
      const response = await removeResponse({
        variables: {
          id: data?.getRespondentResponseById.id
        }
      })
      if(response.data){
        history.back()
        setOnDelete(false)
      }
    } catch (error) {
      toast("An error occured.")
    }
  }

  const groupOptionsByQueryId = () => {
    if (
      !data ||
      !data.getRespondentResponseById ||
      !data.getRespondentResponseById.responses
    ) {
      return null; // Return null if data is not available yet
    }

    // Create a map to group responses by `queryId`
    const groupedResponses = data.getRespondentResponseById.responses.reduce(
      (acc, responses) => {
        const { queryId, queries, option } = responses;

        // If the queryId is already in the accumulator, merge options
        if (acc[queryId]) {
          acc[queryId].option = [...acc[queryId].option, ...option];
        } else {
          // If not, add the response with its options
          acc[queryId] = {
            queryId,
            id: responses.id,
            queries,
            option: [...option], // Add options
          };
        }

        return acc;
      },
      {} as Record<string, RespondentResponseByIdProps["responses"][0]>
    );

    // Convert groupedResponses object back into an array
    return Object.values(groupedResponses);
  };

  // Example usage
  const groupedData = groupOptionsByQueryId();

  if (loading) {
    return (
      <div className="w-full h-1/2 grid">
        <h1 className="m-auto">Loading...</h1>
      </div>
    );
  }

  if (!data || !data.getRespondentResponseById) {
    return (
      <div className="w-full h-1/2 grid">
        <h1 className="m-auto">No data found</h1>
      </div>
    );
  }

  return (
    <div className="w-full h-auto">
      <div className="w-full p-2 flex justify-between">
        <div className="w-auto flex gap-4">
          <div className="flex w-auto gap-2 items-center">
            <h1 className="text-sm">Age:</h1>
            <h1 className="font-medium text-sm">
              {data.getRespondentResponseById.age.segment}
            </h1>
          </div>

          <div className="flex w-auto gap-2 items-center">
            <h1 className="text-sm">Gender:</h1>
            <h1 className="font-medium text-sm">
              {data.getRespondentResponseById.gender.name}
            </h1>
          </div>
        </div>

        <Button onClick={() => setOnDelete(true)} variant="outline" size="sm">
          <MdDeleteOutline />
        </Button>
      </div>

      <div className="w-full p-2 flex flex-col gap-2">
        {groupedData?.map((response, i) => (
          <div
            key={response.id}
            className="w-full p-3 border rounded-sm border-gray-400 bg-white"
          >
            <h3>
              {i + 1}. {response.queries.queries}
            </h3>
            <ul className="flex flex-col">
              {response.option.map((opt) => (
                <li key={opt.id} className="font-medium">
                  ✅{opt.title}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <Modal
        title="Delete response"
        footer={true}
        onFunction={handleRemoveResponse}
        loading={removeIsLoading}
        children={
          <div className="">
            <h1 className="">
              Are you sure you want to delete this response? This cannot be
              recovery afterwards?
            </h1>
          </div>
        }
        open={onDelete}
        onOpenChange={() => setOnDelete(false)}
      />
    </div>
  );
};

export default ResponseRespondent;
