// import React from "react";
import { useQuery } from "@apollo/client";
import { GET_BARANGAY_TEAMS } from "../GraphQL/Queries";
import { useNavigate } from "react-router-dom";
//layout
import {
  Table,
  TableBody,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
} from "../components/ui/table";
import Loading from "../components/custom/Loading";
import { BarangayProps } from "../interface/data";
import { useEffect } from "react";
//props
interface Props {
  zipCode: string | undefined;
}
const ValidationBarangay = ({ zipCode }: Props) => {
  const { loading, data, refetch } = useQuery<{
    barangayList: BarangayProps[];
  }>(GET_BARANGAY_TEAMS, {
    variables: { zipCode: parseInt(zipCode as string, 10) },
    skip: !zipCode,
  });
  const navigate = useNavigate();

  useEffect(() => {
    refetch({
      zipCode: parseInt(zipCode as string, 10),
    });
  }, [zipCode]);

  if (loading) {
    return <Loading />;
  }

  if (!data) {
    return <h1>No Barangay Team Found</h1>;
  }

  return (
    <div className="w-full">
      <div className="w-full p-2">
        <Table>
          <TableHeader>
            <TableHead>Barangay</TableHead>
            <TableHead>TL's</TableHead>
            <TableHead>Validated TL</TableHead>
            <TableHead>Members </TableHead>
            <TableHead>Validated Member</TableHead>
            <TableHead>Untracked</TableHead>
          </TableHeader>
          <TableBody>
            {data.barangayList.map((item) => (
              <TableRow
                key={item.id}
                className=" cursor-pointer hover:bg-slate-200"
                onClick={() => navigate(`/manage/validation/${item.id}`)}
              >
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  {item.teamValidationStat.teamLeadersCount}
                </TableCell>
                <TableCell>{item.teamValidationStat.validatedTL}</TableCell>
                <TableCell>{item.teamValidationStat.members}</TableCell>
                <TableCell>
                  {item.teamValidationStat.validatedMembers}
                </TableCell>
                <TableCell>
                  {item.teamValidationStat.untrackedMembers}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ValidationBarangay;
