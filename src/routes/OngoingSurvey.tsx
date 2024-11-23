import React from "react";
import { Skeleton } from "../components/ui/skeleton";
import { Button } from "../components/ui/button";
//layout
import DraftedSurveyItem from "../components/item/DraftedSurveyItem";
//props
import { DraftedSurvey } from "../interface/data";
interface DraftedSurveyProps {
  data: DraftedSurvey[];
  loading: boolean;
}

const OngoingSurvey = () => {
  return (
    <div className="w-full h-auto ">
      <div className=" w-full p-2 flex justify-between">
        <h1 className="text-xl font-semibold ">Survey (Live)</h1>
      </div>
    </div>
  );
};

export default OngoingSurvey;

OngoingSurvey;
