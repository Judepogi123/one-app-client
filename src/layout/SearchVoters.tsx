/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { handleLevel } from "../utils/helper";
//interface
import { VotersProps } from "../interface/data";
// ui components
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableCell,
  TableRow,
} from "../components/ui/table";
// graphql
import { SEARCH_VOTER } from "../GraphQL/Queries";
import { useLazyQuery } from "@apollo/client";
import { toast } from "sonner";
import { handleElements } from "../utils/element";

//type
interface SearchVoterProps {
  selectedVoter?: VotersProps | undefined;
  setSelectedVoter?: React.Dispatch<
    React.SetStateAction<VotersProps | undefined>
  >;
  level?: number;
}

const SearchVoters = ({ setSelectedVoter, level }: SearchVoterProps) => {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState(0);
  const [searchVoter, { data, loading }] = useLazyQuery<{
    searchVoter: VotersProps[];
  }>(SEARCH_VOTER, {
    fetchPolicy: "cache-and-network",
  });
  const [value] = useDebounce(query, 1000);
  const LIMIT = 10;

  useEffect(() => {
    const fetchVoters = async () => {
      const response = await searchVoter({
        variables: {
          query: value.trim(),
          skip: page * LIMIT,
          take: LIMIT,
        },
      });

      if (response.error) {
        toast("Something went wrong.");
      }
    };
    if (query.trim() !== "") {
      fetchVoters();
    }
  }, [page, value]);

  const handleSelectVoter = (value: VotersProps | undefined) => {
    if(level === undefined && value !== undefined && setSelectedVoter) {
      setSelectedVoter(value);
      return
    }
    if (value !== undefined && setSelectedVoter) {
      if (value.level !== level) {
        toast("Level unqualified.",{
          description: "The selected voter must with the level of Barangay Coor."
        });
        return;
      }
      try {
        setSelectedVoter(value);
      } catch (error) {
        toast("Something went wrong.");
      }
    } else {
      toast("No voter selected.");
    }
  };

  return (
    <div className="w-full">
      <Input
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a voter..."
      />
      {loading ? (
        <div>
          <h1>Searching...</h1>
        </div>
      ) : data?.searchVoter.length === 0 ? (
        <div className="w-full flex justify-center">
          <div className="text-gray-600 text-lg flex gap-2">
            No voter found with query of{" "}
            <h1 className="font-medium text-gray-800">"{query}"</h1>
          </div>
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              {[
                "No",
                "Tag ID",
                "Lastname",
                "Firstname",
                "Level",
                "Gender",
                "Purok",
                "Barangay",
                "Municipal",
              ].map((item) => (
                <TableHead>{item}</TableHead>
              ))}
            </TableHeader>

            <TableBody>
              {data?.searchVoter.map((item, i) => (
                <TableRow
                  onClick={() => {
                    handleSelectVoter({ ...item });
                  }}
                  key={item.id}
                >
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{handleElements(value, item.idNumber)}</TableCell>
                  <TableCell>{handleElements(value, item.lastname)} </TableCell>
                  <TableCell>{handleElements(value, item.firstname)}</TableCell>
                  <TableCell>{handleLevel(item.level)}</TableCell>
                  <TableCell>{item.gender}</TableCell>
                  <TableCell>{item.barangay.name}</TableCell>
                  <TableCell>{item.municipal.name}</TableCell>
                  <TableCell>{item.purok?.purokNumber}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}

      <div className="w-full flex flex-col"></div>
      {data && data.searchVoter.length > 0 && (
        <div className="w-full p-2 flex justify-center gap-2">
          <Button
            disabled={page <= 0}
            variant="secondary"
            size="sm"
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          >
            Prev
          </Button>

          {page >= 1 && (
            <Button variant="outline" size="sm">
              {page - 1}
            </Button>
          )}

          <Button
            className="border border-gray-400"
            variant="outline"
            size="sm"
          >
            {page}
          </Button>

          <Button variant="outline" size="sm">
            {page + 1}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              if (data && data?.searchVoter.length < 10) {
                return;
              }
              setPage((prev) => prev + 1);
            }}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchVoters;
