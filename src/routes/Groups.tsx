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
// import { Checkbox } from "../components/ui/checkbox";
import { FaEllipsisVertical } from "react-icons/fa6";
//props
import { TeamProps, VotersProps } from "../interface/data";

//Graphql
import { GET_TEAM_INFO } from "../GraphQL/Queries";
import {
  CHANGE_LEADER,
  UPDATE_LEADER,
  UDPATE_TEAM_MEMBERS,
  REMOVE_TEAM,
} from "../GraphQL/Mutation";
import { useQuery, useMutation } from "@apollo/client";

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
  const { teamId } = useParams();
  const navigate = useNavigate();

  const { data, loading, refetch, error } = useQuery<{
    team: TeamProps | null;
  }>(GET_TEAM_INFO, {
    variables: { id: teamId },
    skip: !teamId,
  });

  console.log({ error });

  const [changeLeader, { loading: updating, error: updateError }] =
    useMutation(CHANGE_LEADER);

  const [updateLeader, { loading: updatingLeader }] =
    useMutation(UPDATE_LEADER);

  const [
    multiSelectVoter,
    { loading: multiSelectIsLoading, error: multiSelectError },
  ] = useMutation(UDPATE_TEAM_MEMBERS);

  const [removeTeam, { loading: removing }] = useMutation(REMOVE_TEAM);

  useEffect(() => {
    if (selectedVoters) {
      setOnOpenModal(5);
      return;
    }
  }, [selectedVoters]);

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
        level: team.level,
      },
    });
    if (response.errors) {
      toast("Failed!");
      return;
    }
  };

  const handleUpdateLeader = async (method: number) => {
    if (!team) {
      toast("Required date missing", {
        description: "Try refresh the page and try again.",
      });
      return;
    }
    if (!team.teamLeader) {
      toast("Already vacant!", {
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
      toast("Error removing team", {
        description: "An error occurred",
      });
    }
  };

  return (
    <div className="w-full h-auto">
      <div className="w-full p-2 border bg-slate-200 relative">
        {data.team?.teamLeader?.barangayCoor && (
          <HeaderInfo
            title={`${team.barangay.name} Barangay Coor."`}
            fullname={`${
              data.team.teamLeader?.barangayCoor.voter?.lastname as string
            }, ${
              data.team.teamLeader?.barangayCoor.voter?.firstname as string
            }-(${data.team.teamLeader.barangayCoor.voter?.idNumber})`}
          />
        )}
        {data.team?.teamLeader?.purokCoors && (
          <HeaderInfo
            title={`${team.barangay.name} Purok Coor."`}
            fullname={`${
              data.team.teamLeader.purokCoors.voter?.lastname as string
            }, ${data.team.teamLeader.purokCoors.voter?.firstname as string}-(${
              data.team.teamLeader.purokCoors.voter?.idNumber
            })`}
          />
        )}
        <Popover>
          <PopoverTrigger>
            <h1 className="font-medium text-slate-600 text-xl hover:underline">
              {data.team?.teamLeader?.voter?.lastname},{" "}
              {handleAltText(data.team?.teamLeader?.voter?.firstname, "Vacant")}
            </h1>
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
              <Button variant="outline" disabled>
                Transfer
              </Button>
              <Button
                variant="outline"
                disabled
                onClick={() => navigate(`/teams/${teamId}/qrCodes`)}
              >
                QR codes
              </Button>
              <Button variant="destructive" onClick={() => setOnOpenModal(8)}>
                Disband
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <Table>
        <TableHeader>
          {/* {onMultiSelect && (
            <TableHead className="flex items-center gap-2">
              <Checkbox />
              Select all
            </TableHead>
          )} */}
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
                className={` cursor-pointer hover:bg-slate-200 ${
                  handleCheckState(item.id) ? "bg-slate-300" : ""
                }`}
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
            />
          </>
        }
      />
      <Modal
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
        className="min-w-40"
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
    </div>
  );
};

export default Groups;
