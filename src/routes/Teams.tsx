/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
//ui
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
// import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "../components/ui/table";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "../components/ui/select";
import { Skeleton } from "../components/ui/skeleton";
//props
import { TeamProps } from "../interface/data";
//graphql
import { useQuery } from "@apollo/client";
import { GET_TEAM_LIST } from "../GraphQL/Queries";
//utils
import {
  handleLevel,
  handleVoterColor,
  handleSanitizeChar,
} from "../utils/helper";
//layout
import AreaSelection from "../components/custom/AreaSelection";
import Candidates from "../components/custom/Candidates";
import { toast } from "sonner";

//icons
import { TbReport } from "react-icons/tb";
const options: { name: string; value: string }[] = [
  { name: "All", value: "all" },
  { name: "TL", value: "TL" },
  { name: "PC", value: "PC" },
  { name: "BC", value: "BC" },
];

const Teams = () => {
  const [params, setParams] = useSearchParams({
    zipCode: "all",
    barangay: "all",
    purok: "all",
    level: "all",
    page: "1",
    others: "0",
    query: "",
  });

  const currentMunicipal = params.get("zipCode") || "all";
  const currentBarangay = params.get("barangay") || "all";
  const currentPurok = params.get("purok") || "all";
  const currentLevel = params.get("level") || "all";
  const currentPage = params.get("page") || "1";
  //const currentOthers = params.get("others") || "0";
  const currentQuery = params.get("query");

  const navigate = useNavigate();
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

  const debounceQuery = useDebouncedCallback((value: string) => {
    const sanitized = handleSanitizeChar(value);
    handleChangeOption("query", sanitized);
  }, 1000);

  const { data, loading, refetch } = useQuery<{ teamList: TeamProps[] }>(
    GET_TEAM_LIST,
    {
      variables: {
        zipCode: currentMunicipal,
        barangayId: currentBarangay,
        purokId: currentPurok,
        level: currentLevel,
        page: currentPage,
        skip: 1,
        query: "",
      },
      fetchPolicy: "cache-and-network",
      onError: (error) => {
        toast(`${error.message}`);
        console.error("Error fetching data", error);
      },
    }
  );

  useEffect(() => {
    refetch({
      zipCode: currentMunicipal,
      barangayId: currentBarangay,
      purokId: currentPurok,
      level: currentLevel,
      page: currentPage,
      skip: 1,
      query: currentQuery,
    });
  }, [
    currentLevel,
    currentPage,
    currentMunicipal,
    currentPurok,
    currentBarangay,
    currentBarangay,
    currentQuery,
    refetch,
  ]);

  return (
    <div className="w-full">
      <div className="w-full flex gap-2 items-center px-2 border border-slate-400 border-l-0 border-r-0 sticky top-0 bg-white z-10">
        <h1 className="font-mono font-medium text-sm">Level:</h1>
        {options.map((item) => (
          <Button
            key={item.value}
            size="sm"
            variant={currentLevel === item.value ? "default" : "outline"}
            onClick={() => handleChangeOption("level", item.value)}
          >
            {item.name}
          </Button>
        ))}
        <Candidates />
        <AreaSelection
          currentPurok={currentPurok}
          currentBarangay={currentBarangay}
          currentMunicipal={currentMunicipal}
          handleChangeOption={handleChangeOption}
        />

        <div className="flex items-center absolute right-0 mr-2 gap-2">
          <Input
            onChange={(e) => debounceQuery(e.target.value)}
            placeholder="Search"
            className="border border-slate-600"
          />
          <Button><TbReport fontSize={20}/></Button>
        </div>
      </div>
      {loading ? (
        <div className="w-full flex flex-col gap-1 px-2">
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-10" />
          ))}
        </div>
      ) : data?.teamList.length === 0 ? (
        <div className="w-full h-80 grid">
          <h1 className="m-auto">No data found!</h1>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableHead>Status</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Figure Head </TableHead>
            <TableHead>Handled</TableHead>
            <TableHead>Stamp(Qr Code)</TableHead>
            <TableHead>Purok</TableHead>
            <TableHead>Barangay</TableHead>
            <TableHead>Municipal</TableHead>
          </TableHeader>

          <TableBody>
            {data?.teamList.map((item) => (
              <TableRow
                onClick={() => {
                  if (item.level !== 1) {
                    navigate(`/teams/${item.id}`);
                    return;
                  }
                }}
                className="border border-gray-200 cursor-pointer hover:bg-slate-200"
              >
                <TableCell>
                  <div
                    className={`w-32 h-6 border bg-[${handleVoterColor(
                      item.voters.length
                    )}]`}
                  ></div>
                </TableCell>
                <TableCell>{handleLevel(item.level)}</TableCell>
                <TableCell
                  className={
                    item.teamLeader?.voter?.firstname
                      ? "text-black"
                      : "text-orange-500"
                  }
                >
                  {`${item.teamLeader?.voter?.lastname}, ${item.teamLeader?.voter?.firstname}` ||
                    "Vacant"}
                </TableCell>
                <TableCell>{item.voters.length}({handleLevel(item.level - 1)})</TableCell>
                <TableCell>{item.purok.purokNumber}</TableCell>
                <TableCell>{item.barangay.name}</TableCell>
                <TableCell>{item.municipal.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <div className="w-full flex gap-2 p-2 justify-center">
        <Button size="sm" variant="outline">
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

        <Button size="sm" variant="outline">
          Next
        </Button>
      </div>
    </div>
  );
};

export default Teams;
