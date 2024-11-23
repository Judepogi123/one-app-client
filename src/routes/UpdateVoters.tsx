/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
//import z from "zod";
// UI components
import { Button } from "../components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../components/ui/select";
// import { Input } from "../components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "../components/ui/table";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../components/ui/popover";
import Modal from "../components/custom/Modal";
import { Checkbox } from "../components/ui/checkbox";
// GraphQL
import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_VOTERS } from "../GraphQL/Queries";
// Interface
import { VotersProps, MunicipalProps } from "../interface/data";
//layout
import SearchVoters from "../layout/SearchVoters";
import RefineVoterList from "../layout/RefineVoterList";
import DeleteConfirm from "../layout/DeleteConfirm";
//icons
import { MdDeselect } from "react-icons/md";
import { FaEllipsisV } from "react-icons/fa";
import { IoQrCodeSharp } from "react-icons/io5";
import { MdOutlineDeleteSweep } from "react-icons/md";
//graphql
import {
  REMOVE_MULTI_VOTER,
  REMOVE_AREA_VOTERS,
  GENERATE_BUNLE_QRCODE,
} from "../GraphQL/Mutation";
import { GrDocumentUpdate } from "react-icons/gr";
import { toast } from "sonner";
import { handleLevel } from "../utils/helper";

const UpdateVoters = () => {
  const [onSearch, setOnSearch] = useState(false);
  const [onRefine, setOnRefine] = useState(false);
  const [onSelect, setOnSelect] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [onMultiRemove, setMultiRemove] = useState(false);
  const [onDeleteArea, setOnDeleteArea] = useState(false);
  const [onGenerate, setGenerate] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const [selectedList, setSeelectedList] = useState<string[]>([]);
  const [offset, setOffset] = useSearchParams({ page: "0" });
  const [municipal, setMunicipal] = useSearchParams({ area: "all" });
  const [barangay, setBarangay] = useSearchParams({
    barangay: "all",
    purok: "all",
    candidate: "all",
  });

  const navigate = useNavigate();

  const currentOffset = offset.get("page") || "0";
  const currentMunicipal = municipal.get("area") || "all";
  const currentBarangay = barangay.get("barangay") || "all";
  const currentPurok = barangay.get("purok") || "all";
  //const currentCandidate = barangay.get("candidate") || "all";

  const LIMIT = 20;

  const { data, loading, refetch } = useQuery<{
    getAllVoters: VotersProps[];
    municipals: MunicipalProps[];
  }>(GET_ALL_VOTERS, {
    variables: {
      offset: parseInt(currentOffset as string, 10) * LIMIT,
      limit: 20,
      zipCode: currentMunicipal,
      barangayId: currentBarangay,
    },
  });

  const handlePrev = () => {
    if (parseInt(currentOffset as string, 10) < 0) {
      return;
    }
    setOffset((prev) => {
      const count = parseInt(currentOffset, 10) - 1;
      prev.set("page", count.toString());
      return prev;
    });
  };

  const handleNext = () => {
    if (!currentOffset) {
      return;
    }
    setOffset((prev) => {
      const count = parseInt(currentOffset, 10) + 1;
      prev.set("page", count.toString());
      return prev;
    });
  };

  const handleNav = (value: string) => {
    navigate(`/voter/${value}`);
  };

  const handleCheckVoter = (id: string, checked: boolean) => {
    let listCopy = [...selectedList];
    const matchedIndex = listCopy.findIndex((item) => item === id);

    if (checked && matchedIndex === -1) {
      listCopy.push(id);
    } else if (!checked && matchedIndex !== -1) {
      listCopy = listCopy.filter((item) => item !== id);
    }

    setSeelectedList(listCopy);
  };

  const handleCheckValue = (id: string): boolean => {
    const matchedIndex = selectedList.findIndex((item) => item === id);

    if (matchedIndex === -1) {
      return false;
    }
    return true;
  };

  const handleCheckAll = () => {
    if (!data) {
      return;
    }
    const filtered: string[] = data.getAllVoters.map((item) => item.id);
    setSeelectedList(filtered);
  };

  useEffect(() => {
    if (selectAll) {
      handleCheckAll();
      return;
    }
    setSeelectedList([]);
  }, [selectAll]);

  const [removeMultiVoter, { loading: removing }] =
    useMutation(REMOVE_MULTI_VOTER);

  const [removeVotersArea, { loading: areaRemoving }] =
    useMutation(REMOVE_AREA_VOTERS);

  const [genderBundleQrCode, { loading: generating }] =
    useMutation(GENERATE_BUNLE_QRCODE);

  const handleBundleQrcodeGenerating = async () => {
    if (selectedList.length === 0) {
      toast("No voters selected.", {
        description: "Please select at least one voter.",
      });
      return;
    }

    const response = await genderBundleQrCode({
      variables: {
        idList: selectedList,
      },
    });
    if (response.errors) {
      toast("Bundle QR code generation failed.");
      return;
    }
    if (response.data) {
      toast("Bundle QR code generated successfully.");
    }
  };

  const handleDeleteAreaVoters = async () => {
    if (!isCorrect) {
      return;
    }
    const response = await removeVotersArea({
      variables: {
        zipCode: currentMunicipal,
        barangayId: currentBarangay,
        purokId: currentPurok,
      },
    });
    if (response.errors) {
      console.log(response.errors);

      toast("Delete area failed.");
      return;
    }
    if (response.data) {
      refetch();
      toast("Delete area success.");
      setOnDeleteArea(false);
    }
  };

  const handleRemoveMultiVoter = async () => {
    if (!selectedList) {
      return;
    }
    const response = await removeMultiVoter({
      variables: {
        list: selectedList,
      },
    });
    if (response.errors) {
      toast("Multi-remove failed.");
      return;
    }
    if (response.data) {
      refetch();
      toast("Multi-remove success.");
      setMultiRemove(false);
      setSelectAll(false);
      setSeelectedList([]);
    }
  };

  return (
    <div className="w-full h-auto">
      <div className="w-full p-2 flex gap-2">
        <div
          onClick={() => setOnSearch(true)}
          className="w-full h-10 border border-gray-400 hover:border-gray-500 cursor-text rounded flex items-center"
        >
          <h1 className="ml-2 font-medium text-gray-600">Search</h1>
        </div>
        <Button onClick={() => setOnRefine(true)}>Refine</Button>
        {/* <div className="flex items-center gap-2">
          <h1 className="font-medium text-sm">Municipal:</h1>
          <Select defaultValue="all">
            <SelectTrigger className="w-auto">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-auto flex items-center gap-2">
          <h1 className="font-medium text-sm">Barangay:</h1>
          <Select defaultValue="all">
            <SelectTrigger className="w-auto">
              <SelectValue placeholder="Select Barangay" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
        </div> */}

        <Button
          onClick={() => navigate("/manage/update/voter")}
          className="w-auto flex gap-2 p-2"
          variant="outline"
        >
          <GrDocumentUpdate /> Compose team
        </Button>
        <Popover>
          <PopoverTrigger>
            <Button variant="outline">
              <FaEllipsisV />
            </Button>
          </PopoverTrigger>

          <PopoverContent>
            <div className="flex flex-col gap-2">
              <div className="w-full flex flex-col gap-2 py-2">
                <Button
                  className="flex gap-2"
                  variant="outline"
                  onClick={() => {
                    setOnSelect(!onSelect);
                    setSeelectedList([]);
                  }}
                >
                  <MdDeselect /> {onSelect ? "Cancel" : "Select many"}
                </Button>
                {onSelect && (
                  <Button
                    className="flex gap-2"
                    variant="destructive"
                    onClick={() => setMultiRemove(true)}
                  >
                    Remove selected
                  </Button>
                )}

                <Button
                  onClick={() => setGenerate(true)}
                  className="flex gap-2 items-center"
                  variant="outline"
                >
                  <IoQrCodeSharp />
                  Generate QR code
                </Button>
              </div>

              <Button
                onClick={() => navigate(`/manage/update/voter-list`)}
                className="flex gap-2 items-center"
                variant="outline"
              >
                <GrDocumentUpdate/>
                Update List
              </Button>

              <Button
                onClick={() => setOnDeleteArea(true)}
                className="flex gap-2 items-center"
              >
                <MdOutlineDeleteSweep fontSize={22} />
                Delete area
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="w-full p-2 sticky top-0 bg-white z-10">
        {data && data.getAllVoters.length > 0 && (
          <Pagination className=" w-full flex gap-2">
            <PaginationContent>
              <PaginationItem
                className="mr-10 border border-gray-400 p-1 rounded cursor-pointer"
                onClick={() => {
                  if (currentOffset === "0") {
                    return;
                  }
                  setOffset((prev) => {
                    prev.set("page", "0");
                    return prev;
                  });
                }}
              >
                <h1 className=" font-medium">First</h1>
              </PaginationItem>
              <PaginationItem className="mr-10" onClick={handlePrev}>
                <PaginationPrevious size={undefined} />
              </PaginationItem>
              {parseInt(currentOffset, 10) - 1 !== 0 && (
                <PaginationItem
                  onClick={() => {
                    if (!currentOffset) {
                      return;
                    }
                    setOffset((prev) => {
                      const count = parseInt(currentOffset, 10) - 1;
                      prev.set("page", count.toString());
                      return prev;
                    });
                  }}
                >
                  {parseInt(currentOffset, 10) - 1}
                </PaginationItem>
              )}
              <PaginationItem className="border border-gray-700 rounded">
                <PaginationLink size={undefined}>
                  {parseInt(currentOffset, 10)}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem
                onClick={() => {
                  if (!currentOffset) {
                    return;
                  }
                  setOffset((prev) => {
                    const count = parseInt(currentOffset, 10) + 1;
                    prev.set("page", count.toString());
                    return prev;
                  });
                }}
              >
                <PaginationLink size={undefined}>
                  {parseInt(currentOffset, 10) + 1}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem className="ml-10">
                <PaginationNext
                  onClick={handleNext}
                  href="#"
                  size={undefined}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      <div className="w-full">
        {loading ? (
          <div className="w-full h-1/2 grid">
            <h1 className="m-auto font-semibold text-lg">Loading....</h1>
          </div>
        ) : data?.getAllVoters.length === 0 ? (
          <div className="w-full h-1/2 grid">
            <h1 className="font-medium text-gray-700 m-auto">
              NO voters found
            </h1>
          </div>
        ) : (
          <Table>
            <TableHeader>
              {[
                onSelect && (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={() => setSelectAll(!selectAll)}
                    />
                    <h1>Select all ({selectedList.length})</h1>
                  </div>
                ),
                "No.",
                "Lastname",
                "Firstname",
                "Level",
                "Gender",
                "Municipal",
                "Barangay",
                "Purok",
              ]
                .filter(Boolean)
                .map((item) => (
                  <TableHead>{item}</TableHead>
                ))}
            </TableHeader>

            <TableBody>
              {data?.getAllVoters.map((item, i) => (
                <TableRow
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelect) {
                      const state = handleCheckValue(item.id);
                      handleCheckVoter(item.id, state);
                      return;
                    }
                    handleNav(item.id);
                  }}
                  className="hover:bg-blue-100"
                  key={item.id}
                >
                  {onSelect && (
                    <TableCell className="z-50">
                      <Checkbox
                        checked={handleCheckValue(item.id)}
                        onCheckedChange={(checked) => {
                          handleCheckVoter(item.id, checked as boolean);
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                  )}
                  <TableCell>
                    {parseInt(currentOffset, 10) + 1 < 1
                      ? i + 1
                      : (parseInt(currentOffset, 10) + 1) * LIMIT + 1 + i}
                  </TableCell>
                  <TableCell>{item.lastname}</TableCell>
                  <TableCell>{item.firstname}</TableCell>
                  <TableCell>{handleLevel(item.level)}</TableCell>
                  <TableCell>{item.gender}</TableCell>
                  <TableCell>{item.barangay.name}</TableCell>
                  <TableCell>{item.municipal.name}</TableCell>
                  <TableCell>{item.purok?.purokNumber}</TableCell>
                  <TableCell>{item.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Modal
        title="Search voter's firstname or lastname"
        className="max-w-3xl"
        children={
          <div>
            <SearchVoters />
          </div>
        }
        open={onSearch}
        onOpenChange={() => {
          setOnSearch(false);
        }}
      />

      <Modal
        className="max-w-2xl"
        title="Refine voter's list"
        open={onRefine}
        onOpenChange={() => {
          setOnRefine(false);
        }}
        children={
          <RefineVoterList
            currentPurok={currentPurok}
            currentBarangay={currentBarangay}
            minicipals={(data && data.municipals) || []}
            setBarangay={setBarangay}
            setMunicipal={setMunicipal}
            currentMunicipal={currentMunicipal}
          />
        }
      />

      <Modal
        title={`Remove the selected item: (${selectedList.length})`}
        open={onMultiRemove}
        onOpenChange={() => {
          if (removing) {
            return;
          }
          setMultiRemove(false);
        }}
        children={<h1>This action cannot be undo afterward.</h1>}
        onFunction={handleRemoveMultiVoter}
        loading={removing}
        footer={true}
      />

      <Modal
        title="Generate QR code for the selected item."
        footer={true}
        loading={generating}
        onFunction={handleBundleQrcodeGenerating}
        open={onGenerate}
        onOpenChange={() => {
          if (generating) {
            return;
          }
          setGenerate(false);
        }}
      />
      <Modal
        onFunction={handleDeleteAreaVoters}
        loading={areaRemoving}
        open={onDeleteArea}
        onOpenChange={() => {
          setOnDeleteArea(false);
        }}
        title="Delete Area"
        footer={true}
        children={
          <>
            <h1 className="text-lg font-mono text-gray-800">
              Area to be remove,
            </h1>
            <ul>
              <li>-{currentMunicipal === "all" && "True"}</li>
              <li>{currentBarangay}</li>
            </ul>
            <h1 className="text-red-500 font-medium">
              Proceed? This action cannot be undo afterwads.
            </h1>
            <DeleteConfirm setIsCorrect={setIsCorrect} isCorrect={isCorrect} />
          </>
        }
      />
    </div>
  );
};

export default UpdateVoters;