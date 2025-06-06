/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import { useUserData } from "../provider/UserDataProvider";
import { useMutation as ruseMutation } from "@tanstack/react-query";
import axios from "../api/axios";
//ui
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import GenerateTeam from "../layout/GenerateTeam";
// import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Skeleton } from "../components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
//props
import { TeamProps } from "../interface/data";
//graphql
import { useQuery, useMutation } from "@apollo/client";
import { GET_TEAM_LIST } from "../GraphQL/Queries";
import { MERGE_TEAM } from "../GraphQL/Mutation";
//utils
import { handleLevel, handleSanitizeChar } from "../utils/helper";
//layout
import AreaSelection from "../components/custom/AreaSelection";
import { toast } from "sonner";
import Modal from "../components/custom/Modal";
import ReassignHeads from "../layout/ReassignHeads";
//icons
import { TbReport } from "react-icons/tb";
import { RiRestartFill } from "react-icons/ri";
import { SlOptionsVertical } from "react-icons/sl";
import { FaPrint } from "react-icons/fa";
//import { SlOptionsVertical } from "react-icons/sl";
import { handleElements } from "../utils/element";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import hotkeys from "hotkeys-js";

const options: { name: string; value: string }[] = [
  { name: "All", value: "all" },
  { name: "TL", value: "TL" },
  { name: "PC", value: "PC" },
  { name: "BC", value: "BC" },
];

const Teams = () => {
  const user = useUserData();
  const [selected, setSelected] = useState<string[]>([]);
  const [params, setParams] = useSearchParams({
    zipCode: user?.forMunicipal ? user?.forMunicipal.toString() : "all",
    barangay: "all",
    purok: "all",
    level: "all",
    page: "1",
    others: "0",
    query: "",
    withIssues: "false",
    members: "all",
  });

  const currentMunicipal = params.get("zipCode") || "all";
  const currentBarangay = params.get("barangay") || "all";
  const currentPurok = params.get("purok") || "all";
  const currentLevel = params.get("level") || "all";
  const currentPage = params.get("page") || "1";
  const currentMembers = params.get("members") || "all";
  //const currentOthers = params.get("others") || "0";
  const currentQuery = params.get("query");
  const currentWithIssues = params.get("withIssues");

  const [onUpdate, setOnUpdate] = useState<{
    draggedId: string;
    targetId: string;
  } | null>({
    draggedId: "",
    targetId: "",
  });
  const [onOpen, setOnOpen] = useState(0);

  const navigate = useNavigate();
  const handleChangeOption = (params: string, value: string) => {
    setParams(
      (prev) => {
        prev.set(params, value);
        return prev;
      },
      {
        replace: true,
      }
    );
  };

  const debounceQuery = useDebouncedCallback((value: string) => {
    const sanitized = handleSanitizeChar(value);
    handleChangeOption("query", sanitized);
  }, 1000);

  const { data, loading, refetch } = useQuery<{
    teamList: TeamProps[];
    teamCount: number;
    teamMembersCount: number;
  }>(GET_TEAM_LIST, {
    variables: {
      zipCode: currentMunicipal,
      barangayId: currentBarangay,
      purokId: currentPurok,
      level: currentLevel,
      page: (parseInt(currentPage, 10) - 1) * 50,
      skip: 1,
      query: currentQuery,
      withIssues: currentWithIssues === "true",
      members: currentMembers,
    },
    fetchPolicy: "cache-and-network",
    onError: (error) => {
      toast(`${error.message}`);
      console.error("Error fetching data", error);
    },
  });

  console.log(data);

  useEffect(() => {
    refetch({
      zipCode: currentMunicipal,
      barangayId: currentBarangay,
      purokId: currentPurok,
      level: currentLevel,
      page: currentPage,
      skip: (parseInt(currentPage, 10) - 1) * 50,
      query: currentQuery,
      members: currentMembers,
    });
  }, [
    currentLevel,
    currentPage,
    currentMunicipal,
    currentPurok,
    currentBarangay,
    currentBarangay,
    currentQuery,
    refetch,
    currentMembers,
  ]);

  // const handleDragEnd = (event: DragEndEvent) => {
  //   const { active, over } = event;

  //   if (!over) return;

  //   const rowId = active.id as string;
  //   const targetId = over.id as string;
  // };

  // const handleRef =(id: string)=>{
  //   const { setNodeRef } = useDroppable({
  //     id
  //   });
  //   return setNodeRef
  // }

  const [mergeTeam, { loading: merging }] = useMutation(MERGE_TEAM, {
    onCompleted: () => {
      toast("Team merged successfully");
      setOnUpdate(null);
      setOnOpen(0);
      refetch();
    },
  });

  const handleDragStart = (
    event: React.DragEvent<HTMLTableRowElement>,
    id: string
  ) => {
    event.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (event: React.DragEvent<HTMLTableRowElement>) => {
    event.preventDefault();
  };

  const handleDrop = (
    event: React.DragEvent<HTMLTableRowElement>,
    targetId: string
  ) => {
    const draggedId = event.dataTransfer.getData("text/plain");

    setOnUpdate(() => ({
      draggedId: draggedId,
      targetId: targetId,
    }));
    setOnOpen(1);
  };

  const hadnleMergeTeam = async () => {
    if (!onUpdate) return;
    await mergeTeam({
      variables: {
        firstId: onUpdate?.targetId,
        secondId: onUpdate?.draggedId,
      },
    });
  };

  useEffect(() => {
    if (!onUpdate) {
      setOnUpdate(null);
    }
  }, [onUpdate]);

  const handleSelectIds = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCheckId = (id: string) => selected.includes(id);
  const handlePrintStab = async () => {
    if (currentBarangay === "all") {
      toast.warning("Select a specific area", {
        closeButton: false,
        description: "Too large to print",
      });
      return;
    }

    const response = await axios.get(
      `upload/generate-stab?id=${currentBarangay}`,
      {
        responseType: "blob", // This is crucial for file downloads
      }
    );

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;

    // Get filename from content-disposition or use default
    const contentDisposition = response.headers["content-disposition"];
    const fileName = contentDisposition
      ? contentDisposition.split("filename=")[1].replace(/"/g, "")
      : `voters-stab-${currentBarangay}.pdf`;

    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();

    // Cleanup
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const { isPending, mutateAsync } = ruseMutation({
    mutationFn: handlePrintStab,
    onSuccess: () => {
      if (currentBarangay === "all") return;
      toast.success("Download completed!", {
        closeButton: false,
      });
    },
    onError: () => {
      toast.error("Failed to generate PDF", {
        closeButton: false,
      });
    },
    onMutate: () => {
      if (currentBarangay === "all") return;
      return {
        toastId: toast.loading("Preparing download...", {
          description: "This may take a moment",
          closeButton: false,
        }),
      };
    },
    onSettled: (data, error, variables, context) => {
      console.log(data, error, variables);

      if (context?.toastId) {
        toast.dismiss(context.toastId);
      }
    },
  });

  useEffect(() => {
    hotkeys("ctrl+k", (event) => {
      event.preventDefault();
      setOnOpen(3);
    });
    hotkeys("ctrl+c", (event) => {
      event.preventDefault();
      setSelected([]);
      setOnOpen(0);
    });

    return () => {
      hotkeys.unbind("ctrl+g");
    };
  }, []);

  return (
    <div className="w-full">
      <div className="w-full flex gap-2 items-center px-2 border border-slate-400 border-l-0 border-r-0 sticky top-0 bg-white z-10">
        <h1 className="font-mono font-medium text-sm">Level:</h1>
        {options.map((item) => (
          <Button
            key={item.value}
            size="sm"
            variant={currentLevel === item.value ? "default" : "outline"}
            onClick={() => handleChangeOption("level", item.value)}
          >
            {item.name}
          </Button>
        ))}
        <Label htmlFor="members">Members: </Label>
        <Select
          disabled
          defaultValue="all"
          onValueChange={(value) => handleChangeOption("members", value)}
        >
          <SelectTrigger id="members" className="w-auto">
            <SelectValue placeholder="Handle" />
          </SelectTrigger>

          <SelectContent className="w-auto">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="noMembers">0</SelectItem>
            <SelectItem value="four">4</SelectItem>
            <SelectItem value="five">5 members</SelectItem>
            <SelectItem value="sixToNine">With 5 members and above</SelectItem>
            <SelectItem value="equalToMax">10 (max)</SelectItem>
            <SelectItem value="aboveMax">Above 10</SelectItem>
          </SelectContent>
        </Select>
        <AreaSelection
          currentPurok={currentPurok}
          currentBarangay={currentBarangay}
          currentMunicipal={currentMunicipal}
          handleChangeOption={handleChangeOption}
          defaultValue={
            user?.forMunicipal ? user?.forMunicipal.toString() : "all"
          }
          disabled={user?.forMunicipal ? true : false}
        />
        <Label htmlFor="issues">W/issues</Label>
        <Checkbox
          disabled
          id="issues"
          checked={currentWithIssues === "true"}
          onCheckedChange={(check) =>
            handleChangeOption("withIssues", check ? "true" : "false")
          }
        />

        <div className="flex items-center absolute right-0 mr-2 gap-2">
          <Input
            onChange={(e) => debounceQuery(e.target.value)}
            placeholder="Search"
            className="border border-slate-600"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              handleChangeOption("query", "");
              handleChangeOption("page", "1");
            }}
          >
            <RiRestartFill fontSize={20} />
          </Button>
          <Popover>
            <PopoverTrigger>
              <Button size="sm">
                <SlOptionsVertical fontSize={16} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className=" max-w-xs flex flex-col gap-2">
              <h1 className=" font-medium text-sm">Options</h1>
              <Button
                className=" w-full flex gap-2"
                variant="outline"
                size="sm"
                onClick={() => setOnOpen(2)}
              >
                <TbReport fontSize={20} />
                Generate
              </Button>

              <Button
                disabled={isPending}
                className=" w-full flex gap-2"
                variant="outline"
                size="sm"
                onClick={() => mutateAsync()}
              >
                <FaPrint fontSize={20} />
                Print Stab
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="w-full p-4 rounded-sm bg-slate-100">
        <p className="font-medium">Results</p>
        <div className="ml-4 text-sm font-light">
          Team count: {data?.teamCount ?? 0}
        </div>
        <div className="ml-4 text-sm font-light">
          Members count: {data?.teamMembersCount ?? 0}
        </div>
      </div>
      {loading ? (
        <div className="w-full flex flex-col gap-1 px-2">
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-10" />
          ))}
        </div>
      ) : data?.teamList.length === 0 ? (
        <div className="w-full h-80 grid">
          <h1 className="m-auto">No data found!</h1>
        </div>
      ) : (
        <Table>
          <TableHeader>
            {onOpen === 3 ? <TableHead>Select</TableHead> : null}
            <TableHead>No</TableHead>
            <TableHead>Tag ID</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Figure Head </TableHead>
            <TableHead>Handled</TableHead>
            {/* <TableHead>Issues</TableHead> */}
            <TableHead>Purok</TableHead>
            <TableHead>Barangay</TableHead>
            <TableHead>Municipal</TableHead>
          </TableHeader>

          <TableBody>
            {data?.teamList.map((item, i) => {
              return (
                <TableRow
                  draggable
                  onDragStart={(e) =>
                    handleDragStart(e, item?.teamLeader?.id as string)
                  }
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, item?.teamLeader?.id as string)}
                  onClick={() => {
                    if (onOpen === 3) {
                      handleSelectIds(item.teamLeaderId);
                      return;
                    }
                    if (item.level !== 0) {
                      navigate(`/teams/${item.id}`);
                      return;
                    }
                  }}
                  className="border border-gray-200 cursor-pointer hover:bg-slate-200"
                >
                  {onOpen === 3 ? (
                    <TableCell>
                      <Checkbox checked={handleCheckId(item.teamLeaderId)} />
                    </TableCell>
                  ) : null}
                  <TableCell>
                    {(parseInt(currentPage, 10) - 1) * 50 + i + 1}
                  </TableCell>
                  <TableCell>
                    {item.municipal.id}-{item.barangay.number}-
                    {handleElements(
                      currentQuery as string,
                      item.teamLeader?.voter?.idNumber as string
                    )}
                  </TableCell>
                  <TableCell>{handleLevel(item.level)}</TableCell>
                  <TableCell
                    className={
                      item.teamLeader?.voter?.firstname
                        ? "text-black"
                        : "text-orange-500"
                    }
                  >
                    {`${item.teamLeader?.voter?.lastname}, ${item.teamLeader?.voter?.firstname}` ||
                      "Vacant"}
                  </TableCell>

                  <TableCell>
                    {
                      item.voters.filter(
                        (mem) => mem.id !== item.teamLeader?.votersId
                      ).length
                    }
                    ({handleLevel(item.level - 1)})
                  </TableCell>
                  {/* <TableCell>{item._count.voters}</TableCell> */}
                  <TableCell>
                    {item.teamLeader?.voter?.purok?.purokNumber}
                  </TableCell>
                  <TableCell>{item.barangay.name}</TableCell>
                  <TableCell>{item.municipal.name}</TableCell>
                  {/* <TableCell>
                    <Popover>
                      <PopoverTrigger>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          variant="outline"
                          size="sm"
                        >
                          <SlOptionsVertical />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent></PopoverContent>
                    </Popover>
                  </TableCell> */}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
      <div className="w-full flex gap-2 p-2 justify-center">
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            const pageNow = parseInt(currentPage, 10);
            if (pageNow === 0) return;
            const page = pageNow - 1;
            handleChangeOption("page", page.toString());
          }}
        >
          Prev
        </Button>
        {parseInt(currentPage, 10) - 1 === 0 ? null : (
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const pageNow = parseInt(currentPage, 10);
              if (pageNow === 0) return;
              const page = pageNow - 1;
              handleChangeOption("page", page.toString());
            }}
          >
            {parseInt(currentPage, 10) - 1}
          </Button>
        )}

        <Button size="sm" variant="outline" className=" border border-gray-500">
          {parseInt(currentPage, 10)}
        </Button>
        {data?.teamList && data.teamList.length >= 50 && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const pageNow = parseInt(currentPage, 10);
              if (pageNow === 0) return;
              const page = pageNow + 1;
              handleChangeOption("page", page.toString());
            }}
          >
            {parseInt(currentPage, 10) + 1}
          </Button>
        )}

        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            if (data?.teamList && data.teamList.length < 50) return;
            const pageNow = parseInt(currentPage, 10);
            if (pageNow === 0) return;
            const page = pageNow + 1;
            handleChangeOption("page", page.toString());
          }}
        >
          Next
        </Button>
      </div>
      <Modal
        title="Merge"
        onFunction={hadnleMergeTeam}
        children={
          <div>
            <h1>1{onUpdate?.targetId}</h1>
            <h1>2{onUpdate?.draggedId}</h1>
          </div>
        }
        footer={true}
        loading={merging}
        open={onOpen === 1}
        onOpenChange={() => {
          setOnUpdate(null);
          setOnOpen(0);
        }}
      />

      <Modal
        title="Generate"
        className="max-w-lg"
        onFunction={hadnleMergeTeam}
        children={
          <div className="w-full flex">
            <GenerateTeam
              zipCode={currentMunicipal}
              barangay={currentBarangay}
              level={currentLevel}
              selectedId={selected}
            />
          </div>
        }
        loading={merging}
        open={onOpen === 2}
        onOpenChange={() => {
          setOnUpdate(null);
          setOnOpen(0);
        }}
      />

      <Modal
        title="Change Level"
        className="max-w-sm"
        onFunction={hadnleMergeTeam}
        children={
          <div className="w-full flex flex-col">
            <p className="text-sm mb-2">
              The members belows the selecte team/team-leader will be affected
              of this action
            </p>
            <ReassignHeads selectedIDs={selected} />
          </div>
        }
        loading={merging}
        open={onOpen === 4}
        onOpenChange={() => {
          setOnOpen(0);
        }}
      />
    </div>
  );
};

export default Teams;
