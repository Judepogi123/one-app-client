/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { toast } from "sonner";

//ui
import {
  Table,
  TableBody,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import Modal from "../components/custom/Modal";
//props
import { VotersProps, RejectListProps } from "../interface/data";

//graphql
import { GET_SELECT_VOTER } from "../GraphQL/Queries";
import { useQuery, useMutation } from "@apollo/client";

//tools
import { handleLevel, handleStatus } from "../utils/helper";

//icons
import { VscClearAll } from "react-icons/vsc";
import { IoPrintOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { MdOutlineCancel } from "react-icons/md";

//components
import SearchVoters from "./SearchVoters";
import { ADD_TEAM } from "../GraphQL/Mutation";
const UpdateSelectedList = () => {
  const [selectedList, setSelectedList] = useState<
    { fullname: string; id: string }[]
  >([]);
  const [onClear, setOnClear] = useState(false);
  const [onPrint, setOnPrint] = useState(false);
  const [onSetAS, setOnSetAs] = useState(false);
  const [levelSet, setLevelSet] = useState(0);
  const [selectedVoter, setSelectedVoter] = useState<VotersProps | undefined>(
    undefined
  );
  const { data, error } = useQuery<{
    getSelectedVoters: VotersProps[];
  }>(GET_SELECT_VOTER, {
    variables: {
      list: selectedList.map((item) => item.id),
    },
    skip: !selectedList,
  });

  const [addTeam, { data: newTeam }] =
    useMutation<{ addTeam: string }>(ADD_TEAM);

  const main = async () => {
    try {
      const localList: { fullname: string; id: string }[] = JSON.parse(
        localStorage.getItem("selectedList") || "[]"
      );
      console.log(localList);

      setSelectedList(localList);
    } catch (error) {
      toast("Sorry, there was an error", {
        description: "Can't parse the selected list",
      });
    }
  };

  useEffect(() => {
    main();
  }, []);

  const handleAddTeam = async () => {
    if (!selectedVoter) {
      toast("Please select a voter first");
      return;
    }

    if (!data) {
      toast("Please select a voter first");
      return;
    }

    const teamIdList = data.getSelectedVoters.map((item) => {
      return {
        id: item.id,
        firstname: item.firstname,
        lastname: item.lastname,
        status: item.status ?? 0,
        level: item.level,
        barangaysId: item.barangaysId || "",
        municipalsId: item.municipalsId || 0,
        purokId: item.purok?.id as string,
      };
    });

    const response = await addTeam({
      variables: {
        headId: selectedVoter.id,
        teamIdList,
        level: levelSet,
      },
    });

    if (response.errors) {
      console.error("Error adding team", response.errors);

      toast("Operation failed", {
        description: `${response.errors}`,
        className: "text-red-500 font-semibold",
      });
      return;
    }

    if (response.data) {
      handleClear();
      toast("Operation success!");
      setOnSetAs(false);
    }
  };

  const handleRemoveVoter = async (id: string) => {
    try {
      const localList: { fullname: string; id: string }[] = JSON.parse(
        localStorage.getItem("selectedList") || "[]"
      );

      const updatedList = localList.filter((item) => item.id !== id);

      localStorage.setItem("selectedList", JSON.stringify(updatedList));

      setSelectedList(updatedList);
    } catch (error) {
      toast("Error parsing", {
        description: "An error occurred",
        className: "text-red-500 font-semibold",
      });
    }
  };

  const handleClear = async () => {
    try {
      localStorage.setItem("selectedList", JSON.stringify([]));
      setSelectedList([]);
      setOnClear(false);
      toast("List cleared");
    } catch (error) {
      toast("Error clearing", {
        description: "An error occurred",
        className: "text-red-500 font-semibold",
      });
    }
  };

  const handleSet = (set: number) => {
    setLevelSet(set);
    setOnSetAs(true);
  };

  const handleCheckList = (): VotersProps[] | [] => {
    if (!data?.getSelectedVoters) {
      return [];
    }
    const rejectList: VotersProps[] = [];
    const { getSelectedVoters } = data;
    for (const item of getSelectedVoters) {
      if (
        item.status === 0 ||
        item.level !== 0 ||
        item.oor === "YES" ||
        item.inc === "YES"
      ) {
        rejectList.push(item);
      }
    }
    return rejectList;
  };

  if (error) {
    return (
      <div className="w-full h-auto grid">
        <h1 className="text-red-500 font-semibold m-auto">
          Sorry an error occured, please try to contact the administrator to
          resolve the issue.
        </h1>
      </div>
    );
  }

  return (
    <div className="w-full max-h-max">
      <div className="w-full flex items-center justify-between p-2">
        <div className="flex items-center gap-2 w-auto">
          <h1 className="text-gray-800 font-semibold text-sm">Set as</h1>
          <Button onClick={() => handleSet(2)} variant="outline" size="sm">
            Purok Coor
          </Button>
          <Button
            onClick={() => {
              handleSet(1);
              setSelectedVoter(undefined);
            }}
            variant="outline"
            size="sm"
          >
            Team Leader
          </Button>
          <Button
            onClick={() => {
              handleSet(0);
              setSelectedVoter(undefined);
            }}
            variant="outline"
            size="sm"
          >
            Voter
          </Button>

          <div className="flex items-center w-auto gap-2 ml-6">
            <h1 className="font-medium text-sm">Other: </h1>
            <Button
              onClick={() => {
                setOnPrint(true);
              }}
              variant="secondary"
              className="w-auto flex gap-2"
              size="sm"
            >
              <IoPrintOutline /> Print
            </Button>
          </div>
        </div>
        <Button
          disabled={!selectedList.length}
          onClick={() => {
            if (!selectedList.length) {
              return;
            }
            setOnClear(true);
          }}
          size="sm"
          className="w-auto flex gap-2"
        >
          <VscClearAll />
          Clear list
        </Button>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableHead>Lastname</TableHead>
            <TableHead>Firstname</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Municipal</TableHead>
            <TableHead>Barangay</TableHead>
            <TableHead>Purok</TableHead>
            <TableHead>PWD</TableHead>
            <TableHead>ILLI</TableHead>
            <TableHead>OR</TableHead>
            <TableHead>INC</TableHead>
            <TableHead>60+</TableHead>
            <TableHead>Status</TableHead>
          </TableHeader>

          <TableBody>
            {data &&
              data.getSelectedVoters.map((item) => (
                <TableRow>
                  <TableCell>{item.lastname}</TableCell>
                  <TableCell>{item.firstname}</TableCell>
                  <TableCell>{handleLevel(item.level)}</TableCell>
                  <TableCell>{item.gender}</TableCell>
                  <TableCell>{item.municipal.name}</TableCell>
                  <TableCell>{item.barangay.name}</TableCell>
                  <TableCell>{item.purok?.purokNumber}</TableCell>
                  <TableCell
                    className={`text-black ${
                      item.pwd === "YES" ? "text-red-500 font-semibold" : ""
                    }`}
                  >
                    {item.pwd}
                  </TableCell>
                  <TableCell
                    className={`text-black ${
                      item.illi === "YES" ? "text-red-500 font-semibold" : ""
                    }`}
                  >
                    {item.illi}
                  </TableCell>
                  <TableCell
                    className={`text-black ${
                      item.oor === "YES" ? "text-red-500 font-semibold" : ""
                    }`}
                  >
                    {item.oor}
                  </TableCell>
                  <TableCell
                    className={`text-black ${
                      item.inc === "YES" ? "text-red-500 font-semibold" : ""
                    }`}
                  >
                    {item.inc}
                  </TableCell>
                  <TableCell>{item.senior ? "YES" : "NO"}</TableCell>
                  <TableCell
                    className={`text-black ${
                      item.status == 0 ? "text-red-500 font-semibold" : ""
                    }`}
                  >
                    {handleStatus(item.status)}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleRemoveVoter(item.id)}
                      size="sm"
                      variant="outline"
                    >
                      <MdDeleteOutline />
                    </Button>{" "}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <Modal
        className="max-w-sm"
        title={`Clear the list, items: (${selectedList.length})`}
        open={onClear}
        onOpenChange={() => {
          setOnClear(false);
        }}
        onFunction={handleClear}
        footer={true}
      />

      <Modal
        className="max-w-sm"
        title="Print data"
        open={onPrint}
        onOpenChange={() => {
          setOnPrint(false);
        }}
        footer={true}
      />

      <Modal
        title={`Set list for ${handleLevel(levelSet)}`}
        onOpenChange={() => {
          setLevelSet(0);
          setOnSetAs(false);
        }}
        className="w-full max-w-5xl"
        footer={true}
        onFunction={handleAddTeam}
        open={onSetAS}
        children={
          <div>
            {selectedVoter ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <h1>Select </h1>
                  <h1 className="font-semibold text-lg">
                    {selectedVoter.lastname}, {selectedVoter.firstname} (
                    {selectedVoter.barangay.name})
                  </h1>
                  <h1>as {handleLevel(levelSet + 1)}</h1>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedVoter(undefined)}
                  >
                    <MdOutlineCancel fontSize={25} />
                  </Button>
                </div>

                <div>
                  {handleCheckList()?.length && (
                    <div className="w-full h-auto">
                      <h1 className="font-semibold text-red-500">
                        ({handleCheckList()?.length}){" "}
                        {handleCheckList()?.length > 1 ? "Voters" : "Voter"}{" "}
                        that not meet the criteria for {handleLevel(levelSet)}.
                      </h1>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <h1 className=" py-2 font-semibold text-gray-700 text-sm">
                  Search for {handleLevel(levelSet + 1)} and select.
                </h1>

                <SearchVoters
                  setSelectedVoter={setSelectedVoter}
                  level={levelSet + 1}
                />
                <div className="w-full h-auto flex flex-col">
                  {newTeam &&
                    Array.isArray(newTeam.addTeam) &&
                    newTeam.addTeam.map((item: RejectListProps) => (
                      <h1 key={item.id}>
                        {item.firstname} {item.lastname} - Status: {item.status}{" "}
                      </h1>
                    ))}
                </div>
              </div>
            )}
          </div>
        }
      />
    </div>
  );
};

export default UpdateSelectedList;
