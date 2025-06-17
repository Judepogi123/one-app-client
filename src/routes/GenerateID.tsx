import { useEffect, useState } from "react";
//lib
import { useMutation } from "@tanstack/react-query";
import axios from "../api/axios";
import { DndContext, DragEndEvent, pointerWithin } from "@dnd-kit/core";
//hooks
import { useSearchParams, useNavigate } from "react-router-dom";
import { useLazyQuery, useQuery } from "@apollo/client";
import { useDebounce } from "use-debounce";
import { useUserData } from "../provider/UserDataProvider";
//layout
import AreaSelection from "../components/custom/AreaSelection";
import UploadID from "../layout/UploadID";
import { Button } from "../components/ui/button";
import Modal from "../components/custom/Modal";
import SearchedFh from "../components/item/SearchedFh";
import SelectID from "../components/custom/SelectID";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Skeleton } from "../components/ui/skeleton";
//icon
import { IoCloudUploadOutline } from "react-icons/io5";
import { ScrollArea, ScrollBar } from "../components/ui/scroll-area";
import { Input } from "../components/ui/input";
import { FaPrint } from "react-icons/fa";
import { CiFilter } from "react-icons/ci";
import { HiOutlineIdentification } from "react-icons/hi";
import { HiIdentification } from "react-icons/hi2";
import { TbError404 } from "react-icons/tb";
import { CiViewList } from "react-icons/ci";
//queries
import { GET_ALL_FH, GET_TEAM_LIST } from "../GraphQL/Queries";
import { toast } from "sonner";
import { TeamProps, VotersProps } from "../interface/data";
import IdPreview from "../layout/IdPreview";

//
import { TemplateId } from "../interface/data";
import { handleFHLabel } from "../utils/helper";

const GenerateID = () => {
  const [onOpen, setOpen] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVoters, setSelectedVoters] = useState<VotersProps[]>([]);
  const [selectedID, setSelectedID] = useState<TemplateId | undefined>(
    undefined
  );
  const [value] = useDebounce(searchQuery, 1000);

  const nav = useNavigate();
  const user = useUserData();
  const [searchParams, setSearchParams] = useSearchParams({
    zipCode: user.forMunicipal ? user?.forMunicipal?.toString() : "all",
    barangay: "all",
    idUid: "",
    idName: "",
    page: "1",
    level: "TL",
  });
  const currentMunicipal = searchParams.get("zipCode") || "";
  const currentBarangay = searchParams.get("barangay") || "";
  const currentPage = searchParams.get("page") || "1";
  const currentLevel = searchParams.get("level") || "TL";

  const handleChangeArea = (type: string, value: string) => {
    if (type !== "page") {
      handleChangeArea("page", "1");
    }
    setSearchParams(
      (prev) => {
        prev.set(type, value);
        return prev;
      },
      {
        replace: true,
      }
    );
  };

  const { data, loading, refetch } = useQuery<{
    teamList: TeamProps[];
    teamCount: number;
    teamMembersCount: number;
  }>(GET_TEAM_LIST, {
    variables: {
      zipCode: currentMunicipal,
      barangayId: currentBarangay,
      purokId: "all",
      level: currentLevel,
      page: currentPage,
      skip: (parseInt(currentPage, 10) - 1) * 50,
      query: value,
      withIssues: "",
      members: "",
    },
    fetchPolicy: "cache-and-network",
    onError: (error) => {
      toast(`${error.message}`);
      console.error("Error fetching data", error);
    },
  });

  console.log({ data });

  useEffect(() => {
    refetch({
      zipCode: currentMunicipal,
      barangayId: currentBarangay,
      purokId: "all",
      level: currentLevel,
      page: currentPage,
      skip: (parseInt(currentPage, 10) - 1) * 50,
      query: value,
      members: "",
    });
  }, [
    currentLevel,
    currentPage,
    currentMunicipal,
    currentBarangay,
    currentBarangay,
    value,
    refetch,
  ]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    if (!selectedID) {
      toast.warning("Please select an ID template first", {
        closeButton: false,
      });
      return;
    }
    // First check if we have valid data
    if (!active.data.current) {
      console.warn("No data attached to draggable");
      return;
    }

    const draggedVoter = active.data.current as VotersProps; // Type assertion
    console.log({ draggedVoter });

    // Check if already selected
    const isAlreadySelected = selectedVoters.some(
      (item) => item.id === draggedVoter.id
    );
    if (isAlreadySelected) {
      toast.warning("Already selected", {
        closeButton: false,
      });
      return;
    }
    if (draggedVoter.level !== selectedID?.level) {
      toast.warning("Level not matched from selected ID", {
        closeButton: false,
      });
      return;
    }

    // Add to selected voters
    setSelectedVoters((prev) => [...prev, draggedVoter]);

    console.log("Successful drop!", {
      draggedItem: draggedVoter,
      droppedOn: over?.data.current,
    });
  };

  console.log({ selectedID });
  const controller = new AbortController();
  const handleGenerate = async (path: string) => {
    const controller = new AbortController(); // Create on demand

    try {
      const response = await axios.post(
        `upload/generate-custom-id-${path}`,
        {
          templateId: selectedID?.id as string,
          voterIDs: selectedVoters.map((item) => item.id),
          all: false,
          barangayId: "",
          level: selectedID?.level as number,
        },
        {
          signal: controller.signal,
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selectedID?.name}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.log(error);
    }
  };
  let toastId: string | number;
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (path: string) => handleGenerate(path),
    onSuccess: () => {
      toast.dismiss(toastId);
      toast.success("Successfully Generated", {
        description: "Go to 'Downloads' and open the file",
      });
    },
    onMutate: () => {
      toastId = toast.loading("Generating IDs...", {
        cancel: {
          label: "Cancel",
          onClick: () => {
            controller.abort("User cancelled");
            toast.error("Cancelled", { id: toastId });
            toast.dismiss(toastId);
          },
        },
        closeButton: false,
      });
      return { toastId };
    },
  });

  const handleNavPage = (dir: string) => {
    let toPage = 0;
    const thisPage = parseInt(currentPage, 10);
    if (dir === "prev") {
      toPage = thisPage - 1;
    } else {
      toPage = thisPage + 1;
    }
    handleChangeArea("page", toPage.toString());
  };

  const [getAllBarangayFH, { loading: fhLoading }] = useLazyQuery<{
    barangayFigureHead: TeamProps[];
  }>(GET_ALL_FH);
  const handleSelectAll = async () => {
    const response = await getAllBarangayFH({
      variables: {
        barangayId: currentBarangay,
        level: currentLevel,
      },
    });

    if (response.data) {
      const { barangayFigureHead } = response.data;
      console.log({ barangayFigureHead });

      const tlVoters = barangayFigureHead.map((item) => item.teamLeader?.voter);
      if (tlVoters && tlVoters.length > 0) {
        setSelectedVoters(tlVoters as VotersProps[]);
      }
    }
  };

  const { mutateAsync: selectingAll } = useMutation({
    mutationFn: handleSelectAll,
    onError: (err) => {
      console.log(err);
    },
  });

  return (
    <div className=" w-full h-full flex ">
      <DndContext onDragEnd={handleDragEnd} collisionDetection={pointerWithin}>
        <div className=" w-2/3 h-full ">
          <div className=" w-full h-[10%] justify-end items-center flex gap-2 border border-slate-300">
            <Button
              disabled={true}
              className=" flex gap-2"
              onClick={() => nav("/manage/generate-id/records")}
            >
              <CiViewList />
              Records
            </Button>
            <SelectID
              disabled={isPending}
              setSelectedID={setSelectedID}
              selectedID={selectedID}
              zipCode={currentMunicipal}
            />
            <Button
              disabled={isPending}
              size="sm"
              className=" flex items-center gap-2"
              onClick={() => {
                if (currentMunicipal === "all") {
                  toast.warning("Select municipal first", {
                    closeButton: false,
                  });
                  return;
                }
                nav(`/manage/generate-id/upload/${currentMunicipal}`);
              }}
            >
              <IoCloudUploadOutline size={20} /> Upload
            </Button>
            <AreaSelection
              disabled={isPending}
              handleChangeOption={handleChangeArea}
              currentMunicipal={currentMunicipal}
              currentBarangay={currentBarangay}
              currentPurok={""}
              defaultValue={"all"}
            />
          </div>
          <IdPreview
            setSelectedVoters={setSelectedVoters}
            selectedID={selectedID}
            selectedVoters={selectedVoters}
          />
        </div>

        <div className=" w-1/3 h-full border border-t-0 border-r-0 border-b-0">
          <div className=" w-full h-[15%] grid grid-cols-5 grid-rows-2 justify-between items-center gap-1 p-3">
            <p className=" font-medium text-sm col-span-5 row-start-1">
              Figure Heads
            </p>
            <Input
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="col-span-3 row-start-2 col-start-1"
            />

            <Popover>
              <PopoverTrigger>
                <Button
                  disabled={isPending}
                  variant="outline"
                  className="col-span-1 row-start-2 col-start-4 flex gap-1"
                  size="sm"
                >
                  <CiFilter size={22} /> Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="flex flex-col">
                <span className=" text-center font-medium mt-2">Level</span>
                <Select
                  disabled={isPending}
                  value={currentLevel}
                  defaultValue="TL"
                  onValueChange={(e) => {
                    handleChangeArea("level", e);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TL">TL</SelectItem>
                    <SelectItem value="PC">PC</SelectItem>
                    <SelectItem value="BC">BC</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  disabled={fhLoading}
                  className=" mt-4"
                  onClick={() => {
                    if (!selectedID) {
                      toast.warning("Please select an ID template first", {
                        closeButton: false,
                      });
                      return;
                    }
                    if (handleFHLabel(currentLevel) !== selectedID?.level) {
                      toast.warning("Level not matched from selected ID", {
                        closeButton: false,
                      });
                      return;
                    }
                    selectingAll();
                  }}
                  size="sm"
                  variant="outline"
                >
                  Select
                </Button>
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger>
                {" "}
                <Button
                  disabled={isPending}
                  className="col-span-1 row-start-2 col-start-5"
                >
                  <FaPrint size={18} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className=" flex flex-col gap-2">
                <span className=" text-center">Print as </span>
                <Button
                  disabled={isPending}
                  onClick={() => {
                    if (selectedVoters.length === 0) {
                      toast.warning("Please select at least one!", {
                        closeButton: false,
                      });
                      return;
                    }
                    mutateAsync("front");
                  }}
                  size="sm"
                  variant="outline"
                  className=" w-full flex gap-2"
                >
                  <HiOutlineIdentification />
                  Front
                </Button>
                <Button
                  disabled={isPending}
                  onClick={() => {
                    if (selectedVoters.length === 0) {
                      toast.warning("Please select at least one!", {
                        closeButton: false,
                      });
                      return;
                    }
                    mutateAsync("rear");
                  }}
                  size="sm"
                  variant="outline"
                  className=" w-full flex gap-2"
                >
                  <HiIdentification />
                  Rear
                </Button>
              </PopoverContent>
            </Popover>
          </div>

          <div className=" w-full h-[85%] p-2">
            {loading ? (
              <div>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton id={i.toString()} className=" w-full h-14 mt-2" />
                ))}
              </div>
            ) : data ? (
              <>
                <ScrollArea className=" w-full h-[90%] overflow-auto">
                  {data.teamList.length > 0 ? (
                    data.teamList.map((item, i) => (
                      <SearchedFh
                        query={value}
                        id={item.id}
                        team={item}
                        number={(parseInt(currentPage, 10) - 1) * 50 + i + 1}
                      />
                    ))
                  ) : (
                    <div className=" w-full grid">
                      <div className=" w-auto flex justify-center items-center flex-col m-auto">
                        <TbError404 size={50} />
                        <p className=" font-medium">NO data found!</p>
                      </div>
                    </div>
                  )}
                  <ScrollBar orientation="vertical" />
                </ScrollArea>

                <div className=" w-full flex justify-center items-center gap-2 h-[10%]">
                  <Button
                    disabled={currentPage === "1"}
                    size="sm"
                    onClick={() => handleNavPage("prev")}
                  >
                    Prev
                  </Button>
                  <Button
                    disabled={data.teamList.length <= 9}
                    size="sm"
                    onClick={() => handleNavPage("next")}
                  >
                    Next
                  </Button>
                </div>
              </>
            ) : (
              <div className=" w-full">
                <p>NO data found!</p>
              </div>
            )}
          </div>
        </div>
      </DndContext>
    </div>
  );
};

export default GenerateID;
