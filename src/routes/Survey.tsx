import { useState } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";
//ui
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

//layout
import Alert from "../components/custom/Alert";
import Surveyor from "./Surveyor";
import SampleSize from "./SampleSize";
import DefaultQuery from "./DefaultQuery";
//lib
import { useQuery } from "@apollo/client";
import { useUserData } from "../provider/UserDataProvider";
import Modal from "../components/custom/Modal";
import { useMutation } from "@apollo/client";
//queries
import { GET_DRAFTSURVEY } from "../GraphQL/Queries";
import { CREATE_SURVEY } from "../GraphQL/Mutation";
//props
import { DraftedSurvey } from "../interface/data";
import { SurveyStateList } from "../interface/layout";
import { toast } from "sonner";

//icons
import { RiSurveyLine } from "react-icons/ri";
import { RiDraftLine } from "react-icons/ri";
import { FiUser } from "react-icons/fi";
import { MdPercent } from "react-icons/md";
import { FaListUl } from "react-icons/fa";
import { Button } from "../components/ui/button";
import { formatTimestamp } from "../utils/date";

const stateList: SurveyStateList[] = [
  { name: "Survey (live)", link: "live", icon: RiSurveyLine },
  { name: "Draft", link: "draft", icon: RiDraftLine },
  { name: "Surveyor", link: "surveyor", icon: FiUser },
  { name: "Sample size", link: "size", icon: MdPercent },
  { name: "Defult query", link: "default", icon: FaListUl },
];

const Survey = () => {
  const [onAdd, setOnAdd] = useState<boolean>(false);
  const [params, setParams] = useSearchParams({ state: "live" });
  const { uid } = useUserData();

  const currentState = params.get("state");

  const { data, loading, refetch } = useQuery<{ surveyList: DraftedSurvey[] }>(
    GET_DRAFTSURVEY
  );

  const navigate = useNavigate();

  const [createSurvey, { loading: newSurveyLoading }] = useMutation<{
    createSurvey: { id: string };
  }>(CREATE_SURVEY);

  const handleCreateSurvey = async () => {
    try {
      const response = await createSurvey({
        variables: {
          survey: { adminUserUid: uid },
        },
      });

      if (response.data) {
        refetch();
        // navigate(`/survey/${response.data.createSurvey.id}`);
        return;
      }
      toast.warning("Failed to create new survey.", {
        closeButton: false,
      });
    } catch (error) {
      toast("An error occurered.", {
        description: `${error}`,
      });
    }
  };

  const handleChangeState = (value: string) => {
    setParams(
      (prev) => {
        prev.set("state", value);
        return prev;
      },
      {
        replace: true,
      }
    );
  };

  const handleNavitate = (value: string) => {
    try {
      if (currentState === "draft") {
        navigate(`/survey/draft/${value}`);
        return;
      }
      navigate(`/survey/live/${value}`);
    } catch (error) {
      toast("Failed to redirect.");
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full grid">
        <h1 className="m-auto">Plase wait...</h1>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full px-4 p-2">
        <Alert title="Something " />
      </div>
    );
  }
  return (
    <div className="w-full h-auto">
      <div className="w-full h-12 p-2 border border-l-0 border-r-0 border-gray-400 flex justify-between font-semibold">
        <div className=" w-auto flex gap-5">
          {stateList.map((item, index) => (
            <div
              key={index}
              onClick={() => handleChangeState(item.link)}
              className={`w-auto flex items-center gap-1 hover:underline cursor-pointer ${
                currentState === item.link ? "underline" : ""
              }`}
            >
              <item.icon />
              <h1 className="text-slate-700 text-sm">{item.name}</h1>
            </div>
          ))}
        </div>
        {currentState === "draft" && (
          <Button size="sm" onClick={() => setOnAdd(true)}>
            Start new survey
          </Button>
        )}
      </div>
      {currentState === "surveyor" ? (
        <Surveyor />
      ) : currentState === "size" ? (
        <SampleSize />
      ) : currentState === "default" ? (
        <DefaultQuery />
      ) : (
        <div className="w-full h-auto">
          <Table>
            <TableHeader className="border bg-slate-200">
              <TableHead>Tag ID</TableHead>
              {/* <TableHead>Facilitate by</TableHead> */}
              <TableHead>Create at</TableHead>
              <TableHead>Status</TableHead>
            </TableHeader>
            <TableBody>
              {[...data.surveyList]
                .reverse()
                .filter((item) =>
                  currentState === "live" ? !item.drafted : item.drafted
                )
                .map((item) => (
                  <TableRow
                    key={item.id}
                    onClick={() => handleNavitate(item.id)}
                    className="cursor-pointer hover:bg-slate-100"
                  >
                    <TableCell>{item.tagID}</TableCell>
                    {/* <TableCell>{item.admin.uid}</TableCell> */}
                    <TableCell>{formatTimestamp(item.timestamp)}</TableCell>
                    <TableCell>
                      {item.drafted ? "Drafted" : item.status}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      )}
      <Modal
        open={onAdd}
        onOpenChange={() => setOnAdd(false)}
        title="Create new survey"
        onFunction={handleCreateSurvey}
        loading={newSurveyLoading}
        className="max-w-sm"
        footer={true}
      />
    </div>
  );
};

export default Survey;
