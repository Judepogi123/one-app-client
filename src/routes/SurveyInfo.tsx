import React from "react";
import { useParams, useNavigate } from "react-router-dom";
//ui
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableCell,
  TableRow,
} from "../components/ui/table";
//graphql
import { useQuery } from "@apollo/client";
import { GET_SELECTED_DRAFT_SURVEY } from "../GraphQL/Queries";

//props
import { DraftedSurvey } from "../interface/data";
import Alert from "../components/custom/Alert";

//utils
import { formatTimestamp } from "../utils/date";
const SurveyInfo = () => {
  const { surveyID } = useParams();
  const navigate = useNavigate();
  
  const { data, loading } = useQuery<{ survey: DraftedSurvey }>(
    GET_SELECTED_DRAFT_SURVEY,
    {
      variables: {
        id: surveyID,
      },
    }
  );

  if (loading) {
    return (
      <div className="w-full h-1/2 grid">
        <h1 className="m-auto font-semibold">Loading...</h1>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full px-8 p-2">
        <Alert
          variant="destructive"
          title="Data not found"
          desc="Try to refresh the page"
        />
      </div>
    );
  }

  const { survey } = data;
  return (
    <div className="w-full h-full px-2">
      <div className="w-full p-2 border rounded mt-2 border-slate-400 grid grid-cols-3">
        <div className="w-auto flex items-center gap-3">
          <h1 className="text-sm">Status</h1>
          <h1 className="text-sm font-medium">{data.survey.status}</h1>
        </div>
        <div className="w-auto flex items-center gap-3">
          <h1 className="text-sm">Created by:</h1>
          <h1 className="text-sm font-medium">{data.survey.admin.firstname}</h1>
        </div>
        <div className="w-auto flex items-center gap-3">
          <h1 className="text-sm">Tag ID:</h1>
          <h1 className="text-sm font-medium">{data.survey.tagID}</h1>
        </div>
        <div className="w-auto flex items-center gap-3">
          <h1 className="text-sm">Created at:</h1>
          <h1 className="text-sm font-medium">
            {formatTimestamp(data.survey.timestamp)}
          </h1>
        </div>

        <div className="w-auto flex items-center gap-3">
          <h1 className="text-sm">Concluded at:</h1>
          <h1 className="text-sm font-medium">
            {formatTimestamp(data.survey.timestamp)}
          </h1>
        </div>
      </div>

      <div className="w-full h-auto mt-2">
        <Table>
          <TableHeader>
            <TableHead>Query</TableHead>
            <TableHead>Option</TableHead>
          </TableHeader>
          <TableBody>
            {survey.queries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  No item found!
                </TableCell>
              </TableRow>
            ) : (
              survey.queries.map((item) => (
                <TableRow
                  onClick={() =>
                    navigate(`/survey/${surveyID}/${item.id}`)
                  }
                  className="border cursor-pointer"
                >
                  <TableCell>{item.queries}</TableCell>
                  <TableCell>{item.options.length}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SurveyInfo;
