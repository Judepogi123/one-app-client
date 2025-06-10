import { useState, useEffect } from "react";

//hook
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { useDebounce } from "use-debounce";
//layout
import AreaSelection from "../components/custom/AreaSelection";
import { IdRecords } from "../interface/data";
import RecordedID from "../components/item/RecordedID";
import { Button } from "../components/ui/button";
//components
import { Input } from "../components/ui/input";
import { ScrollArea, ScrollBar } from "../components/ui/scroll-area";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
//

//icons
import { FaEllipsisV } from "react-icons/fa";
import { GET_ID_RECORD } from "../GraphQL/Queries";
const GeneratedIDrecord = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [value] = useDebounce(searchQuery, 1000);
  const [searchParams, setSearchParams] = useSearchParams({
    zipCode: "all",
    template: "",
    page: "1",
    level: "1",
  });
  const currentMunicipal = searchParams.get("zipCode") || "";
  const currentBarangay = searchParams.get("barangay") || "";
  const currentPage = searchParams.get("page") || "1";
  const handleChangeArea = (type: string, value: string) => {
    if (type !== "page") {
      handleChangeArea("page", "1");
    }
    setSearchParams(
      (prev) => {
        prev.set(type, value);
        return prev;
      },
      {
        replace: true,
      }
    );
  };

  const { data, loading, refetch } = useQuery<{ generatedRecord: IdRecords[] }>(
    GET_ID_RECORD,

    {
      onError: (err) => {
        console.log(err);
        toast.error(err.message, {
          closeButton: false,
        });
      },
      variables: {
        zipCode: currentMunicipal,
        query: value,
        skip: parseInt(currentPage, 10) - 1,
      },
    }
  );

  useEffect(() => {
    refetch({
      zipCode: currentMunicipal,
      query: value,
      skip: parseInt(currentPage, 10) - 1,
    });
  }, [value, currentMunicipal]);
  console.log({ data });

  const handleNavPage = (dir: string) => {
    let toPage = 0;
    const thisPage = parseInt(currentPage, 10);
    if (dir === "prev") {
      toPage = thisPage - 1;
    } else {
      toPage = thisPage + 1;
    }
    handleChangeArea("page", toPage.toString());
  };

  return (
    <div className=" w-full h-full">
      <div className=" w-full h-[10%] flex justify-end items-center p-2 border border-x-0 border-t-0">
        <AreaSelection
          handleChangeOption={handleChangeArea}
          currentMunicipal={currentMunicipal}
          currentBarangay={currentBarangay}
          currentPurok={""}
          defaultValue={""}
        />

        <Input
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search"
        />
        <Button disabled={false} size="sm" variant="outline">
          <FaEllipsisV size={16} />
        </Button>
      </div>

      <ScrollArea className=" w-full h-[90%] overflow-auto relative">
        <Table>
          <TableHeader className=" sticky top-0 z-50 bg-white">
            <TableHead>No</TableHead>
            <TableHead>Fullname</TableHead>
            <TableHead>Template</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Date Generated</TableHead>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className=" col-span-4">
                <TableCell colSpan={5} className=" text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : data ? (
              data.generatedRecord.length > 0 ? (
                data.generatedRecord.map((item, i) => (
                  <RecordedID
                    number={(parseInt(currentPage, 10) - 1) * 20 + i + 1}
                    item={item}
                  />
                ))
              ) : (
                <TableRow className=" col-span-4">
                  <TableCell colSpan={5} className=" text-center">
                    NO data found!
                  </TableCell>
                </TableRow>
              )
            ) : (
              <div>
                <span>NO data found!</span>
              </div>
            )}
          </TableBody>
        </Table>
        <div className=" w-full flex justify-center gap-2 p-2">
          <Button
            disabled={currentPage === "1"}
            size="sm"
            onClick={() => handleNavPage("prev")}
          >
            Prev
          </Button>
          <Button
            disabled={data && data?.generatedRecord?.length <= 9}
            size="sm"
            onClick={() => handleNavPage("next")}
          >
            Next
          </Button>
        </div>

        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
};

export default GeneratedIDrecord;
