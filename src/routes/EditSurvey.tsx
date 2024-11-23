import { useState } from "react";
//ui
import { Button } from "../components/ui/button";
import Modal from "../components/custom/Modal";

//layout
import QueryItem from "../components/item/QueryItem";
import Alert from "../components/custom/Alert";
import NewQueryForm from "../layout/NewQueryForm";
//lib
import { useMutation, useQuery } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
//props
import { DraftedSurveyInfo } from "../interface/data";
//mutation
import { GET_SELECTED_DRAFT_SURVEY, GET_DRAFTSURVEY } from "../GraphQL/Queries";
import { DELETE_QUERY, LIVE_SURVEY, DELETE_SURVEY } from "../GraphQL/Mutation";
//icon
import { MdTag } from "react-icons/md";
import { CiCalendarDate } from "react-icons/ci";
import { GiMatterStates } from "react-icons/gi";
import { MdLiveTv } from "react-icons/md";
import { MdOutlineDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
//import { CiCircleList } from "react-icons/ci";
//utils
import { formatTimestamp } from "../utils/date";
import { toast } from "sonner";

const EditSurvey = () => {
  const [onNew, setOnNew] = useState<boolean>();
  const [onLive, setOnLive] = useState<boolean>(false);
  const [onRemove, setOnRemove] = useState<string | null>(null);
  const [onDeleteSuvey, setOnDeleteSurvey] = useState<boolean>(false);
  const { surveyID } = useParams();
  const navigate = useNavigate();

  const { data, loading, error } = useQuery<{ survey: DraftedSurveyInfo }>(
    GET_SELECTED_DRAFT_SURVEY,
    {
      variables: {
        id: surveyID,
      },
    }
  );

  const [goLiveSurvey, { loading: liveLoading }] = useMutation(LIVE_SURVEY, {
    variables: {
      id: surveyID,
    },
  });

  const [deleteSurvey, { loading: deleteSurveyIsloading }] = useMutation(
    DELETE_SURVEY,
    { refetchQueries: [GET_DRAFTSURVEY] }
  );

  const handleGOLive = async () => {
    try {
      const response = await goLiveSurvey({
        variables: {
          id: surveyID,
        },
      });
      if (response.data) {
        navigate("/survey");
      }
    } catch (error) {
      toast("Failed to live the survey.");
    }
  };

  const [deleteQuery, { loading: deleteQueryLoading }] = useMutation(
    DELETE_QUERY,
    {
      refetchQueries: [GET_SELECTED_DRAFT_SURVEY],
      variables: {
        id: surveyID,
      },
    }
  );

  const handleDeleteQuery = async () => {
    if (!onRemove) return;
    try {
      const response = await deleteQuery({
        variables: {
          id: onRemove,
        },
      });
      if (response.data) {
        setOnRemove(null);
        toast("Query remove successfully.");
        return;
      }
      toast("Failed to remove the query.");
    } catch (error) {
      toast("Unexpected error occured.");
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
        navigate("/survey?state=draft");
        return;
      }
      toast("Failed to delete this survey.");
    } catch (error) {
      toast("Failed to conclude this survey");
    }
  };

  if (loading) {
    return (
      <div className="w-full h-auto flex justify-center">
        <h1 className=" text-lg font-medium">Please wait...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        variant="destructive"
        title="An error occured"
        desc={`Something went wrong, please try to refresh the page: ${error.message}`}
      />
    );
  }

  if (!data) {
    return (
      <div className="w-full px-8">
        <Alert
          variant="destructive"
          title="An error occured"
          desc={`Something went wrong, no data found for this survey. Please try to refresh the page or contact the developer`}
        />
      </div>
    );
  }


  console.log(data);
  

  return (
    <div className="w-full h-auto">
      <div className="w-full p-2 flex items-center border border-gray-700 border-l-0 border-r-0">
        <div className="w-full p-2 flex gap-8">
          <div className="w-auto flex items-center gap-2">
            <h1 className="flex items-center gap-2">
              <MdTag />
              Tag:
            </h1>
            <h1 className="font-semibold">{data?.survey.tagID}</h1>
          </div>

          <div className="w-auto flex items-center gap-2">
            <h1 className="flex items-center gap-2">
              <CiCalendarDate />
              Create at:
            </h1>
            <h1 className="font-semibold">
              {formatTimestamp(data?.survey.timestamp as string)}
            </h1>
          </div>

          <div className="w-auto flex items-center gap-2">
            <h1 className="flex items-center gap-2">
              <GiMatterStates />
              State:
            </h1>
            <h1 className="font-semibold">
              {data?.survey.drafted && data.survey.status === "Ongoing"
                ? "Drafted"
                : "Live"}
            </h1>
          </div>
        </div>
        <div className="w-auto flex gap-2">
          {data.survey.drafted && (
            <>
              <Button
                onClick={() => setOnDeleteSurvey(true)}
                className="flex gap-2"
                variant="destructive"
                size="sm"
              >
                <MdOutlineDelete />
                Delete
              </Button>

              <Button
                className="flex gap-2"
                variant="outline"
                onClick={() => setOnLive(true)}
                size="sm"
              >
                <MdLiveTv />
                Live
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="w-full px-4 py-2 flex justify-between">
        <h1 className="font-semibold text-xl">Queries</h1>
        <div className="w-auto flex items-center gap-2">
        <Button
            className="flex items-center gap-2"
            variant="outline"
            onClick={() => navigate(`/survey/draft/${surveyID}/requirement`)}
            size="sm"
          >
            <IoMdAdd />
            Requirement
          </Button>
          <Button
            className="flex items-center gap-2"
            variant="outline"
            onClick={() => setOnNew(true)}
            size="sm"
          >
            <IoMdAdd />
            Add query
          </Button>
        </div>
      </div>

      <div className=" w-full h-auto flex flex-col gap-2 px-2">
        {data.survey.queries.length === 0 ? (
          <div className=" w-full text-center">
            <h1 className="font-semibold text-lg text-gray-700">
              No queries yet
            </h1>
          </div>
        ) : (
          [...data.survey.queries].sort((a,b)=> a.order - b.order).map((item, i) => (
            <QueryItem
              key={item.id}
              {...item}
              index={i + 1}
              options={item.options}
              setOnRemove={setOnRemove}
            />
          ))
        )}
      </div>
      <Modal
        title="New query"
        open={onNew}
        onOpenChange={() => setOnNew(false)}
        children={<NewQueryForm surveyId={surveyID as string} />}
      />
      <Modal
        loading={liveLoading}
        onFunction={handleGOLive}
        footer={true}
        title="Finalize and live this survey?"
        open={onLive}
        onOpenChange={() => setOnLive(false)}
        children={
          <h1 className="">
            Are you sure about this action? This cannot be undone afterwards.
          </h1>
        }
      />

      <Modal
        footer={true}
        open={onRemove !== null}
        onOpenChange={() => setOnRemove(null)}
        onFunction={handleDeleteQuery}
        loading={deleteQueryLoading}
      />

      <Modal
        title="Delete survey"
        footer={true}
        open={onDeleteSuvey}
        onOpenChange={() => setOnDeleteSurvey(false)}
        onFunction={handleDeleteSurvey}
        loading={deleteSurveyIsloading}
        children={
          <h1 className="">
            Are you sure about this action? This cannot be undone afterwards.
          </h1>
        }
      />
    </div>
  );
};

export default EditSurvey;
