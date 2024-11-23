/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
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
import { Checkbox } from "../components/ui/checkbox";
import { FaEllipsisVertical } from "react-icons/fa6";
//props
import { TeamProps, VotersProps } from "../interface/data";

//Graphql
import { GET_TEAM_INFO } from "../GraphQL/Queries";
import { CHANGE_LEADER, UPDATE_LEADER } from "../GraphQL/Mutation";
import { useQuery, useMutation } from "@apollo/client";

//utils
import { handleLevel, handleAltText } from "../utils/helper";
import { toast } from "sonner";

const Groups = () => {
  const [selectedVoters, setSelectedVoters] = useState<VotersProps | undefined>(
    undefined
  );
  const [onOpenModal, setOnOpenModal] = useState(0);
  const { teamId } = useParams();
  const navigate = useNavigate();

  const { data, loading, error, refetch } = useQuery<{
    team: TeamProps | null;
  }>(GET_TEAM_INFO, {
    variables: { id: teamId },
    skip: !teamId,
  });

  const [changeLeader, { loading: updating, error: updateError }] =
    useMutation(CHANGE_LEADER);

  console.log(updateError?.message);

  const [updateLeader, { loading: updatingLeader, error: updateLeaderError }] =
    useMutation(UPDATE_LEADER);

  useEffect(() => {
    if (selectedVoters) {
      setOnOpenModal(5);
      return;
    }
  }, [selectedVoters]);

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
  return (
    <div className="w-full h-auto">
      <div className="w-full p-2 border bg-slate-200 relative">
        <Popover>
          <PopoverTrigger>
            <h1 className="font-medium text-slate-600 text-xl hover:underline">
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
            <Button variant="outline" onClick={() => setOnOpenModal(2)}>
              Switch
            </Button>

            <Button
              className=" bg-blue-400 hover:bg-blue-500"
              variant="outline"
              onClick={() => setOnOpenModal(2)}
            >
              Profile
            </Button>
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
              <Button onClick={() => setOnOpenModal(4)} variant="outline">
                Add {handleLevel((team.level as number) - 1)}
              </Button>
              <Button variant="outline">Transfer</Button>
              <Button
                variant="outline"
                onClick={() => navigate(`/teams/${teamId}/qrCodes`)}
              >
                QR codes
              </Button>
              <Button variant="destructive" onClick={() => setOnOpenModal(3)}>
                Disband
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableHead className="flex items-center gap-2">
            <Checkbox />
            Select all
          </TableHead>
          <TableHead>Member ({team?.voters.length})</TableHead>
          <TableHead>Level</TableHead>
          <TableHead>Action</TableHead>
        </TableHeader>

        <TableBody>
          {team?.voters
            .filter((item) => item.id !== team?.teamLeader?.voter?.id)
            .map((item) => (
              <TableRow
                onClick={() => {
                  if (item.level !== 0) {
                    navigate(`/teams/${item.leader?.teamId}`);
                    return;
                  }
                }}
                key={item.id}
              >
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>
                  {item.lastname}, {item.firstname}
                </TableCell>
                <TableCell>{handleLevel(item.level as number)}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <Modal
        className="max-w-3xl"
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
        className=" max-w-3xl max-h-[80%] overflow-auto"
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
    </div>
  );
};

export default Groups;
