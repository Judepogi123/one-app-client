import { useEffect, useState, useMemo } from "react";
//lib
import { useQuery, useMutation } from "@apollo/client";
import { useMutation as ruseMutation } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUserData } from "../provider/UserDataProvider";
//query
import {
  //GET_ALL_COLL,
  GET_BARANGAY_STAB,
} from "../GraphQL/Queries";
//ui
import { Button } from "../components/ui/button";
import Modal from "../components/custom/Modal";
import NewCollBatchForm from "../layout/NewCollBatchForm";
import EditBarangayStabColl from "../layout/EditBarangayStabColl";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableHeader,
  TableFooter,
} from "../components/ui/table";
import MunicipalSel from "../components/custom/MunicipalSel";
import { BarangayProps } from "../interface/data";

//
import { RESET_STAB } from "../GraphQL/Mutation";

//icons
import { FaPrint } from "react-icons/fa";
import { toast } from "sonner";
import axios from "../api/axios";

const StabCollection = () => {
  const [onOpen, setOnOpen] = useState(0);
  const [selected, setSelected] = useState<BarangayProps | null>(null);
  const user = useUserData();
  const [params, setParams] = useSearchParams({
    zipCode:
      user.forMunicipal && user.forMunicipal !== 4905
        ? user.forMunicipal?.toString()
        : "4905",
    barangay: "",
  });

  const nav = useNavigate();

  const currentMunicipal = params.get("zipCode") || "4905";
  const handleChangeArea = (value: string, key: string) => {
    setParams(
      (prev) => {
        prev.set(key, value);
        return prev;
      },
      {
        replace: true,
      }
    );
  };

  const { data, refetch, loading } = useQuery<{
    barangayList: BarangayProps[];
  }>(GET_BARANGAY_STAB, {
    variables: {
      zipCode: parseInt(currentMunicipal, 10),
    },
    onError: () => {
      toast.error("Something went wrong", {
        closeButton: false,
      });
    },
  });

  const handleCalVariance = (curr: number, result: number) => {
    if (curr === result) {
      return "=";
    } else if (curr < result) {
      return "+";
    } else if (curr > result) {
      return "-";
    }
  };

  const totolMachine = useMemo(() => {
    if (!data?.barangayList) return 0;

    return data.barangayList.reduce((acc, base) => {
      return acc + (base.machines?.length || 0);
    }, 0);
  }, [data]);

  const totolTeams = useMemo(() => {
    if (!data?.barangayList) return 0;

    return data.barangayList.reduce((acc, base) => {
      return acc + (base.supporters?.tl || 0);
    }, 0);
  }, [data]);

  const totalMembers = useMemo(() => {
    if (!data?.barangayList) return 0;

    return data.barangayList.reduce((acc, base) => {
      return acc + (base.supporters?.withTeams || 0);
    }, 0);
  }, [data]);

  const totalOverall = useMemo(() => {
    if (!data?.barangayList) return 0;

    return data.barangayList.reduce((acc, base) => {
      const tl = base.supporters?.tl || 0;
      const withTeams = base.supporters?.withTeams || 0;
      return acc + (tl + withTeams);
    }, 0);
  }, [data]);

  useEffect(() => {
    refetch({
      zipCode: parseInt(currentMunicipal, 10),
    });
  }, [currentMunicipal]);

  const [resetStab, { loading: reseting }] = useMutation(RESET_STAB, {
    onCompleted: () => {
      setOnOpen(0);
      toast.success("Reset successfully", {
        closeButton: false,
      });
    },
    onError: (err) => {
      console.log(err);
      toast.success("Failed to reset.", {
        closeButton: false,
        description: `${err.message}`,
      });
    },
  });

  const handlePrintMembersStatus = async () => {
    if (!currentMunicipal) return;
    const response = await axios.post(
      "/upload/print-members-status",
      {
        zipCode: currentMunicipal,
      },
      {
        responseType: "blob",
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to generate ID");
    }

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = `team-Members-report.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const { mutateAsync: mutatePrint, isPending: printing } = ruseMutation({
    mutationFn: handlePrintMembersStatus,
    onSuccess: () => {
      toast.success("Generated Successfully", {
        closeButton: false,
        description: "Click the file/downloaded to open",
      });
    },
    onError: (err) => {
      toast.error("Something went wrong!", {
        closeButton: false,
        description: `${err.message}`,
      });
      console.log(err);
    },
  });

  const handlePrintAttendance = async () => {
    if (!selected) return;
    const response = await axios.post(
      "upload/print-team-members",
      {
        id: selected.id,
      },
      {
        responseType: "blob",
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to generate ID");
    }

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selected.name}-ABC-Party-Attendance.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const { mutateAsync, isPending } = ruseMutation({
    mutationFn: handlePrintAttendance,
    onSuccess: () => {
      toast.success("Generated Successfully", {
        closeButton: false,
        description: "Click the file/downloaded to open",
      });
    },
    onError: (err) => {
      toast.error("Something went wrong!", {
        closeButton: false,
        description: `${err.message}`,
      });
      console.log(err);
    },
  });

  const handleResetStab = async () => {
    await resetStab({
      variables: {
        zipCode: parseInt(currentMunicipal, 10),
      },
    });
  };

  if (loading) {
    return (
      <div className="w-full p-2">
        <p className=" text-center">Loading...</p>
      </div>
    );
  }

  if (!data) {
    return;
  }

  return (
    <div className="w-full flex flex-col h-[88vh]">
      {" "}
      {/* Added fixed height */}
      <div className="w-full flex justify-end items-center p-2 border border-l-0 border-r-0 gap-2">
        <MunicipalSel
          disabled={
            user.forMunicipal && user.forMunicipal !== 4905 ? true : false
          }
          className="max-w-96"
          defaultValue={
            user.forMunicipal && user.forMunicipal !== 4905
              ? user.forMunicipal?.toString()
              : "4905"
          }
          value={currentMunicipal}
          handleChangeArea={handleChangeArea}
        />
        <Button variant="outline" size="sm" onClick={() => setOnOpen(4)}>
          Reset
        </Button>
        <Button
          disabled={printing}
          className=" flex items-center gap-2"
          size="sm"
          onClick={() => mutatePrint()}
        >
          <FaPrint fontSize={12} />
          Print
        </Button>
      </div>
      <div className="flex-1 overflow-auto relative">
        {" "}
        {/* Wrapper for scrollable area */}
        <Table className=" relative">
          <TableHeader className="sticky top-0 bg-background z-10">
            {" "}
            {/* Added bg-background and z-10 */}
            <TableHead>No.</TableHead>
            <TableHead>Barangay</TableHead>
            <TableHead>Machine</TableHead>
            <TableHead>Team (TL only)</TableHead>
            <TableHead>Members</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Stab 1</TableHead>
            <TableHead>Stab 2</TableHead>
            <TableHead>Total SOV</TableHead>
            <TableHead>Variance</TableHead>
          </TableHeader>
          <TableBody>
            {data.barangayList.map((item, i) => (
              <TableRow
                className="cursor-pointer hover:bg-slate-200"
                key={i}
                onClick={() => {
                  setSelected(item);
                  setOnOpen(2);
                }}
              >
                <TableCell>{i + 1}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.machines?.length || 0}</TableCell>
                <TableCell>{item.supporters?.tl || 0}</TableCell>
                <TableCell>{item.supporters?.withTeams || 0}</TableCell>
                <TableCell>
                  {(item.supporters?.withTeams || 0) +
                    (item.supporters?.tl || 0)}
                </TableCell>
                <TableCell>{item.collectionResult?.stabOne || 0}</TableCell>
                <TableCell>{item.collectionResult?.stabTwo || 0}</TableCell>
                <TableCell>
                  {item.machines?.reduce(
                    (acc, base) => acc + (base.result || 0),
                    0
                  ) || 0}
                </TableCell>
                <TableCell>
                  {handleCalVariance(
                    (item.supporters?.withTeams || 0) +
                      (item.supporters?.tl || 0),
                    item.machines?.reduce(
                      (acc, base) => acc + (base.result || 0),
                      0
                    ) || 0
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableCell>----</TableCell>
            <TableCell>----</TableCell>
            <TableCell>{totolMachine}</TableCell>
            <TableCell>{totolTeams}</TableCell>
            <TableCell>{totalMembers}</TableCell>
            <TableCell>{totalOverall}</TableCell>
            <TableCell>----</TableCell>
            <TableCell>----</TableCell>
          </TableFooter>
        </Table>
      </div>
      <Modal
        title="Start Collection"
        children={<NewCollBatchForm />}
        open={onOpen === 1}
        onOpenChange={() => setOnOpen(0)}
      />
      <Modal
        title={selected?.name}
        className="max-w-sm"
        children={
          <div className=" w-full flex flex-col gap-2">
            <Button onClick={() => nav(`/manage/collection/${selected?.id}`)}>
              View Barangay
            </Button>
            <Button
              onClick={() => mutateAsync()}
              disabled={isPending}
              variant="outline"
              className=" border border-gray-400 hover:border-gray-500"
            >
              Print Attendance Form
            </Button>
            <Button
              disabled
              variant="outline"
              className=" border border-gray-400 hover:border-gray-500"
              onClick={() => setOnOpen(3)}
            >
              Edit Commelec Result
            </Button>
          </div>
        }
        open={onOpen === 2}
        onOpenChange={() => {
          setSelected(null);
          setOnOpen(0);
        }}
      />
      <Modal
        title={selected?.name}
        children={
          <EditBarangayStabColl
            setOnOpen={setOnOpen}
            zipCode={parseInt(currentMunicipal, 10)}
            stabTwo={selected?.collectionResult.stabTwo as number}
            barangayId={selected?.id as string}
          />
        }
        open={onOpen === 3}
        onOpenChange={() => setOnOpen(0)}
      />
      <Modal
        onFunction={handleResetStab}
        title="Reset Stab collection"
        open={onOpen === 4}
        onOpenChange={() => setOnOpen(0)}
        footer={true}
        loading={reseting}
        children={
          <div>
            <p className=" font-medium text-lg">
              !!!Warning: This action cannot be undo afterwards.
            </p>
          </div>
        }
      />
    </div>
  );
};

export default StabCollection;
