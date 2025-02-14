//
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useUserData } from "../provider/UserDataProvider";
//ui
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "../components/ui/table";
import AreaSelection from "../components/custom/AreaSelection";
//icon
import { FaPrint } from "react-icons/fa";

//graphql
import { GET_ALL_VALIDATED_TEAM } from "../GraphQL/Queries";
import { useQuery } from "@apollo/client";

//props
import { ValidatedTeams } from "../interface/data";

//utisl
import { formatTimestamp } from "../utils/date";
import { handleLevel } from "../utils/helper";

//
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
const TeamValidatedRecords = () => {
  const doc = new jsPDF();
  const user = useUserData();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams({
    zipCode: user?.forMunicipal ? user?.forMunicipal.toString() : "all",
    barangay: "all",
    page: "1",
  });
  const currentMunicipal = params.get("zipCode") || "all";
  const currentBarangay = params.get("barangay") || "all";
  const currentPage = params.get("page") || "1";

  const handleChangeOption = (params: string, value: string) => {
    setParams(
      (prev) => {
        prev.set(params, value);
        return prev;
      },
      {
        replace: true,
      }
    );
  };

  const { data, refetch } = useQuery<{
    teamRecord: ValidatedTeams[];
  }>(GET_ALL_VALIDATED_TEAM, {
    variables: {
      query: "",
      barangay: currentBarangay,
      municipal: currentMunicipal,
      skip: (parseInt(currentPage, 10) - 1) * 50,
    },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    refetch({
      query: "",
      barangay: currentBarangay,
      municipal: currentMunicipal,
      skip: (parseInt(currentPage, 10) - 1) * 50,
    });
  }, [currentPage]);

  const handleChangePage = (method: number) => {
    const nextPage = parseInt(currentPage, 10) + 1;
    const prevPage = parseInt(currentPage, 10) - 1;
    const page = method ? nextPage : prevPage;
    setParams(
      (prev) => {
        prev.set("page", page.toString());
        return prev;
      },
      { replace: true }
    );
  };

  console.log(data);

  const handleSave = () => {
    autoTable(doc, {
      head: [
        ["Figure Head", "Level", "Date", "Purok", "Barangay", "Municipal"],
      ],
    });
    autoTable(doc, { html: "#table" });

    doc.save("table.pdf");
  };

  if (!data) return;

  return (
    <div className="w-full h-auto">
      <div className="w-full flex justify-end items-center border border-l-0 border-r-0 border-slate-400">
        <AreaSelection
          defaultValue={currentMunicipal}
          disabled={user?.forMunicipal ? true : false}
          handleChangeOption={handleChangeOption}
          className="mr-3"
          currentMunicipal={currentMunicipal}
          currentBarangay={currentBarangay}
          currentPurok={""}
        />
        <Button
          onClick={handleSave}
          size="sm"
          className="w-auto flex gap-2 mr-2"
        >
          <FaPrint />
          Print
        </Button>
      </div>
      <Table id="table">
        <TableHeader>
          <TableHead>Figure Head</TableHead>
          <TableHead>Level</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Purok</TableHead>
          <TableHead>Baranagay</TableHead>
          <TableHead>Municipal</TableHead>
          <TableHead>Issues</TableHead>
        </TableHeader>
        <TableBody>
          {data &&
            data.teamRecord.map((item) => (
              <TableRow
                onClick={() => {
                  navigate(`/manage/update/voter/records/${item.id}`);
                }}
                className="hover:bg-slate-200 cursor-pointer"
                key={item.id}
              >
                <TableCell>
                  {item.teamLeader?.voter?.lastname},
                  {item.teamLeader?.voter?.firstname}
                </TableCell>
                <TableCell>
                  {handleLevel(item.teamLeader?.level as number)}
                </TableCell>
                <TableCell>{formatTimestamp(item.timestamp)}</TableCell>
                <TableCell>{item.purok.purokNumber}</TableCell>
                <TableCell>{item.barangay.name}</TableCell>
                <TableCell>{item.municipal.name}</TableCell>
                <TableCell>{item.issues}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <div className="w-full flex gap-2 justify-center p-2">
        <Button
          disabled={currentPage === "1"}
          size="sm"
          variant="outline"
          onClick={() => handleChangePage(0)}
        >
          Prev
        </Button>
        <Button size="sm" variant="outline">
          1
        </Button>
        <Button size="sm" variant="outline">
          2
        </Button>
        <Button size="sm" variant="outline">
          3
        </Button>
        <Button
          disabled={data.teamRecord.length < 50}
          size="sm"
          variant="outline"
          onClick={() => handleChangePage(1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default TeamValidatedRecords;
