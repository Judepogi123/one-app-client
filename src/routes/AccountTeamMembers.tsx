import { useEffect, useState } from "react";
//hoooks
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import hotkeys from "hotkeys-js";
//queries
import { GET_ACCOUNT_TEAM_INFO } from "../GraphQL/Queries";
//mutation
import {
  MARK_MEMBER_VERIFIED,
  MARK_TEAM_VERIFIED,
  UPDATE_MEMBER_PROPS,
  SWAP_VOTERS,
  EXCLUDE_VOTERS,
  UNTRACK_MEMBERS,
  ADD_MEMBERS,
} from "../GraphQL/Mutation";
//layout
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "../components/ui/table";
import { Checkbox } from "../components/ui/checkbox";
import Modal from "../components/custom/Modal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
//props
import { TeamProps, VotersProps } from "../interface/data";
import Loading from "../components/custom/Loading";
import { toast } from "sonner";
import { formatTimestamp } from "../utils/date";

//icons
import { CiSearch } from "react-icons/ci";
import SearchVoters from "../layout/SearchVoters";
const AccountTeamMembers = () => {
  const { accountTeamID, userID } = useParams();
  const [onOpen, setOnOpen] = useState(0);
  const [onMultiSelect, setOnMultiSelect] = useState(false);
  const [selectedIDS, setSelectedIDS] = useState<string[]>([]);
  const [selectedVoters, setSelectedVoters] = useState<VotersProps[]>([]);
  const [droppedItem, setDroppedItem] = useState<VotersProps | null>(null);
  const [selected, setSelected] = useState<VotersProps | undefined>(undefined);
  const { data, loading, error } = useQuery<{
    team: TeamProps | null;
  }>(GET_ACCOUNT_TEAM_INFO, {
    variables: {
      id: accountTeamID,
    },
    skip: !accountTeamID,
  });

  console.log("Error, ", error?.message);
  console.log({ data });

  const handleSelectIds = (id: string) => {
    setSelectedIDS((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCheckId = (id: string) => selectedIDS.includes(id);

  const [markMember, { loading: memberLoading }] = useMutation(
    MARK_MEMBER_VERIFIED,
    {
      onCompleted: () => {
        toast.success("Marked as verified", {
          closeButton: false,
        });
        setOnOpen(0);
      },
      onError: (err) => {
        toast.error("Failed to mark as verified", {
          closeButton: false,
          description: err.message,
        });
      },
      refetchQueries: [
        { query: GET_ACCOUNT_TEAM_INFO, variables: { id: accountTeamID } },
      ],
    }
  );

  useEffect(() => {
    hotkeys("ctrl+k", (event) => {
      event.preventDefault();
      setOnOpen(5);
    });
    hotkeys("ctrl+d", (event) => {
      event.preventDefault();
      if (selectedIDS.length === 0) return;
      setOnOpen(4);
    });

    return () => {
      hotkeys.unbind("ctrl+k");
    };
  }, []);

  const handleMarkTeamMember = async () => {
    if (selectedIDS.length === 0) {
      toast.warning("Please select at least one team member", {
        closeButton: false,
      });
      return;
    }

    await markMember({
      variables: {
        memberId: selectedIDS.map((item) => item),
      },
    });
  };

  const [markTeam, { loading: teamLoading }] = useMutation(MARK_TEAM_VERIFIED, {
    onCompleted: () => {
      toast.success(
        `${
          data?.team?.AccountValidateTeam
            ? "Varified cancelled"
            : "Marked as validated"
        }`,
        {
          closeButton: false,
        }
      );
      setOnOpen(0);
    },
    onError: (err) => {
      toast.error("Failed to mark as validated", {
        closeButton: false,
        description: err.message,
      });
      console.log(err);
    },
    refetchQueries: [
      { query: GET_ACCOUNT_TEAM_INFO, variables: { id: accountTeamID } },
    ],
  });

  const handleMarkTeam = async () => {
    if (!data?.team) {
      toast.warning("Team data no found!", {
        closeButton: false,
      });
      return;
    }
    if (!userID) {
      toast.warning("User ID not found", {
        closeButton: false,
      });
      return;
    }

    await markTeam({
      variables: {
        teamId: accountTeamID,
        accountID: userID,
      },
    });
  };

  const [updateTeamMembers, { loading: memberUpdating }] = useMutation(
    UPDATE_MEMBER_PROPS,
    {
      onCompleted: () => {
        toast.success(`Update success!`, {
          closeButton: false,
        });
        setOnOpen(0);
      },
      onError: (err) => {
        toast.error("Failed to update the selectd team member", {
          closeButton: false,
          description: err.message,
        });
        console.log(err);
      },
      refetchQueries: [
        { query: GET_ACCOUNT_TEAM_INFO, variables: { id: accountTeamID } },
      ],
    }
  );

  const handleUpdateProps = async (props: string) => {
    if (selectedIDS.length === 0) {
      toast.warning("Please select at least one team member", {
        closeButton: false,
      });
      return;
    }
    await updateTeamMembers({
      variables: {
        memberId: selectedIDS.map((item) => item),
        props,
      },
    });
  };

  const [swapVoters, { loading: swapping }] = useMutation(SWAP_VOTERS, {
    onCompleted: () => {
      toast.success("Swap success!", {
        closeButton: false,
      });
      setOnOpen(0);
    },
    refetchQueries: [
      { query: GET_ACCOUNT_TEAM_INFO, variables: { id: accountTeamID } },
    ],
  });

  const [memberExclude, { loading: excluding }] = useMutation(EXCLUDE_VOTERS, {
    onCompleted: () => {
      toast.success("Member Excluded succsessfully!", {
        closeButton: false,
      });
      setOnOpen(0);
    },
    refetchQueries: [
      { query: GET_ACCOUNT_TEAM_INFO, variables: { id: accountTeamID } },
    ],
  });

  const handleExcludeMembers = async () => {
    if (selectedIDS.length === 0) {
      toast.warning("Please select at least one team member", {
        closeButton: false,
      });
      return;
    }
    await memberExclude({
      variables: {
        membersId: selectedIDS.map((item) => item),
      },
    });
  };

  const handleSwpped = async () => {
    if (!data?.team?.teamLeader?.votersId) {
      toast.error("TL ID not found");
      return;
    }
    if (!droppedItem) {
      return;
    }
    await swapVoters({
      variables: {
        voterOneId: droppedItem.id,
        voterTwoId: data.team.teamLeader.votersId,
      },
    });
  };

  const [markUntracked, { loading: untracking }] = useMutation(
    UNTRACK_MEMBERS,
    {
      onCompleted: () => {
        toast.success("Selected tracked/untracled successfully!", {
          closeButton: false,
        });
        setOnOpen(0);
      },
      onError: () => {
        toast.error("Failed to mark tracked/untracked!", {
          closeButton: false,
        });
      },
      refetchQueries: [
        { query: GET_ACCOUNT_TEAM_INFO, variables: { id: accountTeamID } },
      ],
    }
  );

  const handleUntracked = async () => {
    if (selectedIDS.length === 0) {
      toast.warning("Please select at least one member");
      return;
    }
    await markUntracked({
      variables: {
        memberId: selectedIDS.map((item) => item),
      },
    });
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    item: VotersProps
  ) => {
    e.dataTransfer.setData("application/json", JSON.stringify(item));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const item = e.dataTransfer.getData("application/json");

    if (item) {
      try {
        const voterData: VotersProps = JSON.parse(item);
        setDroppedItem(voterData);
        setOnOpen(3);
      } catch (error) {
        toast.error("Error parsing voter data.");
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  useEffect(() => {
    const main = () => {
      let copy = [...selectedVoters];
      const matchedIndex = copy.findIndex((item) => item?.id === selected?.id);
      if (matchedIndex !== -1) {
        return;
      } else {
        copy.push(selected as VotersProps);
      }
      setSelectedVoters(copy);
    };
    main();
  }, [selected]);

  const handleRemoveSelected = (id: string) => {
    setSelectedVoters((prev) => {
      const filtered = prev.filter((item) => item?.id !== id);
      return filtered;
    });
  };

  const [addMembers, { loading: adding }] = useMutation(ADD_MEMBERS, {
    onCompleted: () => {
      toast.success("Successfully added the selected voters!", {
        closeButton: false,
      });
      setOnOpen(0);
    },
    onError: (err) => {
      toast.error("Failed add selected voters!", {
        closeButton: false,
        description: `${err.message}`,
      });
    },
    refetchQueries: [
      { query: GET_ACCOUNT_TEAM_INFO, variables: { id: accountTeamID } },
    ],
  });

  const handleAddMembers = async () => {
    await addMembers({
      variables: {
        level: 0,
        teamIdList: selectedVoters.map((item) => {
          return {
            id: item.id,
            lastname: item.lastname,
            firstname: item.firstname,
            status: item.status,
            level: item.level,
            barangaysId: item.barangay.id,
            municipalsId: item.municipal.id,
            purokId: item.purok?.id,
          };
        }),
        headId: data?.team?.teamLeader?.votersId,
        teamId: data?.team?.id,
      },
    });
  };

  if (loading) {
    return <Loading />;
  }

  if (!data) {
    return (
      <div className="w-full h-1/2">
        <p className="text-center font-medium">NO DATA FOUND</p>
      </div>
    );
  }

  return (
    <div className="w-full h-auto">
      <div className="w-full flex justify-between items-center p-2 bg-slate-100">
        <div
          className="w-auto"
          id="team-leader"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {data.team?.AccountValidateTeam && (
            <h1 className="text-sm italic mb-2">
              Validated at:{" "}
              {formatTimestamp(
                data.team.AccountValidateTeam.timstamp as string
              )}
            </h1>
          )}
          <div>
            {" "}
            <h1 className="font-medium hover:underline cursor-pointer">
              {data.team?.teamLeader?.voter?.lastname},{" "}
              {data.team?.teamLeader?.voter?.firstname} (
              {data.team?.teamLeader?.voter?.idNumber})
            </h1>
          </div>

          <p className="text-sm">Members: {data.team?._count.voters ?? 0}</p>
        </div>
        <div className="w-auto flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="w-auto flex items-center gap-1 text-gray-600 border border-gray-500"
            onClick={() => setOnOpen(5)}
          >
            <CiSearch /> Ctrl + k
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedIDS([]);
              setOnMultiSelect(!onMultiSelect);
            }}
          >
            {onMultiSelect ? "Cancel" : "Select"}
          </Button>
          {selectedIDS.length > 0 ? (
            <Popover>
              <PopoverTrigger>
                <Button variant="outline" size="sm">
                  {`Action for`}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[250px]">
                <div className="">
                  <p className="text-sm font-medium">
                    Selected {selectedIDS.length}
                  </p>
                  <div className="w-full py-2">
                    <p className="text-sm text-center">Taggings</p>
                  </div>
                  <div className="w-full grid grid-cols-2 gap-2">
                    <Button
                      disabled={memberUpdating}
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateProps("oor")}
                    >
                      OR/IR
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateProps("inc")}
                    >
                      INC/NON-INC
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateProps("status")}
                    >
                      DEAD/ALIVE
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setOnOpen(4)}
                    >
                      Exclude
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setOnOpen(6)}
                    >
                      Un/Tracked
                    </Button>
                  </div>
                </div>
                <div className="w-full mt-4">
                  <p></p>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => setOnOpen(2)}
                  >
                    Mark selected As Verified
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          ) : null}
          <Button
            size="sm"
            onClick={() => {
              setOnOpen(1);
            }}
          >
            {data.team?.AccountValidateTeam
              ? "Undo Verification"
              : "Mark as Verified"}
          </Button>
        </div>
      </div>

      <div className="w-full h-auto">
        {data.team ? (
          <Table>
            <TableHeader>
              {onMultiSelect && <TableHead>Select</TableHead>}
              <TableHead>No.</TableHead>
              <TableHead>Lastname</TableHead>
              <TableHead>Firstname</TableHead>
              <TableHead>ID Number</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Date Validated</TableHead>
              <TableHead>Untracked</TableHead>
            </TableHeader>
            <TableBody>
              {data.team.voters.map((item, i) => (
                <MemberItem
                  handleDragStart={handleDragStart}
                  i={i}
                  item={item}
                  handleCheckId={handleCheckId}
                  handleSelectIds={handleSelectIds}
                  onMultiSelect={onMultiSelect}
                />
              ))}
            </TableBody>
          </Table>
        ) : (
          <div></div>
        )}
      </div>

      <Modal
        title={
          data.team?.AccountHandleTeam ? "Undo Validated" : "Mark as Validated"
        }
        onFunction={handleMarkTeam}
        loading={teamLoading}
        footer={true}
        className="max-w-sm"
        children={<div className="w-full"></div>}
        open={onOpen === 1}
        onOpenChange={() => {
          if (teamLoading) return;
          setOnOpen(0);
        }}
      />

      <Modal
        title="Mark Selected member as Validated"
        onFunction={handleMarkTeamMember}
        loading={memberLoading}
        footer={true}
        className="max-w-lg"
        children={<div className="w-full"></div>}
        open={onOpen === 2}
        onOpenChange={() => {
          if (memberLoading) return;
          setOnOpen(0);
        }}
      />

      <Modal
        title="Swap TL and Member"
        onFunction={handleSwpped}
        loading={swapping}
        footer={true}
        className="max-w-lg"
        children={<div className="w-full"></div>}
        open={onOpen === 3}
        onOpenChange={() => {
          if (memberLoading) return;
          setOnOpen(0);
          setDroppedItem(null);
        }}
      />

      <Modal
        title="Excude selected members from this team"
        onFunction={handleExcludeMembers}
        loading={excluding}
        footer={true}
        className="max-w-md"
        children={<div className="w-full"></div>}
        open={onOpen === 4}
        onOpenChange={() => {
          if (excluding) return;
          setOnOpen(0);
        }}
      />
      <Modal
        title="Search"
        onFunction={handleExcludeMembers}
        className="max-w-5xl max-h-[500px] overflow-auto"
        children={
          <div className="w-full">
            <SearchVoters
              selectedVoter={selected}
              setSelectedVoter={setSelected}
              level={0}
            />
            {selectedVoters.length > 0 && (
              <div className="w-full p-2">
                <h1 className="font-medium">
                  Select Voters to add to the viewed team
                </h1>
                {selectedVoters.map((item) => (
                  <div
                    key={item?.id}
                    onClick={() => handleRemoveSelected(item.id)}
                    className="p-2 border w-full bg-white rounded-sm mt-1 cursor-pointer hover:bg-slate-200"
                  >
                    <h1 className="text-sm">
                      {item?.lastname}, {item?.firstname}
                    </h1>
                  </div>
                ))}
                <div className="w-full p-2">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => setOnOpen(7)}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}
          </div>
        }
        open={onOpen === 5}
        onOpenChange={() => {
          if (excluding) return;
          setSelectedVoters([]);
          setOnOpen(0);
        }}
      />

      <Modal
        title="Mark tracked/untracked"
        className="max-w-md"
        open={onOpen === 6}
        footer={true}
        onFunction={handleUntracked}
        loading={untracking}
        onOpenChange={() => {
          if (untracking) return;
          setOnOpen(0);
        }}
      ></Modal>

      <Modal
        title="Add selected members to the viewed team"
        className="max-w-md"
        open={onOpen === 7}
        footer={true}
        onFunction={handleAddMembers}
        loading={adding}
        onOpenChange={() => {
          if (adding) return;
          setOnOpen(0);
        }}
      ></Modal>
    </div>
  );
};

export default AccountTeamMembers;

const MemberItem = ({
  handleCheckId,
  handleSelectIds,
  onMultiSelect,
  item,
  i,
  handleDragStart,
}: {
  handleCheckId: (id: string) => boolean;
  handleSelectIds: (id: string) => void;
  onMultiSelect: boolean;
  item: VotersProps;
  i: number;
  handleDragStart: (
    e: React.DragEvent<HTMLDivElement>,
    item: VotersProps
  ) => void;
}) => {
  return (
    <TableRow
      draggable
      onDragStart={(e) => handleDragStart(e, item)}
      onClick={(e) => {
        e.preventDefault();
        if (!onMultiSelect) {
          return;
        }
        handleSelectIds(item.id);
      }}
      key={item.id}
      className=" cursor-pointer hover:bg-slate-200 z-50"
    >
      {onMultiSelect && (
        <TableCell>
          <Checkbox
            checked={handleCheckId(item.id)}
            onCheckedChange={() => handleSelectIds(item.id)}
          />
        </TableCell>
      )}
      <TableCell>{i + 1}</TableCell>
      <TableCell>{item.lastname}</TableCell>
      <TableCell>{item.firstname}</TableCell>
      <TableCell>{item.idNumber}</TableCell>
      <TableCell>
        [{item.oor === "YES" && "OR, "}
        {item.inc === "YES" && "INC, "}
        {item.status === 0 && "D, "}]
      </TableCell>
      <TableCell>
        {item?.ValdilatedMember?.timestamp
          ? formatTimestamp(item.ValdilatedMember.timestamp)
          : "N/A"}
      </TableCell>
      <TableCell>
        {item.untracked ? formatTimestamp(item.untracked.timestamp) : "N/A"}
      </TableCell>
    </TableRow>
  );
};
