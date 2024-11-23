import React, { useState, useEffect } from "react";
//ui
import { Button } from "../components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../components/ui/resizable";
import Modal from "../components/custom/Modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../components/ui/popover";
import { Input } from "../components/ui/input";
import { Link } from "react-router-dom";
//icons
import { IoIosAddCircleOutline } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { RiPresentationFill } from "react-icons/ri";
//layout
import SurveyResult from "./SurveyResult";
import SurveyList from "../layout/SurveyList";
const Results = () => {
  const [onSelect, setOnSelect] = useState<boolean>(false);
  const [onCancel, setOnCancel] = useState<boolean>(false);
  const [onNameEdit, setOnNameEdit] = useState<boolean>(false);
  const [selectedSurvey, setSelectedSurvey] = useState<{
    id: string;
    title: string | undefined;
  } | null>(null);

  const handleCloseSurvey = async () => {
    setSelectedSurvey(null);
    setOnCancel(false);
  };

  return (
    <div className="w-full h-screen">
      <div className="w-full h-full">
        <div className="w-full h-auto py-2 border flex justify-between items-center">
          <div className="w-auto flex gap-2">
            <Link
              to="#"
              className="ml-2 font-medium cursor-pointer hover:underline"
            >
              Survey
            </Link>
            <Link
              to="/result/voter"
              className="font-medium cursor-pointer hover:underline"
            >
              Voters
            </Link>
          </div>

          <div className="w-auto flex items-center gap-2">
            <Button
            variant="outline"
            className="mr-2 border border-gray-400"
          >
            <RiPresentationFill/>
          </Button>
            <div className="w-auto p-2">
              <Popover>
                <PopoverTrigger>
                  <div className="">
                    <Avatar>
                      <AvatarFallback>JML</AvatarFallback>
                    </Avatar>
                  </div>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="w-full pt-2">
                    <Button className="w-full" variant="destructive">
                      Logout
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        {selectedSurvey ? (
          <div className="w-full h-full">
            <div className="w-full h-auto">
              <div className="w-full p-2">
                <Select>
                  <SelectTrigger className="w-auto border border-gray-400">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </Select>
              </div>
              <ResizablePanelGroup
                className="w-full h-full"
                direction={"horizontal"}
              >
                <ResizablePanel
                  className="w-full"
                  minSize={50}
                  maxSize={75}
                  defaultSize={100}
                >
                  <div className="w-full flex justify-between p-2">
                    <h1 className="font-medium text-lg">
                      {onNameEdit ? (
                        <Input defaultValue={selectedSurvey.title} />
                      ) : (
                        <h1>{selectedSurvey.title}</h1>
                      )}
                    </h1>
                    <div className="w-auto flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => setOnNameEdit(!onNameEdit)}
                      >
                        {onNameEdit ? (
                          "Close"
                        ) : (
                          <>
                            <CiEdit /> Edit
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        className="border border-gray-400"
                        size="sm"
                        onClick={() => setOnCancel(true)}
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel>
                  <h1>dasdas</h1>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </div>
        ) : (
          <div className="w-full h-full grid">
            <div
              onClick={() => setOnSelect(true)}
              className="w-auto cursor-pointer m-auto"
            >
              <div className="w-full h-32 flex justify-center">
                <IoIosAddCircleOutline fontSize={100} color="#333" />
              </div>
              <div>
                <h1 className="font-medium text-lg text-]">Select survey</h1>
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal
        open={onSelect}
        onOpenChange={() => setOnSelect(false)}
        children={<SurveyList setSelectedSurvey={setSelectedSurvey} />}
        className="w-full max-w-2xl"
      />
      <Modal
        footer={true}
        title="Close this result?"
        open={onCancel}
        onOpenChange={() => setOnCancel(false)}
        className="max-w-xs"
        onFunction={() => handleCloseSurvey()}
      />
    </div>
  );
};

export default Results;
