/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import AddMembers from "../layout/AddMembers";
import SearchVoters from "../layout/SearchVoters";
import { Button } from "../components/ui/button";
import Modal from "../components/custom/Modal";
import FigureHeads from "../layout/FigureHeads";
import { Checkbox } from "../components/ui/checkbox";
import { FaEllipsisVertical } from "react-icons/fa6";
//props
import { TeamLeaderProps, TeamProps, VotersProps } from "../interface/data";

//Graphql
import { GET_TEAM_INFO } from "../GraphQL/Queries";
import {
  CHANGE_LEADER,
  UPDATE_LEADER,
  UDPATE_TEAM_MEMBERS,
  REMOVE_TEAM,
  SWAP_VOTERS,
  ASSIGN_HEADS,
  //TRANSFER_GROUP,
  CALIBRATE_TEAM,
  //TRANSPORT_SELECTED_MEMBERS,
} from "../GraphQL/Mutation";
import { useQuery, useMutation } from "@apollo/client";
import ChangeLevel from "../layout/ChangeLevel";
//utils
import { handleLevel, handleAltText } from "../utils/helper";
import { toast } from "sonner";
import HeaderInfo from "../components/custom/HeaderInfo";

const Groups = () => {
  const [selectedVoters, setSelectedVoters] = useState<VotersProps | undefined>(
    undefined
  );
  const [selectedList, setSelectedList] = useState<string[]>([]);
  const [onMultiSelect, setOnMultiSelect] = useState(false);
  const [onOpenModal, setOnOpenModal] = useState(0);
  const [onOpen, setOnOpen] = useState(0);
  const [level, setLevel] = useState(1);
  const [droppedItem, setDroppedItem] = useState<VotersProps | null>(null);
  const [selectHead, setSelectedHead] = useState<TeamLeaderProps | null>(null);
  const { teamId } = useParams();
  const navigate = useNavigate();

  const { data, loading, refetch } = useQuery<{
    team: TeamProps | null;
  }>(GET_TEAM_INFO, {
    variables: { id: teamId },
    skip: !teamId,
  });

  const handleSelectHead = (data: TeamLeaderProps, index: number) => {
    setSelectedHead(data);
    setOnOpen(index);
  };

  const [changeLeader, { loading: updating, error: updateError }] = useMutation(
    CHANGE_LEADER,
    { refetchQueries: [{ query: GET_TEAM_INFO, variables: { id: teamId } }] }
  );

  const [updateLeader, { loading: updatingLeader }] =
    useMutation(UPDATE_LEADER);

  const [
    multiSelectVoter,
    { loading: multiSelectIsLoading, error: multiSelectError },
  ] = useMutation(UDPATE_TEAM_MEMBERS);

  // const [
  //   transferSelectedGroup,
  //   { loading: selectedTransfering, error: selectedTrasferError },
  // ] = useMutation(TRANSPORT_SELECTED_MEMBERS, {
  //   onCompleted: () => {
  //     toast("Team updated successfully", {
  //       closeButton: false,
  //     });
  //     setSelectedList([]);
  //   },
  //   refetchQueries: [{ query: GET_TEAM_INFO, variables: { id: teamId } }],
  // });

  const [removeTeam, { loading: removing }] = useMutation(REMOVE_TEAM);

  useEffect(() => {
    if (selectedVoters) {
      setOnOpenModal(5);
      return;
    }
  }, [selectedVoters]);

  // const handleTrasferSelected = async () => {
  //   if (!selectedList.length || !team || !selectHead) {
  //     return toast.warning("Select at least one voter", {
  //       closeButton: false,
  //     });
  //   }
  //   const response = await transferSelectedGroup({
  //     variables: {
  //       ids: selectedList,
  //       toTeam: selectHead?.teamId,
  //       level: team.level,
  //       currTL: team.teamLeaderId,
  //       toTL: selectHead.id,
  //     },
  //   });
  //   if (response.errors) {
  //     toast("Team udpate failed!", {
  //       closeButton: false,
  //     });
  //     throw new Error(selectedTrasferError?.message);
  //   }
  //   refetch();
  // };

  const handleCheckState = (id: string) => {
    const copyList = [...selectedList];
    return copyList.includes(id);
  };

  const handleSelectMultipleVoter = (id: string, checked: boolean) => {
    let updatedList = [...selectedList];
    if (checked) {
      // Remove the item if it exists
      updatedList = updatedList.filter((item) => item !== id);
    } else {
      // Add the item if it does not exist
      updatedList.push(id);
    }
    setSelectedList(updatedList);
  };

  const handleMultilSelect = async () => {
    if (!selectedList.length) {
      toast("Select at least one voter");
      return;
    }
    try {
      const response = await multiSelectVoter({
        variables: { teamId, members: selectedList, method: 0 },
      });
      if (response.errors) {
        toast("Team udpate failed!", {
          closeButton: false,
        });
        throw new Error(multiSelectError?.message);
      }
      refetch();
      toast("Team updated successfully");
      setSelectedList([]);
    } catch (error) {
      toast("Error updating voters", {
        description: "An error occurred",
      });
    }
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    item: VotersProps
  ) => {
    e.dataTransfer.setData("application/json", JSON.stringify(item));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, level: number) => {
    e.preventDefault();
    const item = e.dataTransfer.getData("application/json");

    if (item) {
      try {
        const voterData: VotersProps = JSON.parse(item);
        setDroppedItem(voterData);
        setLevel(level);
        setOnOpen(11);
      } catch (error) {
        toast.error("Error parsing voter data.");
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const [swapVoters, { loading: swapping }] = useMutation(SWAP_VOTERS, {
    onCompleted: () => {
      toast.success("Swap success!", {
        closeButton: false,
      });
      setOnOpen(0);
    },
    refetchQueries: [{ query: GET_TEAM_INFO, variables: { id: teamId } }],
  });

  const handleSwpped = async () => {
    if (!data?.team?.teamLeader?.votersId) {
      toast.error("TL ID not found", {
        closeButton: false,
      });
      return;
    }
    if (!droppedItem) {
      return;
    }
    const levelInfo = [
      data.team.teamLeader.votersId,
      data.team.teamLeader.purokCoors?.voter?.id,
      data.team.teamLeader.barangayCoor?.voter?.id,
    ];
    if (droppedItem.id === levelInfo[level - 1]) {
      toast.error("Cannot swap with the same level", {
        closeButton: false,
      });
      return;
    }
    await swapVoters({
      variables: {
        voterOneId: droppedItem.id,
        voterTwoId: levelInfo[level - 1],
      },
    });
  };

  const handleChangLeader = async () => {
    if (!selectedVoters) {
      toast("Select a voter first");
      return;
    }
    if (!teamId) {
      toast("Team ID is missing!");
      return;
    }
    const response = await changeLeader({
      variables: {
        id: selectedVoters.id,
        teamId: teamId,
        level: team?.level,
        currentTl: team?.teamLeaderId,
      },
    });
    if (response.errors) {
      toast("Failed!");
      return;
    }
  };

  const handleUpdateLeader = async (method: number) => {
    if (!team) {
      toast.warning("Required date missing", {
        description: "Try refresh the page and try again.",
        closeButton: false,
      });
      return;
    }
    if (!team.teamLeader) {
      toast.warning("Already vacant!", {
        closeButton: false,
      });
      return;
    }
    const respose = await updateLeader({
      variables: {
        teamId: team.id,
        id: team.teamLeader?.id,
        level: team.level,
        method: method,
      },
    });
    if (respose.data) {
      refetch({ id: teamId });
      toast("Success", {
        closeButton: false,
      });
    }
  };

  const handleRemove = async () => {
    if (!teamId) {
      toast("Team ID is missing!");
      return;
    }
    try {
      const response = await removeTeam({
        variables: { id: teamId },
      });
      if (response.errors) {
        toast("Failed to remove team!", {
          closeButton: false,
        });
        throw new Error(updateError?.message);
      }
      navigate(-1);
      toast("Team removed successfully");
    } catch (error) {
      console.log(error);
      toast("Error removing team", {
        description: "An error occurred",
      });
    }
  };

  const [assignHeads, { loading: assgining }] = useMutation(ASSIGN_HEADS, {
    onCompleted: () => {
      toast.success("Assigned successfully!", {
        closeButton: false,
      });
      setOnOpen(0);
      setLevel(0);
    },
    onError: () => {
      toast.error("Assign Failed!", {
        closeButton: false,
      });
      setLevel(0);
    },
    refetchQueries: [{ query: GET_TEAM_INFO, variables: { id: teamId } }],
  });

  const handleAssignHeads = async () => {
    if (!selectHead) {
      toast.error("Select a Figure Header person first");
      return;
    }
    if (!teamId) {
      toast.error("Team ID is missing", {
        closeButton: false,
      });
      return;
    }
    if (!data) {
      toast.error("Data not found", {
        closeButton: false,
      });
      return;
    }
    await assignHeads({
      variables: {
        id: data?.team?.teamLeader?.id,
        level: level,
        toId: selectHead.id,
      },
    });
  };

  // const [transferGroup, { loading: transfering }] = useMutation(
  //   TRANSFER_GROUP,
  //   {
  //     onCompleted: () => {
  //       toast.success("Transfer success!", {
  //         closeButton: false,
  //       });
  //       setOnOpen(0);
  //     },
  //     refetchQueries: [{ query: GET_TEAM_INFO, variables: { id: teamId } }],
  //   }
  // );

  const [calibrateTeam, { loading: calibrating }] = useMutation(
    CALIBRATE_TEAM,
    {
      onCompleted: () => {
        toast.success("Cali!", {
          closeButton: false,
        });
        setOnOpen(0);
        setLevel(0);
      },
      refetchQueries: [{ query: GET_TEAM_INFO, variables: { id: teamId } }],
      onError: () => {
        toast.error("Calibrate Failed!", {
          closeButton: false,
        });
        setLevel(0);
      },
    }
  );

  // const handleMultiTransfer = async () => {
  //   if (selectedList.length === 0) {
  //     toast.warning("Select at least one voter", {
  //       closeButton: false,
  //     });
  //     return;
  //   }
  //   await transferGroup({
  //     variables: {
  //       id: data?.team?.id,
  //       level: level,
  //       toId: selectedList,
  //     },
  //   });
  // };

  const handleCalibrateTeam = async () => {
    if (!data?.team) {
      toast.warning("Invalid Team data", {
        closeButton: false,
      });
      return;
    }
    await calibrateTeam({
      variables: {
        id: data?.team?.id,
        tlID: data?.team?.teamLeader?.id,
        pcID: data?.team?.teamLeader?.purokCoors.id,
        bcID: data?.team?.teamLeader?.barangayCoor.id,
        level: level,
      },
    });
  };

  console.log(data?.team);

  if (loading) {
    return (
      <div className="w-full h-full grid">
        <h1 className="m-auto text-yellow-600 text-xl font-medium">
          Loading...
        </h1>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full h-full grid">
        <h1 className="m-auto text-yellow-600 text-xl font-medium">
          Team unfound!
        </h1>
      </div>
    );
  }

  const { team } = data;

  if (!team) {
    return (
      <div className="w-full h-full grid">
        <h1 className="m-auto text-yellow-600 text-xl font-medium">
          Team members not found!
        </h1>
      </div>
    );
  }

  return (
    <div className="w-full h-auto">
      <div className="w-full p-2 border bg-slate-200 relative">
        {data.team?.teamLeader?.barangayCoor ? (
          <div
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 3)}
            draggable
            onDragStart={(e) =>
              handleDragStart(
                e,
                data.team?.teamLeader?.barangayCoor?.voter as VotersProps
              )
            }
          >
            <Popover>
              <PopoverTrigger>
                <HeaderInfo
                  level={3}
                  title={`${team.barangay.name} Barangay Coor.`}
                  fullname={`${
                    data.team.teamLeader?.barangayCoor.voter?.lastname as string
                  }, ${
                    data.team.teamLeader?.barangayCoor.voter
                      ?.firstname as string
                  }-(${data.team.teamLeader.barangayCoor.voter?.idNumber})`}
                />
              </PopoverTrigger>
              <PopoverContent>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setOnOpen(2);
                    setLevel(3);
                  }}
                >
                  Change
                </Button>
                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => {
                    navigate(
                      `/teams/${data.team?.teamLeader?.barangayCoor.teamId}`
                    );
                  }}
                >
                  View Team
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          (data.team?.level === 1 || data.team?.level === 2) && (
            <div className="w-1/4 flex justify-center mb-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setOnOpen(2);
                  setLevel(3);
                }}
              >
                Assign BC
              </Button>
            </div>
          )
        )}
        {data.team?.teamLeader?.purokCoors ? (
          <div
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 2)}
            draggable
            onDragStart={(e) =>
              handleDragStart(
                e,
                data.team?.teamLeader?.purokCoors?.voter as VotersProps
              )
            }
          >
            <Popover>
              <PopoverTrigger>
                {" "}
                <HeaderInfo
                  level={2}
                  title={`${team.barangay.name} Purok Coor.`}
                  fullname={`${
                    data.team.teamLeader.purokCoors.voter?.lastname as string
                  }, ${
                    data.team.teamLeader.purokCoors.voter?.firstname as string
                  }-(${data.team.teamLeader.purokCoors.voter?.idNumber})`}
                />
              </PopoverTrigger>
              <PopoverContent>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => {
                    setOnOpen(2);
                    setLevel(2);
                  }}
                >
                  {data.team.teamLeader.purokCoors ? "Change" : "Assign"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => {
                    navigate(
                      `/teams/${data.team?.teamLeader?.purokCoors.teamId}`
                    );
                  }}
                >
                  View Team
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          data.team?.level === 1 && (
            <div className="w-1/4 flex justify-center">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setOnOpen(2);
                  setLevel(2);
                }}
              >
                Assign PC
              </Button>
            </div>
          )
        )}
        <Popover>
          <PopoverTrigger>
            <div
              id="team-leader"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 1)}
              //draggable
              onDragStart={(e) =>
                handleDragStart(e, data.team?.teamLeader?.voter as VotersProps)
              }
            >
              <h1 className="font-medium text-slate-600 text-xl hover:underline">
                {data.team?.teamLeader?.voter?.lastname},{" "}
                {handleAltText(
                  data.team?.teamLeader?.voter?.firstname,
                  "Vacant"
                )}
                -({data.team?.teamLeader?.voter?.idNumber})
              </h1>
            </div>
          </PopoverTrigger>
          <PopoverContent className="max-w-60 flex flex-col gap-2">
            <Button variant="outline" onClick={() => setOnOpenModal(1)}>
              Change
            </Button>
            <Button variant="outline" onClick={() => setOnOpenModal(2)}>
              Vacant
            </Button>
            <Button
              variant="outline"
              onClick={() => setOnOpenModal(2)}
              disabled
            >
              Switch
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setOnOpen(2);
                setLevel(data.team?.level as number);
              }}
            >
              Transfer Group
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setOnOpen(4);
                setLevel(1);
              }}
            >
              Calibrate
            </Button>

            {/* <Button
              className=" bg-blue-400 hover:bg-blue-500"
              variant="outline"
              onClick={() => setOnOpenModal(2)}
            >
              Profile
            </Button> */}
          </PopoverContent>
        </Popover>

        <h1 className="text-sm font-mono font-medium italic">
          {team.barangay.name} {handleLevel(team?.level as number)}
        </h1>

        <div className="w-auto absolute right-2 top-3">
          <Popover>
            <PopoverTrigger>
              <Button variant="secondary" size="sm">
                <FaEllipsisVertical />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="flex flex-col gap-1">
              <Button
                onClick={() => {
                  setSelectedList([]);
                  setOnMultiSelect(!onMultiSelect);
                }}
                variant="outline"
              >
                {onMultiSelect ? "Cancel" : "Multi select"}
              </Button>
              {onMultiSelect && (
                <Button
                  onClick={() => setOnOpenModal(7)}
                  disabled={!selectedList.length}
                  variant="outline"
                >
                  Remove
                </Button>
              )}
              <Button onClick={() => setOnOpenModal(4)} variant="outline">
                Add {handleLevel((team.level as number) - 1)}
              </Button>
              <Button
                disabled={selectedList.length === 0}
                variant="outline"
                onClick={() => {
                  setOnOpen(5);
                  setLevel(team.level);
                }}
              >
                Transfer
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setOnOpen(7);
                }}
              >
                Change Level
              </Button>
              {/* <Button
                variant="outline"
                disabled
                onClick={() => navigate(`/teams/${teamId}/qrCodes`)}
              >
                QR codes
              </Button> */}
              <Button variant="destructive" onClick={() => setOnOpenModal(8)}>
                Disband
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <Table>
        <TableHeader>
          {onMultiSelect && (
            <TableHead className="flex items-center gap-2">Select</TableHead>
          )}
          <TableHead>No.</TableHead>
          <TableHead>Tag ID</TableHead>
          <TableHead>Member ({team?.voters.length})</TableHead>
          <TableHead>Purok</TableHead>
          <TableHead>Level</TableHead>
          <TableHead>Issues</TableHead>
        </TableHeader>

        <TableBody>
          {team?.voters
            .filter((item) => item.id !== team?.teamLeader?.voter?.id)
            .map((item, i) => (
              <TableRow
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                className={` cursor-pointer hover:bg-slate-200`}
                onClick={() => {
                  if (onMultiSelect) {
                    handleSelectMultipleVoter(
                      item.id,
                      handleCheckState(item.id)
                    );
                    return;
                  }
                  if (item.level !== 0) {
                    navigate(`/teams/${item.leader?.teamId}`);
                    return;
                  }
                }}
                key={item.id}
              >
                {onMultiSelect && (
                  <TableCell>
                    <Checkbox checked={handleCheckState(item.id)} />
                  </TableCell>
                )}

                <TableCell>{i + 1}</TableCell>
                <TableCell>{item.idNumber}</TableCell>

                <TableCell>
                  {item.lastname}, {item.firstname}
                </TableCell>
                <TableCell>{item.purok?.purokNumber}</TableCell>

                <TableCell>{handleLevel(item.level as number)}</TableCell>
                <TableCell
                  onClick={(e) => {
                    e.stopPropagation();
                    setOnOpenModal(10);
                  }}
                  className="hover:underline"
                >
                  {[...item.record].at(0)?.desc ?? "None"}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <Modal
        className="max-w-5xl"
        title={`Change ${handleLevel(team?.level as number)}`}
        open={onOpenModal === 1}
        onOpenChange={() => {
          setSelectedVoters(undefined);
          setOnOpenModal(0);
        }}
        footer={true}
        children={
          <>
            <h1 className="py-2 text-sm font-medium">Select a voter</h1>
            <SearchVoters
              selectedVoter={selectedVoters}
              setSelectedVoter={setSelectedVoters}
              level={0}
              barangaysId={team.barangaysId}
            />
          </>
        }
      />
      <Modal
        className="max-w-sm"
        title="Vacant Team leader"
        children="Are you sure you want to vacant the team leader?"
        footer={true}
        loading={updatingLeader}
        open={onOpenModal === 2}
        onFunction={() => handleUpdateLeader(0)}
        onOpenChange={() => {
          if (updatingLeader) {
            return;
          }
          setOnOpenModal(0);
        }}
      />
      <Modal
        title="Proceed?"
        className="max-w-sm"
        footer={true}
        loading={updating}
        open={onOpenModal === 5}
        onFunction={handleChangLeader}
        onOpenChange={() => {
          setSelectedVoters(undefined);
          setOnOpenModal(0);
        }}
      />
      <Modal
        className="max-w-sm"
        title="Disband"
        children="Are you sure you want to disband this team?"
        open={onOpenModal === 3}
        onOpenChange={() => {
          setOnOpenModal(0);
        }}
      />
      <Modal
        className=" max-w-5xl max-h-[80%] overflow-auto"
        title={`Add ${handleLevel(team.level - 1)}`}
        children={
          <AddMembers
            setOnOpenModal={setOnOpenModal}
            head={team?.teamLeader?.votersId as string}
            level={team.level}
            barangaysId={team.barangaysId}
          />
        }
        open={onOpenModal === 4}
        onOpenChange={() => {
          setOnOpenModal(0);
        }}
      />

      <Modal
        title="Update team members"
        onFunction={handleMultilSelect}
        loading={multiSelectIsLoading}
        footer={true}
        open={onOpenModal === 7}
        onOpenChange={() => {
          setOnOpenModal(0);
        }}
      />

      <Modal
        title="Remove team"
        className="max-w-sm"
        onFunction={handleRemove}
        loading={removing}
        footer={true}
        open={onOpenModal === 8}
        onOpenChange={() => {
          setOnOpenModal(0);
        }}
      />
      <Modal
        title="Voter's Records"
        className="min-w-40"
        onFunction={handleRemove}
        loading={removing}
        open={onOpenModal === 10}
        onOpenChange={() => {
          setOnOpenModal(0);
        }}
      />

      <Modal
        className=" max-w-sm"
        title="Switch"
        footer={true}
        onFunction={handleSwpped}
        loading={swapping}
        children={<div className="w-full h-auto"></div>}
        open={onOpen === 1}
        onOpenChange={() => {
          if (swapping) return;
          setOnOpen(0);
        }}
      />
      <Modal
        className=" max-h-[500px] overflow-auto max-w-5xl"
        title={`Assign ${handleLevel(level)}`}
        children={
          <div className="w-full h-auto">
            <FigureHeads
              index={3}
              handleSelectHead={handleSelectHead}
              level={level}
              barangaysId={data.team?.barangay.id as string}
            />
          </div>
        }
        open={onOpen === 2}
        onOpenChange={() => {
          if (swapping) return;
          setOnOpen(0);
        }}
      />

      <Modal
        className=" max-h-[500px] overflow-auto max-w-5xl"
        title={`Assign ${handleLevel(level)}`}
        children={
          <div className="w-full h-auto">
            <FigureHeads
              index={4}
              handleSelectHead={handleSelectHead}
              level={team.level as number}
              barangaysId={data.team?.barangay.id as string}
            />
          </div>
        }
        open={onOpen === 5}
        onOpenChange={() => {
          if (swapping) return;
          setLevel(0);
          setOnOpen(0);
        }}
      />

      <Modal
        className="max-w-sm"
        title="Assign selected PC"
        footer={true}
        onFunction={handleAssignHeads}
        loading={assgining}
        children={
          <div className="w-full h-auto">
            <h1 className="font-mono">
              {selectHead?.voter?.lastname}, {selectHead?.voter?.firstname}
            </h1>
          </div>
        }
        open={onOpen === 6}
        onOpenChange={() => {
          if (assgining) return;
          setOnOpen(0);
        }}
      />

      <Modal
        className="max-w-sm"
        title="Assign selected PC"
        footer={true}
        onFunction={handleAssignHeads}
        loading={assgining}
        children={
          <div className="w-full h-auto">
            <h1 className="font-mono">
              {selectHead?.voter?.lastname}, {selectHead?.voter?.firstname}
            </h1>
          </div>
        }
        open={onOpen === 3}
        onOpenChange={() => {
          if (assgining) return;
          setOnOpen(0);
        }}
      />

      <Modal
        className="max-w-sm"
        title="Calidbrate"
        footer={true}
        onFunction={handleCalibrateTeam}
        loading={calibrating}
        children={
          <div className="w-full h-auto">
            <h1 className="text-sm font-medium">
              Refresh the viewed Team meta data, this will fix the visibility of
              the team.
            </h1>
          </div>
        }
        open={onOpen === 4}
        onOpenChange={() => {
          if (calibrating) return;
          setOnOpen(0);
        }}
      />

      <Modal
        className="max-w-5xl"
        title="Change Level"
        onFunction={handleAssignHeads}
        loading={assgining}
        children={
          <div className="w-full h-auto">
            <p>
              If the team to be change is with level of TL of PC, the members as
              well.
            </p>
            {/* <div className="flex flex-col gap-2 mt-4">
              {" "}
              {["BC", "PC", "TL"].map((item, i) => (
                <Button
                  variant={level === i + 1 ? "default" : "outline"}
                  onClick={() => setLevel(i + 1)}
                >
                  {item}
                </Button>
              ))}
            </div> */}
            <ChangeLevel
              barangaysId={data.team?.barangaysId as string}
              teamId={data?.team?.id as string}
              currentTl={data.team?.teamLeaderId as string}
            />
          </div>
        }
        open={onOpen === 7}
        onOpenChange={() => {
          if (assgining) return;
          setOnOpen(0);
        }}
      />
      <Modal
        className=" max-w-sm"
        title="Switch"
        footer={true}
        onFunction={handleSwpped}
        loading={swapping}
        children={
          <div className="w-full h-auto">
            <h1 className=" font-mono">
              {droppedItem?.lastname}, {droppedItem?.firstname}
            </h1>
          </div>
        }
        open={onOpen === 11}
        onOpenChange={() => {
          if (swapping) return;
          setDroppedItem(null);
          setLevel(0);
          setOnOpen(0);
        }}
      />
    </div>
  );
};

export default Groups;
