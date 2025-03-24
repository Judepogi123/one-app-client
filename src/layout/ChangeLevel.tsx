import React, { useState } from "react";

//ui
import { ScrollArea, ScrollBar } from "../components/ui/scroll-area";
import { Button } from "../components/ui/button";
import FigureHeads from "./FigureHeads";
import { TeamLeaderProps } from "../interface/data";
import { CHANGE_LEVEL } from "../GraphQL/Mutation";
import { useMutation } from "@apollo/client";

interface Props {
  barangaysId: string;
  teamId: string;
  currentTl: string;
}
const ChangeLevel = ({ barangaysId, teamId, currentTl }: Props) => {
  const [curerntStep, setCurrentStep] = useState(1);
  const [level, setLevel] = useState(1);
  const [selectHead, setSelectedHead] = useState<TeamLeaderProps | null>(null);

  const handleSelectHead = (data: TeamLeaderProps | null) => {
    if (selectHead && selectHead.id === data?.id) {
      setSelectedHead(null);
      return;
    }
    setSelectedHead(data);
  };

  const screens = [
    <LevelSelction level={level} setLevel={setLevel} />,
    <Headers
      barangayId={barangaysId}
      level={level}
      selectHead={selectHead}
      handleSelectHead={handleSelectHead}
    />,
  ];

  const handleNext = () => {
    if (curerntStep === screens.length) return;
    setCurrentStep((prev) => prev + 1);
  };
  const handleBack = () => {
    if (curerntStep === 1) return;
    setCurrentStep((prev) => prev - 1);
  };

  const [
    changeHeaderLevel,
    { loading: headerChanging, error: changeHeaderError },
  ] = useMutation(CHANGE_LEVEL);

  console.log(changeHeaderError);

  const handleChangeLevel = async () => {
    console.log(selectHead);
    await changeHeaderLevel({
      variables: {
        targetHeads: selectHead?.id ?? null,
        targetLevel: level,
        targetTeam: selectHead?.teamId ?? null,
        teamID: teamId,
        currentTl,
      },
    });
  };

  return (
    <div className="w-full p-2">
      {screens[curerntStep - 1]}
      <div className="w-full flex justify-end py-3 gap-2">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={headerChanging}
        >
          Prev
        </Button>
        {curerntStep === screens.length ? (
          <Button
            variant="default"
            onClick={handleChangeLevel}
            disabled={headerChanging}
          >
            Confirm
          </Button>
        ) : (
          <Button
            variant="default"
            onClick={handleNext}
            disabled={headerChanging}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChangeLevel;

const LevelSelction = ({
  level,
  setLevel,
}: {
  level: number;
  setLevel: React.Dispatch<React.SetStateAction<number>>;
}) => {
  return (
    <div className="flex flex-col gap-2 mt-4">
      {" "}
      {["TL", "PC", "BC"].map((item, i) => (
        <Button
          variant={level === i + 1 ? "default" : "outline"}
          onClick={() => setLevel(i + 1)}
        >
          {item}
        </Button>
      ))}
    </div>
  );
};
const Headers = ({
  level,
  barangayId,
  selectHead,
  handleSelectHead,
}: {
  level: number;
  barangayId: string;
  selectHead: TeamLeaderProps | null;
  handleSelectHead: (data: TeamLeaderProps | null, index: number) => void;
}) => {
  return (
    <div className="">
      <ScrollArea className="w-full h-96 mt-2">
        <div className="w-full p-2">
          {selectHead ? (
            <div
              className="w-full p-2 border border-gray-300 rounded-sm flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectHead(null, 0)}
            >
              <div className="text-lg font-semibold">
                <p className="text-lg font-semibold">
                  {selectHead.voter?.lastname} {selectHead.voter?.firstname}
                </p>
                <p className="text-sm font-medium">
                  Click here to remove/cancel
                </p>
              </div>
            </div>
          ) : (
            <FigureHeads
              level={level + 1}
              index={0}
              barangaysId={barangayId}
              handleSelectHead={handleSelectHead}
            />
          )}
        </div>

        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
};
