import { useState, useEffect } from "react";
//layout
import {
  Table,
  TableBody,
  TableRow,
  TableHead,
  TableHeader,
  TableCell,
} from "../components/ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import DeleteConfirm from "../layout/DeleteConfirm";
import AreaSelection from "../components/custom/AreaSelection";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../components/ui/popover";
import { toast } from "sonner";
//hooks
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useUserData } from "../provider/UserDataProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ValidatedTeamsFormSchema } from "../zod/data";
//grpahql
import { GET_USER_INFO, GET_TEAM_LEADERS_TEAM } from "../GraphQL/Queries";
import {
  GET_ASSIGNED_TEAMS,
  DELETE_ASSIGN_TEAM,
  SELECTED_ASSIGN,
  //UNTRACK_MEMBERS,
} from "../GraphQL/Mutation";
//props
import { UserProps, TeamProps, TeamLeaderProps } from "../interface/data";
import Modal from "../components/custom/Modal";

//
import TeamItem from "../components/item/TeamItem";

//icons
import { RiRestartFill } from "react-icons/ri";
import { RiCheckboxMultipleLine } from "react-icons/ri";
import { TbArrowsRandom } from "react-icons/tb";
import { MdOutlineAssignmentTurnedIn } from "react-icons/md";
import { MdOutlinePlaylistRemove } from "react-icons/md";
import { MdOutlineVerified } from "react-icons/md";
import { MdOutlinePreview } from "react-icons/md";

type ValidationFormProps = z.infer<typeof ValidatedTeamsFormSchema>;
const UserValidation = () => {
  const { userID } = useParams();
  const navigate = useNavigate();
  const user = useUserData();
  const [onOpen, setOnOpen] = useState(0);
  const [selectedIds, setSelectIds] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [params, setParams] = useSearchParams({
    zipCode: user?.forMunicipal ? user?.forMunicipal.toString() : "4905",
    barangay: "all",
  });

  const currentMunicipal = params.get("zipCode") || "all";
  const currentBarangay = params.get("barangay") || "all";
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
  const handleSelectIds = (id: string) => {
    setSelectIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCheckId = (id: string) => selectedIds.includes(id);

  const [page, setpage] = useState(1);
  const [selected, setSelect] = useState<{
    team: TeamProps;
    id: string;
  } | null>(null);
  const { data, loading, refetch } = useQuery<{ user: UserProps | null }>(
    GET_USER_INFO,
    {
      variables: {
        id: userID,
      },
      skip: !userID,
    }
  );

  const form = useForm<ValidationFormProps>({
    resolver: zodResolver(ValidatedTeamsFormSchema),
    defaultValues: {
      barangay: "",
      zipCOde: user?.forMunicipal ? user?.forMunicipal.toString() : "",
      take: "",
      from: "",
      maxMembers: "",
      minMembers: "",
    },
  });
  const {
    handleSubmit,
    register,
    //resetField,
    formState: { isSubmitting, errors },
    setError,
  } = form;

  const [setTeams, { loading: setingTeams }] = useMutation(GET_ASSIGNED_TEAMS, {
    onCompleted: () => {
      refetch();
      setOnOpen(0);
      toast.success("Bulk team assigned successfully!", {
        closeButton: false,
      });
    },
    onError: (error) => {
      setError("root", { message: error.message });
    },
  });

  const [selectedAssign, { loading: selectionAssigning }] = useMutation(
    SELECTED_ASSIGN,
    {
      onCompleted: () => {
        toast.success("Selected Team assigned successfully!", {
          closeButton: false,
        });
        setSelectIds([]);
        setOnOpen(0);
        refetch();
      },
      onError: (error) => {
        setError("root", { message: error.message });
      },
    }
  );

  const handleSelectionAssigment = async () => {
    if (!selectedIds.length) {
      toast.error("Please select teams to assign");
      return;
    }
    if (!userID) {
      toast.error("User not found");
      return;
    }
    await selectedAssign({
      variables: {
        userId: userID,
        ids: [...selectedIds],
      },
    });
  };

  const [deleteAssigned, { loading: deleting }] = useMutation(
    DELETE_ASSIGN_TEAM,
    {
      onCompleted: () => {
        toast.success("Team unassigned successfully!", {
          closeButton: false,
        });
        refetch();
        setOnOpen(0);
      },
      onError: (error) => {
        setError("root", { message: error.message });
      },
    }
  );

  const {
    data: teamHandles,
    //loading: tlLoading,
    refetch: teamRetch,
    //error,
  } = useQuery<{
    teamLeaderTeamHandle: TeamLeaderProps[];
  }>(GET_TEAM_LEADERS_TEAM, {
    variables: {
      zipCode: currentMunicipal,
      barangay: currentBarangay,
      level: 2,
      skip: (page - 1) * 10,
    },
  });

  const allTl =
    teamHandles?.teamLeaderTeamHandle.reduce((acc, item) => {
      return (acc += item.teamList.length);
    }, 0) ?? 0;

  useEffect(() => {
    teamRetch({
      variables: {
        zipCode: currentMunicipal,
        barangayId: currentBarangay,
        level: 2,
        skip: (page - 1) * 10,
      },
    });
  }, [currentMunicipal, currentBarangay, page]);

  const onSubmit = async (value: ValidationFormProps) => {
    let fromCount: number = 0;
    let toCount: number = 0;
    const zipCode = parseInt(value.zipCOde, 10);
    const barangaysId = parseInt(value.barangay, 10);
    const min = parseInt(value.minMembers, 10);
    const max = parseInt(value.maxMembers, 10);

    if (value.from || value.take) {
      fromCount = parseInt(value.from as string, 10) ?? 0;
      toCount = parseInt(value.take as string, 10) ?? 0;
    }

    if (toCount === 0) {
      setError("root", { message: "Invalid range input" });
      return;
    }

    await setTeams({
      variables: {
        userId: userID as string,
        zipCode,
        barangaysId,
        from: fromCount,
        take: toCount,
        max: max,
        min: min,
      },
    });
  };

  const handleSelected = (team: TeamProps, id: string) => {
    setSelect({ team, id });
    setOnOpen(4);
  };

  const handleDeleteAssign = async () => {
    if (!selected) {
      toast.warning("No team selected.", {
        description: "Please select a team.",
      });
      return;
    }
    await deleteAssigned({
      variables: {
        id: selected.id,
      },
    });
  };

  if (loading) {
    return (
      <div className="w-full text-center">
        <h1>Loading...</h1>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full text-center">
        <h1 className="">No user found</h1>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="w-full p-2 flex justify-between">
        <h1 className="text-lg font-medium">{data.user?.username}</h1>
        <div className="w-auto flex gap-3 items-center">
          <Button
            className="w-auto flex gap-2"
            variant="outline"
            size="sm"
            onClick={() => {
              setOnOpen(5);
            }}
          >
            <RiRestartFill />
            Reset
          </Button>

          <Popover>
            <PopoverTrigger>
              <Button size="sm" className="w-auto flex gap-2">
                {" "}
                <MdOutlineAssignmentTurnedIn /> Assign Team
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] flex flex-col gap-2">
              <Button
                className="w-full flex gap-2"
                variant="outline"
                size="sm"
                onClick={() => setOnOpen(3)}
              >
                <RiCheckboxMultipleLine />
                Selected
              </Button>
              <Button
                className="w-full flex gap-2"
                size="sm"
                onClick={() => setOnOpen(1)}
              >
                <TbArrowsRandom />
                Random Assign
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableHead>No</TableHead>
            <TableHead>Team Leader</TableHead>
            <TableHead>Handle</TableHead>
            <TableHead>Barangay</TableHead>
            <TableHead>Municipality</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead>Untracked</TableHead>
            <TableHead>Date Validated</TableHead>
          </TableHeader>
          <TableBody>
            {data.user?.accountHandleTeam.length === 0 ? (
              <TableRow>
                <TableCell className="w-full text-center" colSpan={9}>
                  NO assigned Team found!
                </TableCell>
              </TableRow>
            ) : (
              data.user?.accountHandleTeam.map((item, i) => (
                <TableRow
                  className="cursor-pointer hover:bg-slate-200"
                  key={i}
                  onClick={() =>
                    handleSelected(item.team as TeamProps, item.id)
                  }
                >
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>
                    {item.team?.teamLeader?.voter?.lastname},{" "}
                    {item.team?.teamLeader?.voter?.firstname}
                  </TableCell>
                  <TableCell>{item.team?._count.voters ?? 0}</TableCell>
                  <TableCell>{item.team?.barangay?.name}</TableCell>
                  <TableCell>{item.team?.municipal.name}</TableCell>
                  <TableCell>
                    {(item.team?.AccountValidateTeam &&
                      item.team.AccountValidateTeam.timstamp) ||
                      "N/A"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <Modal
        open={onOpen === 1}
        onOpenChange={() => {
          if (setingTeams || isSubmitting) return;
          setOnOpen(0);
        }}
        loading={isSubmitting}
        footer={true}
        onFunction={handleSubmit(onSubmit)}
      >
        <div>
          <form action="">
            <Form {...form}>
              <h1 className="mt-4 font-medium text-lg">Select Area</h1>
              {errors.root && (
                <h1 className="text-lg font-medium text-red-500">
                  {errors.root.message}
                </h1>
              )}
              <div className="w-full flex  gap-2">
                <FormField
                  name="zipCOde"
                  render={() => (
                    <FormItem>
                      <FormLabel>Zip Code</FormLabel>
                      <FormControl>
                        <Input
                          disabled={user?.forMunicipal ? true : false}
                          type="number"
                          {...register("zipCOde")}
                          placeholder="Enter Zip Code"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  name="barangay"
                  render={() => (
                    <FormItem>
                      <FormLabel>Barangay</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...register("barangay")}
                          placeholder="Barangay number"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <h1 className="mt-4 font-medium text-lg">Set Team Count</h1>
              <div className="w-full flex  gap-2">
                <FormField
                  name="from"
                  render={() => (
                    <FormItem>
                      <FormLabel>From</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...register("from")}
                          placeholder="Start at"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  name="take"
                  render={() => (
                    <FormItem>
                      <FormLabel>Get</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...register("take")}
                          placeholder="Get"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <h1 className="mt-4 font-medium text-lg">Set Team Parameter</h1>
              <div className="w-full flex  gap-2">
                <FormField
                  name="minMembers"
                  render={() => (
                    <FormItem>
                      <FormLabel>Min Members</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...register("minMembers")}
                          placeholder="Enter min members"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  name="maxMembers"
                  render={() => (
                    <FormItem>
                      <FormLabel>Max Members</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...register("maxMembers")}
                          placeholder="Enter max members"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </Form>
          </form>
        </div>
      </Modal>
      <Modal
        title="Remove Team"
        onFunction={() => handleDeleteAssign()}
        open={onOpen === 2}
        loading={deleting}
        footer={true}
        onOpenChange={() => {
          setSelect(null);
          setOnOpen(0);
        }}
      >
        <div>
          <h1 className="text-sm font-medium">
            Are you sure you want to remove{" "}
            {selected?.team.teamLeader?.voter?.lastname},{" "}
            {selected?.team.teamLeader?.voter?.firstname} from this user?
          </h1>
        </div>
      </Modal>
      <Modal
        open={onOpen === 3}
        onOpenChange={() => setOnOpen(0)}
        footer={true}
        loading={selectionAssigning}
        onFunction={() => handleSelectionAssigment()}
        className="w-full max-h-[600px] max-w-3xl overflow-auto"
      >
        <div className="w-full bg-white">
          <div className="w-full p-2 flex gap-2 items-center">
            <h1>Selected Teams: {selectedIds.length}</h1>

            <Button size="sm" onClick={() => setSelectIds([])}>
              Reset
            </Button>
          </div>
          <AreaSelection
            disabled={user?.forMunicipal ? true : false}
            defaultValue={
              user?.forMunicipal ? user?.forMunicipal.toString() : "4905"
            }
            handleChangeOption={handleChangeOption}
            currentMunicipal={currentMunicipal}
            currentBarangay={currentBarangay}
            currentPurok={""}
          />
        </div>
        <div className="w-full flex flex-col gap-1">
          <h1>{allTl}</h1>
          {teamHandles?.teamLeaderTeamHandle.map((group, index) => (
            <div className="w-full flex flex-col gap-2 border border-gray-600 rounded-sm p-2 bg-white">
              <h1>
                {index + 1}. {group.voter?.lastname}, {group.voter?.firstname}
              </h1>
              {group.teamList.map((item, i) => (
                <TeamItem
                  userID={userID}
                  page={page}
                  index={i}
                  key={item.id}
                  team={item}
                  handleCheckId={handleCheckId}
                  handleSelectIds={handleSelectIds}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="w-full p-2 flex justify-center gap-2 items-center">
          <Button
            disabled={page === 1}
            variant="outline"
            onClick={() => setpage((prev) => prev - 1)}
          >
            Prev
          </Button>
          <h1 className="font-medium text-slate-600 text-sm">Page: {page}</h1>
          <Button variant="outline" onClick={() => setpage((prev) => prev + 1)}>
            Next
          </Button>
        </div>
      </Modal>

      <Modal
        className="max-w-md"
        open={onOpen === 4}
        onOpenChange={() => setOnOpen(0)}
      >
        <div className="w-full flex mb-3">
          <h1 className="text-sm font-medium">
            Team: {selected?.team.teamLeader?.voter?.lastname},{" "}
            {selected?.team.teamLeader?.voter?.firstname}
          </h1>
        </div>
        <div className="w-full flex flex-col gap-2">
          <Button
            className="w-auto flex gap-1"
            onClick={() =>
              navigate(`/manage/validation/${userID}/${selected?.team.id}`)
            }
          >
            <MdOutlinePreview />
            View Team
          </Button>
          <Button className="w-auto flex gap-1" variant="outline">
            <MdOutlineVerified />
            Mark as validated
          </Button>
          <Button
            className="w-auto flex gap-1"
            variant="destructive"
            onClick={() => setOnOpen(2)}
          >
            <MdOutlinePlaylistRemove /> Remove Team
          </Button>
        </div>
      </Modal>

      <Modal
        className="max-w-md"
        open={onOpen === 5}
        onOpenChange={() => setOnOpen(0)}
      >
        <div className="w-full flex flex-col gap-2">
          <p>Reset {data.user?.username} handle teams</p>
          <DeleteConfirm setIsCorrect={setIsCorrect} isCorrect={isCorrect} />
          <div className="w-full flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOnOpen(0)}>
              Cancel
            </Button>
            <Button onClick={() => setOnOpen(2)}>Confirm</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserValidation;
