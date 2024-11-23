import React from "react";
//lib
import { useNavigate, useParams } from "react-router-dom";
//import { useMutation } from "@apollo/client";
//props
import { OptionProps } from "../../interface/data";
//icon
import { PiOption } from "react-icons/pi";
import { MdDeleteOutline } from "react-icons/md";
//import { GrMultiple } from "react-icons/gr";

interface QueryProps {
  queries: string;
  id: string;
  surveyId: string;
  index: number;
  options: OptionProps[];
  setOnRemove: React.Dispatch<React.SetStateAction<string | null>>
}

const QueryItem = ({ setOnRemove, ...props }: QueryProps) => {
  const { surveyID } = useParams();
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/survey/${surveyID}/${props.id}`)}
      className=" w-full p-2 border border-gray-400 rounded cursor-pointer hover:border-black"
    >
      <div className="flex gap-2">
        <h1>{props.index}.</h1>
        <h1 className="font-semibold">{props.queries}</h1>
      </div>

      <div className="flex items-center gap-2 relative">
        <h1 className="flex w-auto gap--2">
        </h1>
        <div className="w-auto flex items-center gap-2">
          <PiOption />
          <h1 className="flex w-auto gap--2">
            {props.options && Object.values(props.options).length}
          </h1>
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation();
            setOnRemove(props.id);
          }}
          className="w-auto p-1 right-0 absolute border rounded hover:border-gray-500"
        >
          <MdDeleteOutline />
        </div>
      </div>
    </div>
  );
};

export default QueryItem;
