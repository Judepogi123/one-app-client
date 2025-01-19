import { useParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
//graphql
import { SURVEY_RESULT_INFO, SURVEY_RESPONSE } from "../GraphQL/Queries";
import { useQuery } from "@apollo/client";
// props
import {
  SurveyAgeCountProps,
  SurveyOptionProps,
  SurveyResultProps,
  BarangayProps,
  GenderProps,
  AgeBracket,
  QueryProps,
  MunicipalProps,
  CustomOptionProps,
} from "../interface/data";

// components
import OptionChart from "../layout/OptionChart";
import SurveyOption from "../components/item/SurveyOption";
import SurveyExport from "../layout/SurveyExport";
//chart
import { Chart } from "react-google-charts";
import { useState, useEffect } from "react";
//icons
import { CiExport } from "react-icons/ci";
//layout
import SurveyAgeResult from "../layout/SurveyAgeResult";
import Modal from "../components/custom/Modal";
import { exportPDF } from "../utils/generate";
import { toast } from "sonner";
//import { Item } from "@radix-ui/react-select";
interface SurveyInfoProps {
  id: string;
  tagID: string;
  timestamp: string;
  status: string;
  responseCount: number;
  ageCount: SurveyAgeCountProps[];
  queries: {
    id: string;
    queries: string;
    onTop: boolean;
    access: string;
    type: string;
    options: SurveyOptionProps[];
    withCustomOption: boolean;
    customOption: CustomOptionProps[];
  }[];
}

type DataList = (string | number)[][];

const SurveyResult = () => {
  const { surveyID } = useParams();
  const [barangayResponse, setBarangayResponse] = useState<DataList>([]);
  const [selectedBaragnay, setSelectBarangay] = useState<string>("all");
  const [selectGender, setSelectGender] = useState<string>("all");
  const [onExport, setOnExport] = useState<boolean>(false);
  const [onPresentation, setOnPresentation] = useState(false);
  const [presentationMode, setPresentationMode] = useState(false);
  const [selectedMunicipal, setSelectedMunicipal] = useState<
    string | undefined
  >(undefined);

  const { data, loading, refetch } = useQuery<{
    survey: SurveyInfoProps;
    barangayList: BarangayProps[];
    genderList: GenderProps[];
    ageList: AgeBracket[];
    surveyQueriesList: QueryProps[];
    municipals: MunicipalProps[];
  }>(SURVEY_RESULT_INFO, {
    variables: {
      id: surveyID,
      zipCode: parseInt(selectedMunicipal as string, 10) || 4905,
      barangayId: selectedBaragnay,
      genderId: selectGender,
    },
    fetchPolicy: "no-cache",
  });

  console.log({ data });

  useEffect(() => {
    refetch();
  }, [
    selectedBaragnay,
    refetch,
    surveyID,
    selectGender,
    selectedMunicipal,
    presentationMode,
  ]);

  const { data: responseData, loading: responseIsLoading } = useQuery<{
    barangayList: SurveyResultProps[];
  }>(SURVEY_RESPONSE, {
    variables: {
      zipCode: parseInt(selectedMunicipal as string, 10) || 4905,
      id: surveyID,
    },
    skip: !selectedMunicipal,
  });

  console.log({ responseData });

  useEffect(() => {
    if (!responseData?.barangayList) return;

    const { barangayList } = responseData;

    try {
      const temp: DataList = barangayList.map((item) => [
        item.name, // Barangay name
        item.femaleSize, // Female count
        item.maleSize, // Male count
        item.femaleSize + item.maleSize,
        item.RespondentResponse, // Respondent response count (if available)
      ]);

      // Add the header row
      temp.unshift([
        "Barangay",
        "Female Size",
        "Male Size",
        "Total Gender size",
        "Respondent Response",
      ]);

      // Update state with the new DataList
      setBarangayResponse(temp);
    } catch (error) {
      console.error("Error mapping barangay list:", error);
    }
  }, [responseData, selectedMunicipal, presentationMode]);

  if (loading || responseIsLoading || !data) {
    return <div>Loading...</div>;
  }

  const { survey } = data;

  const options = {
    title: "Barangay responses",
    chartArea: { width: "50%", height: `${barangayResponse.length * 200}px` },
    hAxis: {
      title: `Total responses: ${survey.responseCount}`,
      minValue: 0,
      top: -1000,
      bottom: 10,
    },
    vAxis: {
      title: "Barangay",
    },
    bar: { groupWidth: "80%" },
  };

  const handleSetPresentationMode = async () => {
    setPresentationMode(!presentationMode);
    toast("On Presentation mode");
  };

  if (!survey) {
    return null;
  }

  const { barangayList, genderList, ageList, surveyQueriesList, municipals } =
    data;

  return (
    <div className="w-full h-auto relative">
      <div className="w-full flex items-center gap-2 p-1">
        <Select
          value={selectedMunicipal}
          onValueChange={(value) => setSelectedMunicipal(value)}
          defaultValue={municipals[0].id.toString()}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select municipal" />
          </SelectTrigger>
          <SelectContent>
            {municipals.map((item) => (
              <SelectItem key={item.id} value={item.id.toString()}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setPresentationMode(!presentationMode)}
        >
          {presentationMode ? "On Presenation" : "Present"}
        </Button>
        <Button
          className="w-auto flex gap-2"
          size="sm"
          onClick={() => setOnExport(true)}
        >
          <CiExport />
          Export
        </Button>
        <Button onClick={() => exportPDF(`${data.survey.tagID}.pdf`)}>
          Print
        </Button>
      </div>
      <div className="w-full h-auto">
        {barangayResponse.length > 0 && (
          <Chart
            chartType="BarChart"
            width="100%"
            height="2500px"
            data={barangayResponse} // Use the dynamic barangayResponse
            options={options}
          />
        )}
      </div>
      <div className="w-full p-2 flex items-center gap-2 sticky top-0 bg-white z-10 px-2">
        <Label>Barangay: </Label>
        <Select
          value={selectedBaragnay}
          disabled={loading}
          defaultValue="all"
          onValueChange={(value) => setSelectBarangay(value)}
        >
          <SelectTrigger className="w-auto">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent className="w-auto">
            <SelectItem value="all">All</SelectItem>
            {barangayList.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Label>Gender: </Label>
        <Select
          value={selectGender}
          defaultValue="all"
          onValueChange={(value) => setSelectGender(value)}
        >
          <SelectTrigger className="w-auto">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {genderList.map((item) => (
              <SelectItem value={item.id}>{item.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <SurveyAgeResult ageData={survey.ageCount} />

      <div className="w-full h-auto p-2">
        <h1 className="text-center text-lg font-medium">
          Overall Respondents: {data.survey.responseCount}
        </h1>
      </div>

      <div id="qr-container" className="w-full h-auto flex flex-col gap-2 px-2">
        {survey.queries
          .filter((query) => {
            if (presentationMode) {
              return query.access === "regular" && query.onTop;
            }
            
            return query.onTop;
          })
          .map((item) => (
            <div
              className="w-full p-3 border border-gray-300 bg-white rounded"
              key={item.id}
            >
              <div className="">
                <OptionChart
                  genderList={genderList}
                  type={item.type}
                  selectGender={selectGender}
                  selectedBaragnay={selectedBaragnay}
                  selectedMunicipal={selectedMunicipal as string}
                  ageList={ageList}
                  queryId={item.id}
                  title={item.queries}
                  responseList={item.options}
                  withCustomOption={item.withCustomOption}
                  customOptions={item.customOption}
                  queryType={item.type}
                />
              </div>
            </div>
          ))}
        <div className="w-full py-2">
          <h1 className="font-medium text-xl text-[#333]">Demographics</h1>
        </div>
        {survey.queries
          .filter((item) => !item.onTop)
          .map((item) => (
            <div
              className="w-full p-3 border border-gray-300 bg-white rounded"
              key={item.id}
            >
              <div className="w-full">
                <OptionChart
                  genderList={genderList}
                  type={item.type}
                  selectGender={selectGender}
                  selectedBaragnay={selectedBaragnay}
                  selectedMunicipal={selectedMunicipal as string}
                  ageList={ageList}
                  queryId={item.id}
                  title={item.queries}
                  responseList={item.options}
                  withCustomOption={item.withCustomOption}
                  customOptions={item.customOption}
                  queryType={item.type}
                />
              </div>
            </div>
          ))}
      </div>
      <div className="w-full p-2 mt-2">
        <h1 className="text-gray-800 font-semibold text-xl">Age Segment</h1>
      </div>
      <div className="w-full flex flex-col gap-2 py-4">
        {surveyQueriesList
          .filter((query) => {
            if (presentationMode) {
              return query.access === "regular" && query.onTop;
            }
            return query.onTop;
          })
          .map((item) => (
            <SurveyOption
              selectedBaragnay={selectedBaragnay}
              ageList={ageList}
              query={item}
              selectGender={selectGender}
            />
          ))}
      </div>
      <Modal
        className="max-w-3xl"
        open={onExport}
        onOpenChange={() => setOnExport(false)}
        children={
          <SurveyExport
            surveyQueriesList={surveyQueriesList}
            barangayList={barangayList}
            municipals={municipals}
            setOnExport={setOnExport}
            survey={survey}
          />
        }
      />

      <Modal
        title="Presenetation mode"
        footer={true}
        children={
          <>
            <h1>
              This will hide all the queries with the access level of admin{" "}
            </h1>
          </>
        }
        open={onPresentation}
        onOpenChange={() => setOnPresentation(false)}
        onFunction={handleSetPresentationMode}
      />
    </div>
  );
};

export default SurveyResult;
