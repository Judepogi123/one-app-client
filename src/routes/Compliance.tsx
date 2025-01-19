/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// GraphQL
import { useQuery, useMutation } from "@apollo/client";
import { SURVEY_RESPONSE_LIST, GET_MUNICIPALS } from "../GraphQL/Queries";
import {
  RESET_SURVEY_RESPONSE,
  SUBMIT_ALL_RESPONSE,
} from "../GraphQL/Mutation";
// UI Components
import {
  Table,
  TableBody,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
} from "../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  CustomOption,
  MunicipalProps,
  QueryResponseProps,
  RespondentResponse,
  SurveyResponse,
  SurveyResponseProps,
} from "../interface/data";
import { Button } from "../components/ui/button";
import Modal from "../components/custom/Modal";
//utils
import { formatTimestamp } from "../utils/date";

//icons
import { FiRefreshCw } from "react-icons/fi";
import { toast } from "sonner";
import { Input } from "../components/ui/input";
import { MdDeleteOutline } from "react-icons/md";
const Compliance = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { surveyID } = useParams();
  const navigate = useNavigate();
  const {
    data: munData,
    loading: municipalLoading,
    error: municipalError,
  } = useQuery<{ municipals: MunicipalProps[] }>(GET_MUNICIPALS);

  const [resetSurveyResponse, { loading: resetIsLoading }] = useMutation(
    RESET_SURVEY_RESPONSE
  );

  const [harvestResponse, { loading: submitting }] = useMutation(
    SUBMIT_ALL_RESPONSE,
    {
      onError: (error) => toast(error.message),
      onCompleted: () => toast("JSON file successfullly uploaded!"),
    }
  );

  const [selectedMun, setSelectedMun] = useState<number | undefined>(undefined);
  const [onReset, setOnReset] = useState<boolean>(false);
  const [onOpen, setOnOpen] = useState(0);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      console.log(event.target.files[0]);
    }
  };

  const handleResetResponse = async () => {
    if (!selectedMun || !surveyID) {
      toast("Required data not found.");
      return;
    }
    try {
      const response = await resetSurveyResponse({
        variables: {
          id: surveyID,
          zipCode: selectedMun,
        },
      });
      if (response.data) {
        refetch();
        toast("Success!");
        setOnReset(false);
      }
    } catch (error) {
      toast("An error occured!");
    }
  };

  if (municipalError) {
    return (
      <div className="">
        <h1>Required data unfound!</h1>
      </div>
    );
  }

  useEffect(() => {
    if (munData && munData.municipals.length > 0) {
      setSelectedMun(munData.municipals[0].id);
    }
  }, [munData]);

  const { data, loading, refetch } = useQuery<{
    allSurveyResponse: SurveyResponseProps[];
  }>(SURVEY_RESPONSE_LIST, {
    variables: {
      survey: {
        municipalsId: selectedMun,
        surveyId: surveyID,
      },
    },
    skip: !selectedMun,
  });

  useEffect(() => {
    if (selectedMun) {
      refetch({
        municipalsId: selectedMun,
      });
    }
  }, [selectedMun]);

  const handleChangeSelected = (value: string) => {
    setSelectedMun(parseInt(value, 10));
  };

  const handleImportJsonFile = async () => {
    if (!selectedFile) {
      toast("No file selected. Please choose a file.");
      return;
    }

    try {
      const fileReader = new FileReader();

      fileReader.onload = async (event) => {
        try {
          const fileContent = event.target?.result;
          if (typeof fileContent === "string") {
            const jsonData: {
              customOptions: CustomOption[];
              respondentResponse: RespondentResponse[];
              surveys: SurveyResponse[];
              getAllResponse: QueryResponseProps[];
            } = JSON.parse(fileContent);
            await harvestResponse({
              variables: {
                surveyResponse: jsonData.surveys
                  .filter((item) => item.account_id !== null)
                  .map((survey) => {
                    console.log({
                      id: survey.id,
                      surveyId: survey.survey_id,
                      barangaysId: survey.barangay_id,
                      municipalsId: parseInt(survey.municipal_id),
                      accountID: survey.account_id,
                    });

                    return {
                      id: survey.id,
                      surveyId: survey.survey_id,
                      barangaysId: survey.barangay_id,
                      municipalsId: parseInt(survey.municipal_id),
                      accountID: survey.account_id,
                    };
                  }),
                respondentResponse: jsonData.respondentResponse.map(
                  (respondent) => ({
                    id: respondent.id,
                    municipalsId: respondent.municipal_id,
                    barangaysId: respondent.barangay_id,
                    surveyId: respondent.survey_id,
                    genderId: respondent.gender_id,
                    ageBracketId: respondent.ageBracket_id,
                    surveyResponseId: respondent.surveyResponse_id,
                    accountID: respondent.account_id,
                  })
                ),
                response: jsonData.getAllResponse.map((response) => ({
                  id: response.id,
                  municipalsId: response.municipal_id,
                  barangaysId: response.barangay_id,
                  surveyId: response.survey_id,
                  genderId: response.gender_id,
                  ageBracketId: response.ageBracket_id,
                  surveyResponseId: response.surveyResponse_id,
                  optionId: response.option_id,
                  queryId: response.queries_id,
                  respondentResponseId: response.respondentResponse_id,
                })),
                customOptions: jsonData.customOptions
                  .filter((item) => item.respondentResponse_id !== null)
                  .map((option) => {
                    return {
                      id: option.id,
                      value: option.value,
                      queriesId: option.queriesId,
                      respondentResponseId: option.respondentResponse_id,
                    };
                  }),
              },
            });
          } else {
            throw new Error("Invalid file content");
          }
        } catch (error) {
          toast("Invalid JSON file.");
          console.error("Error parsing JSON:", error);
        }
      };

      fileReader.onerror = () => {
        toast("Error reading file.");
      };

      fileReader.readAsText(selectedFile); // Read the file content as text
    } catch (error) {
      toast("An error occurred while importing the file.");
      console.error("File import error:", error);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center">
        <h1 className="font-semibold text-lg text-gray-600">Loading...</h1>
      </div>
    );
  }

  if (!data) {
    return;
  }

  return (
    <div className="w-full h-auto">
      <div className=" w-full p-2 py-2 flex gap-2 items-center justify-between">
        <Select
          disabled={municipalLoading}
          value={selectedMun?.toString()} // Set the value of Select
          onValueChange={(value) => handleChangeSelected(value)}
        >
          <SelectTrigger className="w-auto">
            <SelectValue
              placeholder={municipalLoading ? "Loading..." : "Select municipal"}
            />
          </SelectTrigger>
          <SelectContent>
            {munData?.municipals.map((item) => (
              <SelectItem
                className=" cursor-pointer"
                key={item.id}
                value={item.id.toString()}
              >
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="w-auto flex gap-1">
          <Button onClick={()=> setOnReset(true)} size="sm" variant="outline">
            <MdDeleteOutline />
          </Button>
          <Button size="sm" onClick={() => setOnOpen(1)}>
            Import
          </Button>
          <Button
            onClick={() => {
              if (selectedMun) {
                refetch({
                  municipalsId: selectedMun,
                  surveyId: surveyID,
                });
              }
            }}
            size="sm"
            variant="outline"
          >
            <FiRefreshCw />
          </Button>
        </div>
      </div>
      <div className="w-full">
        <Table>
          <TableHeader>
            {[
              "Barangay",
              "Sample size",
              "Response",
              "Submitted at",
              "Submitted by",
            ].map((header) => (
              <TableHead key={header}>{header}</TableHead>
            ))}
          </TableHeader>
          <TableBody>
            {data?.allSurveyResponse.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  No response found!
                </TableCell>
              </TableRow>
            ) : (
              [...data.allSurveyResponse].reverse().map((item) => (
                <TableRow
                  onClick={() => navigate(`${item.id}`)}
                  className=" cursor-pointer hover:bg-slate-200"
                >
                  <TableCell>{item.barangay.name}</TableCell>
                  <TableCell>{item.barangay.sampleSize}</TableCell>
                  <TableCell>{item.respondentResponses.length}</TableCell>
                  <TableCell>{formatTimestamp(item.timestamp)}</TableCell>
                  <TableCell className=" hover:underline">
                    {item.users.username}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <Modal
        title="Reset/Remove all the response in this survey?"
        footer={true}
        onFunction={handleResetResponse}
        open={onReset}
        children={
          <div className="w-full h-auto">
            <h1 className="text-sm font-medium mb-2">Enter password</h1>
            <Input placeholder="Enter password to proceed" />
          </div>
        }
        onOpenChange={() => {
          if (resetIsLoading) {
            return;
          }
          setOnReset(false);
        }}
      />
      <Modal
        loading={submitting}
        title="Import JSON file"
        children={
          <Input type="file" accept=".json" onChange={handleFileChange} />
        }
        open={onOpen === 1}
        onFunction={handleImportJsonFile}
        onOpenChange={() => {
          if (submitting) return;
          setSelectedFile(null);
          setOnOpen(0);
        }}
        footer={true}
      />
    </div>
  );
};

export default Compliance;
