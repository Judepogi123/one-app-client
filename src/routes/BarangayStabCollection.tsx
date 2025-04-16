import { useState } from "react";

//query
import { GET_BARANGAY_TEAM_STAB } from "../GraphQL/Queries";

//hooks
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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
//props
import { BarangayProps } from "../interface/data";

const BarangayStabCollection = () => {
  const [onOpen, setOnOpen] = useState(0);
  const { barangayId } = useParams();
  const nav = useNavigate();

  const { data, loading } = useQuery<{ barangay: BarangayProps }>(
    GET_BARANGAY_TEAM_STAB,
    {
      variables: {
        id: barangayId,
        level: 1,
      },
    }
  );

  if (loading) {
    return (
      <div className="w-full">
        <p>Loading...</p>
      </div>
    );
  }

  if (!data) return;

  console.log({ data });

  return (
    <div className=" w-full">
      <div className=" w-full p-2">
        <p>{data?.barangay.name}</p>
      </div>
      <div className=" w-full p-4 flex justify-between border border-gray-300">
        <p className=" font-medium text-lg">Machine/s</p>
        <Button size="sm" onClick={() => setOnOpen(1)} disabled>
          Print
        </Button>
      </div>
      <div className=" w-full border p-2 flex flex-col gap-1">
        {data.barangay.machines.length > 0 ? (
          data.barangay.machines.map((machine) => (
            <div className="w-full p-2 border border-gray-400 rounded-sm">
              <span className=" font-medium text-sm">No: {machine.number}</span>

              <div>
                <p>Precincts</p>
                <Table>
                  <TableHeader>
                    <TableHead>No.</TableHead>
                    <TableHead>Precint No.</TableHead>
                    <TableHead>Reg Voters</TableHead>
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
        <Button size="sm" onClick={() => setOnOpen((prev) => prev++)} disabled>
          Print
        </Button>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal open={onOpen === 1} onOpenChange={() => setOnOpen(0)} />
    </div>
  );
};

export default BarangayStabCollection;
