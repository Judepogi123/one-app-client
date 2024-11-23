import React from "react";

//props
import { DraftedSurvey } from "../../interface/data";

//icon
import { MdTag } from "react-icons/md";
import { formatTimestamp } from "../../utils/date";

const LiveSurveyItem = ({...props}: DraftedSurvey) => {
  return (
    <div className="w-full h-32 flex flex-col justify-between border border-gray-500 rounded cursor-pointer hover:border-black">
      <div className="w-full p-2 flex gap-1 item-center border-black">
        <MdTag />
        <h1 className="text-lg font-medium"> {props.tagID}</h1>
      </div>
      <div className="w-full p-2">
        <h1>{props.admin.firstname}</h1>
        <h1 className=" text-sm">{formatTimestamp(props.timestamp)}</h1>
      </div>
    </div>
  );
};

export default LiveSurveyItem;
