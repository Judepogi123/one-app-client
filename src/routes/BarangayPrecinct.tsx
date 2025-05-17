//
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
//
import {
  Table,
  TableBody,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
} from "../components/ui/table";
import { BarangayProps } from "../interface/data";
import { GET_BARANGAY_PRECINCT } from "../GraphQL/Queries";
import { calculatePercentage, handleLevel } from "../utils/helper";
const BarangayPrecinct = () => {
  const { barangayId, precinctID } = useParams();

  const { data, loading } = useQuery<{ barangay: BarangayProps }>(
    GET_BARANGAY_PRECINCT,
    {
      onError: () => {},
      variables: {
        id: barangayId,
        precinctId: precinctID,
      },
    }
  );

  if (loading) {
    return (
      <div className="w-full p-2">
        <p className=" text-center">Loading...</p>
      </div>
    );
  }
  if (!data) return;

  return (
    <div className="w-full">
      <div className="w-full p-2 flex gap-2">
        <p className=" font-medium">{data.barangay.name}</p> -
        <p>{data.barangay.precinct.precintNumber}</p>
      </div>
      <div className="w-full p-2 flex gap-2">
        <p>
          ({data.barangay.precinct.voters.length}/
          {data.barangay.precinct._count})
        </p>
        <p>
          {calculatePercentage(
            data.barangay.precinct.voters.length ?? 0,
            data.barangay.precinct._count ?? 0
          )}
          %
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableHead>No.</TableHead>
          <TableHead>Fullname</TableHead>
          <TableHead>Code</TableHead>
          <TableHead>Level</TableHead>
          <TableHead>Stab One</TableHead>
          <TableHead>Stab Two</TableHead>
        </TableHeader>
        <TableBody>
          {data.barangay.precinct.voters.map((item, i) => (
            <TableRow>
              <TableCell>{i + 1}</TableCell>
              <TableCell>
                {item.lastname}, {item.firstname}
              </TableCell>
              <TableCell>{item.idNumber}</TableCell>
              <TableCell>{handleLevel(item.level)}</TableCell>
              <TableCell>
                {item.level === 0
                  ? item.qrCodes.filter((item) => item.number === 1)[0]
                      ?.scannedDateTime ?? "N/A"
                  : "--/--"}
              </TableCell>
              <TableCell>
                {item.level === 0
                  ? item.qrCodes.filter((item) => item.number === 2)[0]
                      ?.scannedDateTime ?? "N/A"
                  : "--/--"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BarangayPrecinct;
