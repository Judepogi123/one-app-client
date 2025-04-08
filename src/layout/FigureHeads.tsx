//
import { FIGURE_HEADS } from "../GraphQL/Queries";
import { useEffect } from "react";
//
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Skeleton } from "../components/ui/skeleton";
//hooks
import { useQuery } from "@apollo/client";
import { TeamLeaderProps, TeamProps } from "../interface/data";

//props
interface Props {
  level: number;
  index: number;
  barangaysId: string;
  handleSelectHead: (data: TeamLeaderProps, index: number) => void;
}

const FigureHeads = ({
  level,
  barangaysId,
  handleSelectHead,
  index,
}: Props) => {
  const { loading, data, refetch } = useQuery<{
    figureHeads: TeamProps[];
  }>(FIGURE_HEADS, {
    variables: {
      level: level,
      barangayId: barangaysId,
    },
  });

  console.log({ data });

  useEffect(() => {
    refetch({
      level: level,
      barangayId: barangaysId,
    });
  }, [level]);

  if (loading) {
    return (
      <div className="w-full h-auto flex flex-col gap-2">
        {[...Array(4)].map((_, index) => (
          <Skeleton key={index} className="w-full h-10" />
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full">
        <p className="text-center text-red-500">No data found</p>
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableHead>Tag ID</TableHead>
          <TableHead>{level === 2 ? "PC Fullname" : "BC Fullname"}</TableHead>
          <TableHead>
            {level === 3 && level - 1 === 3 ? "PC Fullname" : "BC Fullname"}
          </TableHead>
        </TableHeader>
        <TableBody>
          {data.figureHeads.map((item) => (
            <TableRow
              key={item.id}
              className="hover:bg-gray-100 cursor-pointer"
              onClick={() =>
                handleSelectHead(item.teamLeader as TeamLeaderProps, index)
              }
            >
              <TableCell>{item.teamLeader?.voter?.idNumber}</TableCell>
              <TableCell>
                {item.teamLeader?.voter?.lastname},{" "}
                {item.teamLeader?.voter?.firstname}
              </TableCell>

              {level === 3 ? (
                <TableCell>
                  {item.teamLeader?.purokCoors?.voter?.lastname},{" "}
                  {item.teamLeader?.purokCoors?.voter?.firstname}
                </TableCell>
              ) : (
                <TableCell>
                  {item.teamLeader?.barangayCoor?.voter?.lastname},{" "}
                  {item.teamLeader?.barangayCoor?.voter?.firstname}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FigureHeads;
