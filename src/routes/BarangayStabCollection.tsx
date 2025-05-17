import { useState } from "react";
import axios from "../api/axios";
//query
import { GET_BARANGAY_TEAM_STAB } from "../GraphQL/Queries";
import { RESET_STAB } from "../GraphQL/Mutation";
//hooks
import { useQuery, useMutation } from "@apollo/client";
import { useMutation as tuseMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
//ui
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import Modal from "../components/custom/Modal";
import PrecinctsStatus from "../layout/PrecinctsStatus";
//props
import { BarangayProps } from "../interface/data";
import EditBarangayStab from "../layout/EditBarangayStab";

//icons
import { RxReset } from "react-icons/rx";
import { toast } from "sonner";
const BarangayStabCollection = () => {
  const [onOpen, setOnOpen] = useState(0);
  const { barangayId } = useParams();

  const { data, loading } = useQuery<{ barangay: BarangayProps }>(
    GET_BARANGAY_TEAM_STAB,
    {
      variables: {
        id: barangayId,
        level: 1,
      },
      onError: (err) => {
        console.log(err);
      },
    }
  );

  const [resetStab, { loading: reseting }] = useMutation(RESET_STAB, {
    onCompleted: () => {
      setOnOpen(0);
      toast.success("Reset successfully", {
        closeButton: false,
      });
    },
  });

  const handleReset = async () => {
    if (!barangayId) return;
    await resetStab({
      variables: {
        barangayId: barangayId,
      },
    });
  };

  const handlePrintStabReport = async () => {
    if (!data?.barangay) return;
    const response = await axios.post(
      "upload/print-bararangay-stab-collection",
      {
        id: barangayId,
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
    a.download = `${data.barangay.name}-Stab-Collection-Report.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const { mutateAsync, isPending } = tuseMutation({
    mutationFn: handlePrintStabReport,
    onError: (err) => {
      console.log("Failed", err);
    },
    onSuccess: () => {
      console.log("Success");
    },
  });

  if (loading) {
    return (
      <div className="w-full p-2">
        <p className=" text-center">Loading...</p>
      </div>
    );
  }

  if (!data) return;

  return (
    <div className=" w-full">
      <div className=" w-full p-2">
        <p>{data?.barangay.name}</p>
      </div>
      <div className=" w-full p-4 flex justify-between border border-gray-300">
        <p className=" font-medium text-lg">Machine/s</p>
        <div className=" flex flex-row gap-2">
          <Button
            className=" flex flex-row gap-2"
            variant="outline"
            size="sm"
            disabled={reseting}
          >
            <RxReset /> Reset
          </Button>
          <Button size="sm">Print</Button>
        </div>
      </div>
      <div className=" w-full border p-2 flex flex-col gap-1">
        {data.barangay.machines.length > 0 ? (
          data.barangay.machines.map((machine) => (
            <div
              key={machine.id}
              className="w-full p-2 border border-gray-400 rounded-sm"
            >
              <span className=" font-medium text-sm">No: {machine.number}</span>

              <div>
                <p>Precincts</p>
                <PrecinctsStatus
                  item={machine.precincts}
                  barangayId={barangayId as string}
                />
                {/* <Table>
                  <TableHeader>
                    <TableHead>No.</TableHead>
                    <TableHead>Precint No.</TableHead>
                    <TableHead>Reg Voters</TableHead>
                    <TableHead>In Team</TableHead>
                  </TableHeader>
                  <TableBody>
                    {machine.precincts.map((item, i) => (
                      <TableRow
                        key={i}
                        onClick={() =>
                          nav(`/manage/collection/${barangayId}/${item.id}`)
                        }
                      >
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>{item.precintNumber}</TableCell>
                        <TableCell>{item._count ?? 0}</TableCell>
                        <TableCell>{item._count ?? 0}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table> */}
              </div>
              <div className=" w-full py-4">
                <p>Results: {machine.result ?? 0}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full text-center">
            <p className=" text-lg font-medium">No machine found</p>
            <p>Please assign</p>
          </div>
        )}
      </div>
      <div className=" w-full p-4 flex justify-between border border-gray-300 mt-12">
        <p className=" font-medium text-lg">Team List</p>
        <div className=" flex gap-2">
          <Button
            disabled={isPending}
            className=" flex flex-row gap-2"
            variant="outline"
            size="sm"
            onClick={() => setOnOpen(1)}
          >
            <RxReset /> Reset
          </Button>
          <Button variant="outline" size="sm" onClick={() => setOnOpen(2)}>
            Edit
          </Button>
          <Button size="sm" onClick={() => mutateAsync()}>
            Print
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableHead>No.</TableHead>
          <TableHead>Code</TableHead>
          <TableHead>Team Leader</TableHead>
          <TableHead>Precinct</TableHead>
          <TableHead>Members</TableHead>
          <TableHead>Stab One Collected</TableHead>
          <TableHead>Stab Two Collected</TableHead>
          <TableHead>Actual Present</TableHead>
        </TableHeader>

        <TableBody className="">
          {data?.barangay.teams.map((item, i) => (
            <TableRow>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{item.teamLeader?.voter?.idNumber}</TableCell>
              <TableCell>
                {item.teamLeader?.voter?.lastname},{" "}
                {item.teamLeader?.voter?.firstname}
              </TableCell>
              <TableCell>
                {item.teamLeader?.voter?.precinct?.precintNumber ?? "Unknown"}
              </TableCell>
              <TableCell>{item._count.voters}</TableCell>
              <TableCell>{item.stabStatus.stabOnecollected}</TableCell>
              <TableCell>{item.stabStatus.stabTwocollected}</TableCell>
              <TableCell>{item.membersAttendance?.actual ?? 0}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal
        className="max-w-md"
        open={onOpen === 1}
        onOpenChange={() => setOnOpen(0)}
        footer={true}
        title="Reset Barangay Stab Data"
        onFunction={handleReset}
        loading={reseting}
      />
      <Modal
        className=" max-w-4xl max-h-screen overflow-auto"
        open={onOpen === 2}
        onOpenChange={() => setOnOpen(0)}
        children={
          <EditBarangayStab
            setOnOpen={setOnOpen}
            item={data.barangay.teams}
            barangayId={barangayId as string}
          />
        }
      />
    </div>
  );
};

export default BarangayStabCollection;
