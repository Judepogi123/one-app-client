//ui
import {
  Table,
  TableBody,
  TableHead,
  //TableFooter,
  TableHeader,
  //TableRow,
  //TableCell,
} from "../components/ui/table";
// import { ScrollArea, ScrollBar } from "../components/ui/scroll-area";
import { Button } from "../components/ui/button";
//
import { GET_COLLECTION_BATCH } from "../GraphQL/Queries";

//hooks
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
//import { useUserData } from "../provider/UserDataProvider";
const CollectionReport = () => {
  const { id } = useParams();
  // const user = useUserData();
  const { data } = useQuery(GET_COLLECTION_BATCH, {
    variables: {
      id: id,
      zipCode: 4905,
    },
    skip: !id ? true : false,
  });

  console.log({ data });

  return (
    <div className=" w-full">
      <div className=" w-full p-2 py-4 flex justify-end">
        <Button size="sm">Print</Button>
      </div>
      <Table>
        <TableHeader className=" border border-gray-400 border-l-0 border-r-0">
          <TableHead>Barangay</TableHead>
          <TableHead>Team</TableHead>
          <TableHead>Members</TableHead>
          <TableHead>Released Stabs</TableHead>
          <TableHead>Collected Stabs</TableHead>
          <TableHead>Commelec Results</TableHead>
          <TableHead>Variance</TableHead>
        </TableHeader>
        <TableBody></TableBody>
      </Table>
    </div>
  );
};

export default CollectionReport;
