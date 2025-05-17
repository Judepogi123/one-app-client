import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Precent } from "../interface/data";
import { useNavigate } from "react-router-dom";
//props
interface Props {
  item: Precent[] | [] | undefined;
  barangayId: string;
}

const PrecinctsStatus = ({ item, barangayId }: Props) => {
  console.log("Precinct: ", item);

  const nav = useNavigate();

  const totalRegister = useMemo(() => {
    return (
      (item || []).reduce((acc, base) => {
        return acc + base._count;
      }, 0) || 0
    );
  }, [item]);

  const totalInTeam = useMemo(() => {
    return (
      (item || []).reduce((acc, base) => {
        return acc + base.inTeam;
      }, 0) || 0
    );
  }, [item]);

  const totalStabOne = useMemo(() => {
    return (
      (item || []).reduce((acc, base) => {
        return acc + base.stabOne;
      }, 0) || 0
    );
  }, [item]);

  const totalStabTwo = useMemo(() => {
    return (
      (item || []).reduce((acc, base) => {
        return acc + base.stabTwo;
      }, 0) || 0
    );
  }, [item]);

  if (!item) {
    return (
      <div className="w-full">
        <p className=" font-medium text-lg text-center">NO precinct found!</p>
      </div>
    );
  }
  return (
    <Table>
      <TableHeader>
        <TableHead>No.</TableHead>
        <TableHead>Precint No.</TableHead>
        <TableHead>Reg Voters</TableHead>
        <TableHead>In Team</TableHead>
        <TableHead>Stab 1</TableHead>
        <TableHead>Stab 2</TableHead>
      </TableHeader>
      <TableBody>
        {item.map((item, i) => (
          <TableRow
            className=" cursor-pointer hover:bg-slate-100"
            key={i}
            onClick={() => nav(`/manage/collection/${barangayId}/${item.id}`)}
          >
            <TableCell>{i + 1}</TableCell>
            <TableCell>{item.precintNumber}</TableCell>
            <TableCell>{item._count ?? 0}</TableCell>
            <TableCell>{item.inTeam ?? 0}</TableCell>
            <TableCell>{item.stabOne ?? 0}</TableCell>
            <TableCell>{item.stabTwo ?? 0}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableCell>Total: </TableCell>
        <TableCell>{item.length ?? 0}</TableCell>
        <TableCell>{totalRegister}</TableCell>
        <TableCell>{totalInTeam}</TableCell>
        <TableCell>{totalStabOne}</TableCell>
        <TableCell>{totalStabTwo}</TableCell>
      </TableFooter>
    </Table>
  );
};

export default PrecinctsStatus;
