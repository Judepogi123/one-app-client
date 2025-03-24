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
  TableFooter,
} from "../components/ui/table";
import Loading from "../components/custom/Loading";
import { BarangayProps } from "../interface/data";
import { useEffect, useMemo } from "react";
//import { calculatePercentage } from "../utils/helper";
//props
interface Props {
  zipCode: string | undefined;
}
const ValidationBarangay = ({ zipCode }: Props) => {
  const { loading, data, refetch, error } = useQuery<{
    barangayList: BarangayProps[];
  }>(GET_BARANGAY_TEAMS, {
    variables: { zipCode: parseInt(zipCode as string, 10) },
    skip: !zipCode,
  });
  const navigate = useNavigate();

  console.log({ error });

  useEffect(() => {
    refetch({
      zipCode: parseInt(zipCode as string, 10),
    });
  }, [zipCode]);

  const totalTL = useMemo(() => {
    return (
      data?.barangayList?.reduce(
        (acc, curr) => acc + (curr?.supporters.tl || 0),
        0
      ) || 0
    );
  }, [data]);

  const totalVTL = useMemo(() => {
    return (
      data?.barangayList?.reduce(
        (acc, curr) => acc + (curr?.teamValidationStat.validatedTL || 0),
        0
      ) || 0
    );
  }, [data]);

  const totalUT = useMemo(() => {
    return (
      data?.barangayList?.reduce(
        (acc, curr) => acc + (curr?.teamValidationStat.untrackedMembers || 0),
        0
      ) || 0
    );
  }, [data]);

  const totalVoterAsMembers = useMemo(() => {
    return (
      data?.barangayList?.reduce(
        (acc, curr) => acc + (curr?.supporters?.withTeams || 0),
        0
      ) || 0
    );
  }, [data]);

  const totalVM = useMemo(() => {
    return (
      data?.barangayList?.reduce(
        (acc, curr) => acc + (curr?.teamValidationStat.validatedMembers || 0),
        0
      ) || 0
    );
  }, [data]);

  const totalDeads = useMemo(() => {
    return (
      data?.barangayList?.reduce(
        (acc, curr) => acc + (curr?.teamValidationStat.dead || 0),
        0
      ) || 0
    );
  }, [data]);

  const totalOR = useMemo(() => {
    return (
      data?.barangayList?.reduce(
        (acc, curr) => acc + (curr?.teamValidationStat.orMembers || 0),
        0
      ) || 0
    );
  }, [data]);

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
            <TableHead>Validated Member (#/%)</TableHead>
            <TableHead>Dead (#/%)</TableHead>
            <TableHead>OR (#/%)</TableHead>
            <TableHead>UD (#/%)</TableHead>
            <TableHead>ND (#/%)</TableHead>
            <TableHead>OP (#/%)</TableHead>
            {/* <TableHead>Excluded (#/%)</TableHead> */}
            <TableHead>Untracked (#/%)</TableHead>
          </TableHeader>
          <TableBody>
            {data.barangayList.map((item) => (
              <TableRow
                key={item?.id}
                className=" cursor-pointer hover:bg-slate-200"
                onClick={() => navigate(`/manage/validation/${item?.id}`)}
              >
                <TableCell>{item?.name}</TableCell>
                <TableCell>
                  {item?.teamValidationStat?.teamLeadersCount ?? 0}
                </TableCell>
                <TableCell>
                  {item?.teamValidationStat?.validatedTL ?? 0}
                </TableCell>
                <TableCell>{item?.teamValidationStat?.members ?? 0}</TableCell>
                <TableCell>
                  {item?.teamValidationStat?.validatedMembers ?? 0}
                </TableCell>
                <TableCell>{item.teamValidationStat.dead ?? 0}</TableCell>
                <TableCell>{item.teamValidationStat.orMembers ?? 0}</TableCell>
                <TableCell>
                  {item?.teamComment?.filter((item) => item.type === 1)
                    .length ?? 0}
                </TableCell>
                <TableCell>
                  {item?.teamComment?.filter((item) => item.type === 2)
                    .length ?? 0}
                </TableCell>
                <TableCell>
                  {item?.teamComment?.filter((item) => item.type === 3)
                    .length ?? 0}
                </TableCell>
                {/* <TableCell>
                  {item.teamValidationStat.exclude ?? 0}{" "}
                  {item.teamValidationStat.exclude > 0
                    ? `(${calculatePercentage(
                        item.teamValidationStat.exclude,
                        item?.teamValidationStat?.members
                      )})`
                    : null}
                </TableCell> */}
                <TableCell>
                  {item?.teamValidationStat?.untrackedMembers ?? 0}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="text-left">
                {data.barangayList.length}
              </TableCell>
              <TableCell className="text-left">{totalTL}</TableCell>
              <TableCell className="text-left">{totalVTL}</TableCell>
              <TableCell className="text-left">{totalVoterAsMembers}</TableCell>
              <TableCell className="text-left">{totalVM}</TableCell>
              <TableCell className="text-left">{totalDeads}</TableCell>
              <TableCell className="text-left">{totalOR}</TableCell>
              <TableCell className="text-left">--</TableCell>
              <TableCell className="text-left">--</TableCell>
              <TableCell className="text-left">--</TableCell>
              <TableCell className="text-left">{totalUT}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};

export default ValidationBarangay;
