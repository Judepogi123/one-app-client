import { useState } from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";
//ui
import { Button } from "../components/ui/button";
import Alert from "../components/custom/Alert";
import Modal from "../components/custom/Modal";
//graphql
import { useMutation, useQuery } from "@apollo/client";
import { SURVEY_CONCLUDED, DELETE_SURVEY } from "../GraphQL/Mutation";
import { GET_SELECTED_DRAFT_SURVEY,GET_DRAFTSURVEY } from "../GraphQL/Queries";
//props
import { SurveyStateList } from "../interface/layout";
import { DraftedSurvey } from "../interface/data";
//icon
import { FaInfo } from "react-icons/fa6";
import { RiFolderReceivedLine } from "react-icons/ri";
import { GrScorecard } from "react-icons/gr";
import { toast } from "sonner";
import { CiWarning } from "react-icons/ci";
import { MdOutlinePercent } from "react-icons/md";

const optionList: SurveyStateList[] = [
  { name: "Info", link: "info", icon: FaInfo },
  { name: "Compliance", link: "compliance", icon: RiFolderReceivedLine },
  { name: "Analytics", link: "result", icon: GrScorecard },
];

const LiveSurvey = () => {
  const [onConclude, setOnConclude] = useState<boolean>(false);
  const [onDelete, setOnDelete] = useState<boolean>(false);
  const { surveyID } = useParams();
  const navigate = useNavigate();

  const { data, loading: dataLoading} = useQuery<{ survey: DraftedSurvey }>(
    GET_SELECTED_DRAFT_SURVEY,
    {
      variables: {
        id: surveyID,
      },
    }
  );

  const [surveyConclude, { loading }] = useMutation(SURVEY_CONCLUDED, {
    refetchQueries: [GET_SELECTED_DRAFT_SURVEY,GET_DRAFTSURVEY],
    variables: { id: surveyID },
  });

  const [deleteSurvey, { loading: deleteLoading }] = useMutation(DELETE_SURVEY,{refetchQueries: [GET_DRAFTSURVEY]});

  const handleConclude = async () => {
    try {
      const response = await surveyConclude({
        variables: {
          id: surveyID,
        },
      });
      if (response.data && !response.errors) {
        toast("Survey have been concluded successfully");
        return;
      }
      toast("Failed to conclude this survey");
    } catch (error) {
      toast("An error occured.");
    }
  };

  const handleDeleteSurvey = async () => {
    try {
      const response = await deleteSurvey({
        variables: {
          id: surveyID,
        },
      });
      if (response.data && !response.errors) {
        navigate("/survey");
        return;
      }
      toast("Failed to delete this survey.");
    } catch (error) {
      toast("Failed to conclude this survey");
    }
  };

  return (
    <div className="w-full h-auto">
      <div className="w-full p-2 border-l-0 border-r-0 border border-gray-500 flex justify-between">
        <div className=" w-auto flex gap-5">
          {optionList.map((item, index) => (
            <div
              onClick={() => navigate(`/survey/live/${surveyID}/${item.link}`)}
              key={index}
              className={`w-auto flex items-center gap-1 hover:underline cursor-pointer active:underline`}
            >
              <item.icon />
              <h1 className="text-slate-700 text-sm">{item.name}</h1>
            </div>
          ))}
        </div>

        <div className="w-auto flex gap-2">
          <Button
            onClick={() => setOnDelete(true)}
            size="sm"
            variant="destructive"
          >
            Delete
          </Button>
          <Button
            disabled={data?.survey.status === "Ongoing" ? false : true}
            onClick={() => setOnConclude(true)}
            size="sm"
          >
            {data?.survey.status === "Ongoing" ? "Conclude" : "Concluded"}
          </Button>
        </div>
      </div>
      <Outlet />
      <Modal
        onFunction={handleConclude}
        loading={loading}
        footer={true}
        title="Conclude survey"
        className="max-w-md"
        open={onConclude}
        onOpenChange={() => setOnConclude(false)}
        children={
          <div className="">
            <div className="w-full py-1 flex justify-center">
              <CiWarning fontSize={50} color="red" />
            </div>

            <h1>
              Are your sure you want to conclude this survey? This action cannot
              be undone afterwards.
            </h1>
            <h1 className="text-sm mt-4">
              Surveyor cannot comply for this survey in "Concluded" status.
            </h1>
          </div>
        }
      />

      <Modal
      onFunction={handleDeleteSurvey}
        loading={deleteLoading}
        footer={true}
        title="Delete survey"
        className="max-w-md"
        open={onDelete}
        onOpenChange={() => setOnDelete(false)}
        children={
          <div className="">
            <div className="w-full py-1 flex justify-center">
              <CiWarning fontSize={50} color="red" />
            </div>

            <h1>
              Are your sure you want to delete this survey? This action cannot
              be undone afterwards.
            </h1>
          </div>
        }
      />
    </div>
  );
};

export default LiveSurvey;
