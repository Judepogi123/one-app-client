import { useParams } from "react-router-dom";
//grpahql
import { GET_TEAM_RECORD_INFO } from "../GraphQL/Queries";
import { useQuery } from "@apollo/client";

//props
import { ValidatedTeams } from "../interface/data";

//layout
import InfoKey from "../components/item/InfoKey";

//utils
import { formatTimestamp } from "../utils/date";

//ui
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableCell,
} from "../components/ui/table";
const ValidatedTeamReport = () => {
  const { recordID } = useParams();
  const { data } = useQuery<{
    getTeamRecord: ValidatedTeams | null;
  }>(GET_TEAM_RECORD_INFO, {
    variables: {
      id: recordID,
    },
    skip: !recordID,
  });

  if (!data) return;
  console.log({ data });

  const issues = data.getTeamRecord?.validatedTeamMembers.reduce(
    (acc, team) => {
      if (team.remark !== "OK") {
        return (acc += 1);
      }
      return acc;
    },
    0
  );

  return (
    <div className="w-full h-auto p-2">
      <div className="w-full p-2 border border-gray-500 rounded grid grid-rows-2">
        <InfoKey
          className=""
          title={data.getTeamRecord?.barangay.name}
          label={"Barangay"}
        />
        <InfoKey
          className=""
          title={formatTimestamp(data.getTeamRecord?.timestamp as string)}
          label={"Date"}
        />
        <InfoKey
          className=""
          title={`${data.getTeamRecord?.teamLeader?.voter?.lastname}, ${data.getTeamRecord?.teamLeader?.voter?.firstname}`}
          label={"Leader"}
        />
        <InfoKey
          className={issues && issues > 0 ? "text-red-500" : ""}
          title={`${issues}`}
          label={"Issues"}
        />
      </div>

      <Table className="p-2">
        <TableHeader>
          <TableRow>
            <TableCell>Tag ID</TableCell>
            <TableCell>Fullname</TableCell>
            <TableCell>Purok</TableCell>
            <TableCell>Barangay</TableCell>
            <TableCell>Municipal</TableCell>
            <TableCell>Remark</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.getTeamRecord?.validatedTeamMembers.map((item) => (
            <TableRow>
              <TableCell>{item.idNumber}</TableCell>
              <TableCell>
                {item.voter?.lastname}, {item.voter?.firstname || "Unknown"}
              </TableCell>
              <TableCell>
                {item.voter?.purok?.purokNumber || "Unknown"}
              </TableCell>
              <TableCell>{item.voter?.barangay.name || "Unknown"}</TableCell>
              <TableCell>{item.voter?.municipal.name || "Unknown"}</TableCell>
              <TableCell>{item.remark || "Unknown"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ValidatedTeamReport;
