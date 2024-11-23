/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce";
//graphql
import { useQuery } from "@apollo/client";
import {
  GET_VOTER_LIST,
  GET_MUNICIPALS,
  GET_BARANGAYS,
  GET_PUROKLIST,
} from "../GraphQL/Queries";
//ui
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "../components/ui/table";
import { Checkbox } from "../components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import Modal from "../components/custom/Modal";
//icons
import { GrAnalytics } from "react-icons/gr";
import { MdRestartAlt } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { FaAngleDown } from "react-icons/fa6";
import { FaAngleUp } from "react-icons/fa6";
import { RiProfileLine } from "react-icons/ri";
import { RiOrganizationChart } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { TbReport } from "react-icons/tb";
import { GrNotes } from "react-icons/gr";
//props
import {
  MunicipalProps,
  BarangayProps,
  PurokProps,
  VotersProps,
} from "../interface/data";
import {
  handleGender,
  handleLevel,
  handleSanitizeChar,
  handleReverseSanitizeChar,
} from "../utils/helper";
//layout
const typeOptions: { name: string; value: string }[] = [
  { name: "All", value: "all" },
  { name: "Voter", value: "0" },
  { name: "TL", value: "1" },
  { name: "PC", value: "2" },
  { name: "BC", value: "3" },
];

const capablityList: { name: string; value: string }[] = [
  { name: "PWD", value: "pwd" },
  { name: "ILLI", value: "illi" },
  { name: "INC", value: "inc" },
  { name: "OR", value: "or" },
  { name: "DEAD", value: "dead" },
  { name: "18-30", value: "youth" },
  { name: "60+", value: "senior" },
];
//utils
import { handleElements } from "../utils/element";
const GenerateList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [onOpen, setOnOpen] = useState<number>(0);
  const [query] = useDebounce(searchQuery, 1000);
  const [selectedPurok, setSelectedPurok] = useState("all");
  const [onExtend, setOnExtend] = useState<boolean>(false);

  const navigate = useNavigate();
  const [params, setParams] = useSearchParams({ type: "all" });
  const [queryParams, setQueryParams] = useSearchParams({
    search: "",
  });
  const [areas, setAreas] = useSearchParams({
    zipCode: "all",
    barangay: "all",
    purok: "all",
    gender: "all",
  });
  const [searchParams, setSearchParams] = useSearchParams({ page: "1" });
  const [capParams, setCapParams] = useSearchParams({
    pwd: "NO",
    illi: "NO",
    or: "NO",
    inc: "NO",
    dead: "NO",
    youth: "NO",
    senior: "NO",
  });

  const currentType = params.get("type") || "all";
  const currentPage = searchParams.get("page") || "1";
  const currentMunicipal = areas.get("zipCode") || "all";
  const currentBarangay = areas.get("barangay") || "all";
  const currentPurok = areas.get("purok") || "all";

  //area params
  const currentPwd = capParams.get("pwd") || "NO";
  const currentIlli = capParams.get("illi") || "NO";
  const currentOr = capParams.get("or") || "NO";
  const currentInc = capParams.get("inc") || "NO";
  const currentDead = capParams.get("dead") || "NO";
  const currentYouth = capParams.get("youth") || "NO";
  const currentSenior = capParams.get("senior") || "NO";
  const currentGender = capParams.get("gender") || "all";
  const LIMIT = 50;

  //query params
  const currentQueryParas = queryParams.get("search");

  const sanitizedQuery = handleSanitizeChar("Jude DEmnuvar%");
  console.log("X", sanitizedQuery);
  console.log(handleReverseSanitizeChar(sanitizedQuery));

  const handleQueryParams = (value: string) => {
    if (!value) {
      return;
    }
    const sanitizedQuery = handleSanitizeChar(value);

    setQueryParams(
      (prev) => {
        prev.set("search", sanitizedQuery);
        return prev;
      },
      {
        replace: true,
      }
    );
  };

  useEffect(() => {
    handleQueryParams(query);
  }, [query]);

  const handleChangeType = (value: string) => {
    setParams(
      (prev) => {
        prev.set("type", value);
        return prev;
      },
      {
        replace: true,
      }
    );
  };

  const handleChangeCap = (key: string, check: boolean) => {
    setCapParams(
      (prev) => {
        prev.set(key, check ? "YES" : "NO");
        return prev;
      },
      {
        replace: true,
      }
    );
  };

  const handleCheckCap = (key: string): boolean => {
    const currentValue = capParams.get(key);
    if (currentValue === "YES") {
      return true;
    }
    return false;
  };

  const {
    data: voter,
    loading: voterLoading,
    error: voterError,
    refetch,
  } = useQuery<{ getVotersList: { voters: VotersProps[]; results: number } }>(
    GET_VOTER_LIST,
    {
      variables: {
        level: currentType,
        zipCode: currentMunicipal,
        barangayId: currentBarangay,
        purokId: currentPurok,
        take: LIMIT,
        skip: parseInt(currentPage, 10) * LIMIT,
        query,
        pwd: currentPwd,
        illi: currentIlli,
        inc: currentInc,
        oor: currentOr,
        dead: currentDead,
        youth: currentYouth,
        senior: currentSenior,
      },
    }
  );

  useEffect(() => {
    refetch({
      level: currentType,
      municipalsId: currentMunicipal,
      barangaysId: currentBarangay,
      purokId: currentPurok,
      take: LIMIT,
      skip: parseInt(currentPage, 10) * LIMIT,
      query,
      pwd: currentPwd,
      illi: currentIlli,
      inc: currentInc,
      oor: currentOr,
      dead: currentDead,
      youth: currentYouth,
      senior: currentSenior,
      gender: currentGender,
    });
  }, [
    currentType,
    currentMunicipal,
    currentBarangay,
    currentPurok,
    currentPage,
    query,
    currentPwd,
    currentIlli,
    currentOr,
    currentInc,
    currentDead,
    currentYouth,
    currentSenior,
    currentGender,
  ]);

  const { data, loading, error } = useQuery<{ municipals: MunicipalProps[] }>(
    GET_MUNICIPALS
  );

  const {
    data: barData,
    loading: barLoading,
    error: barError,
    refetch: barFetch,
  } = useQuery<{ barangayList: BarangayProps[] }>(GET_BARANGAYS, {
    variables: {
      zipCode: parseInt(currentMunicipal, 10),
    },
    skip: currentMunicipal === "all",
  });

  useEffect(() => {
    const hadleRefetch = async () => {
      if (currentMunicipal === "all") {
        return;
      }
      barFetch({
        zipCode: parseInt(currentMunicipal, 10),
      });
    };
    hadleRefetch();
  }, [currentMunicipal]);

  const {
    data: purokData,
    loading: purokLoading,
    error: purokError,
  } = useQuery<{ getPurokList: PurokProps[] }>(GET_PUROKLIST, {
    variables: {
      id: currentBarangay,
    },
    skip: currentBarangay === "all",
  });

  const handleChangeArea = (type: string, value: string) => {
    setAreas(
      (prev) => {
        prev.set(type, value);
        return prev;
      },
      {
        replace: true,
      }
    );
  };

  const handleChangePage = (operator: string) => {
    const prevPage = parseInt(currentPage, 10);
    const result = operator === "prev" ? prevPage - 1 : prevPage + 1;
    setSearchParams(
      (prev) => {
        prev.set("page", result.toString());
        return prev;
      },
      {
        replace: true,
      }
    );
  };

  if (loading || barLoading || purokLoading) {
    return (
      <div className="w-full h-1/2 grid">
        <h1 className="m-auto font-medium text-slate-800">
          Please wait, fetching the required data
        </h1>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full grid">
        <h1 className="font-medium text-lg text-red-500 m-auto">
          No municipal found
        </h1>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="w-full flex flex-col h-auto p-2 border rounded sticky top-0 items-center bg-white z-40">
        <div className="w-full flex h-auto p-2 border rounded sticky top-0 items-center">
          <div className=" flex items-center gap-2">
            <h1 className="font-medium font-mono text-sm text-gray-700">
              Level:{" "}
            </h1>
            {typeOptions.map((item) => (
              <Button
                className="border border-gray-400 font-mono"
                size="sm"
                variant={currentType === item.value ? "default" : "outline"}
                onClick={() => {
                  handleChangeType(item.value);
                }}
              >
                {item.name}
              </Button>
            ))}
          </div>

          <div className="flex items-center ml-4 gap-2">
            <Label htmlFor="municipal" className="font-mono">
              Municipal
            </Label>
            <Select
              onValueChange={(value) => handleChangeArea("zipCode", value)}
              value={currentMunicipal}
              disabled={loading}
              defaultValue="all"
            >
              <SelectTrigger id="municipal">
                <SelectValue placeholder={loading ? "Loading..." : "Select"} />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {data.municipals.map((item) => (
                  <SelectItem
                    value={item.id.toString()}
                    key={item.id.toString()}
                  >
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Label htmlFor="barangay" className="font-mono">
              Barangay
            </Label>
            <Select
              onValueChange={(value) => handleChangeArea("barangay", value)}
              value={currentBarangay}
              defaultValue="all"
            >
              <SelectTrigger id="barangay">
                <SelectValue placeholder="Select" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {barData?.barangayList.map((item) => (
                  <SelectItem
                    value={item.id.toString()}
                    key={item.id.toString()}
                  >
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Label htmlFor="purok" className="font-mono">
              Purok
            </Label>
            <Select
              onValueChange={(value) => handleChangeArea("purok", value)}
              value={currentPurok}
              defaultValue="all"
            >
              <SelectTrigger id="purok">
                <SelectValue placeholder="Select" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {purokData?.getPurokList.map((item) => (
                  <SelectItem value={item.id as string} key={item.id as string}>
                    {item.purokNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={() => setOnExtend(!onExtend)}
            className="ml-2 flex gap-2"
            id="other"
            variant="outline"
            size="sm"
          >
            Others
            {onExtend ? (
              <FaAngleUp fontSize={15} color="#333" />
            ) : (
              <FaAngleDown fontSize={15} color="#333" />
            )}
          </Button>

          <Button
            className="ml-2 hover:border border-gray-700"
            size="sm"
            variant="secondary"
          >
            <MdRestartAlt />
          </Button>

          <div className=" flex gap-3 border-gray-800 p-1 items-center absolute right-0 mr-2">
            <CiSearch fontSize={25} />
            <Input
              className="border border-gray-500"
              placeholder="Search voter"
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <Button>
              <GrAnalytics />
            </Button>
          </div>
        </div>
        {onExtend && (
          <div className="w-full flex items-center gap-2">
            <div className="flex gap-4 ">
              {capablityList.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <Checkbox
                    checked={handleCheckCap(item.value)}
                    onCheckedChange={(check) =>
                      handleChangeCap(item.value, check as boolean)
                    }
                    id={item.name}
                  />
                  <h1 className="font-mono font-medium text-sm">{item.name}</h1>
                </div>
              ))}
            </div>
            <RadioGroup
              defaultValue="all"
              value={currentGender}
              onValueChange={(value) => handleChangeArea("gender", value)}
              className="flex gap-2 ml-6"
            >
              <Label className="mr-2">Gender:</Label>

              <RadioGroupItem value="all" id="r1" />
              <Label htmlFor="r1">All</Label>
              <RadioGroupItem value="Male" id="r2" />
              <Label htmlFor="r2">Male</Label>
              <RadioGroupItem value="Female" id="r3" />
              <Label htmlFor="r3">Female</Label>
            </RadioGroup>
            <Label htmlFor="purok" className="font-mono ml-4">
              Candidate
            </Label>
            <Select
              onValueChange={(value) => setSelectedPurok(value)}
              value={selectedPurok}
              defaultValue="all"
            >
              <SelectTrigger className="w-auto" id="purok">
                <SelectValue placeholder="Select" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {purokData?.getPurokList.map((item) => (
                  <SelectItem value={item.id as string} key={item.id as string}>
                    {item.purokNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="default"
              size="sm"
              className="flex gap-1 absolute right-0 mr-2"
            >
              <TbReport fontSize={20} />
              Report
            </Button>
          </div>
        )}
      </div>
      {voterLoading ? (
        <div className="w-full min-h-96 grid">
          <h1 className="m-auto font-medium text-lg text-slate-800">
            Loading...
          </h1>
        </div>
      ) : voter?.getVotersList.results === 0 ? (
        <div className="w-full grid min-h-96">
          <h1 className="m-auto font-mono font-semibold text-[#333]">
            No voter found
          </h1>
        </div>
      ) : (
        <>
          <div className="p-2 text-sm font-medium text-[#333]">
            <h1 className="p-2">Results: {voter?.getVotersList.results}</h1>
          </div>

          <Table>
            <TableHeader>
              <TableHead>No</TableHead>
              <TableHead>Lastname</TableHead>
              <TableHead>Firsname</TableHead>
              <TableHead>Level/Handled</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Municipal</TableHead>
              <TableHead>Barangay</TableHead>
              <TableHead>Purok</TableHead>
              <TableHead></TableHead>
            </TableHeader>

            <TableBody>
              {voter?.getVotersList.voters.map((item, index) => (
                <TableRow key={index}>
                  <TooltipProvider>
                    <TableCell className="font-medium text-gray-800">
                      {parseInt(currentPage, 10) <= 1
                        ? index + 1
                        : (parseInt(currentPage, 10) - 1) * LIMIT + index + 1}
                    </TableCell>
                    <TableCell>
                      {handleElements(query, item.lastname)}
                    </TableCell>
                    <TableCell>
                      {handleElements(query, item.firstname)}
                    </TableCell>
                    <TableCell>{handleLevel(item.level)}</TableCell>
                    <TableCell>{item.gender}</TableCell>
                    <TableCell>{item.municipal.name}</TableCell>
                    <TableCell>{item.barangay.name}</TableCell>
                    <TableCell>{item.purok?.purokNumber}</TableCell>
                    <TableCell className="flex gap-2">
                      <Tooltip delayDuration={1.5}>
                        <TooltipTrigger>
                          <Button size="sm" variant="outline">
                            <RiOrganizationChart />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View Team</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip delayDuration={1.5}>
                        <TooltipTrigger>
                          <Button size="sm" variant="outline">
                            <CiEdit />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit Voter's info</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip delayDuration={1.5}>
                        <TooltipTrigger>
                          <Button
                            onClick={() => setOnOpen(3)}
                            size="sm"
                            variant="outline"
                          >
                            <GrNotes />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Mark</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip delayDuration={1.5}>
                        <TooltipTrigger>
                          <Button
                            onClick={() => navigate(`/voter/${item.id}`)}
                            size="sm"
                            variant="outline"
                          >
                            <RiProfileLine />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View Profile</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                  </TooltipProvider>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
      {!voterLoading && voter && (
        <div className="w-full flex gap-2 justify-center items-center p-2">
          <Button
            disabled={voter.getVotersList.results <= LIMIT || voter.getVotersList.results === 0}
            onClick={() => {
              if (currentPage === "1") {
                return;
              }
              setSearchParams(
                (prev) => {
                  prev.set("page", "1");
                  return prev;
                },
                {
                  replace: true,
                }
              );
            }}
            size="sm"
            variant="outline"
          >
            First
          </Button>
          <Button
            disabled={voter.getVotersList.results <= LIMIT || voter.getVotersList.results === 0}
            onClick={() => handleChangePage("prev")}
            className="mr-4"
            variant="secondary"
            size="sm"
          >
            Prev
          </Button>
          {parseInt(currentPage, 10) - 1 !== 0 ? (
            <Button
            disabled={voter.getVotersList.results <= LIMIT || voter.getVotersList.results === 0}
              onClick={() => {
                const page = parseInt(currentPage, 10) - 1;
                if (currentPage === page.toString()) {
                  return;
                }
                setSearchParams(
                  (prev) => {
                    prev.set("page", page.toString());
                    return prev;
                  },
                  {
                    replace: true,
                  }
                );
              }}
              className=""
              variant="outline"
              size="sm"
            >
              {parseInt(currentPage, 10) - 1}
            </Button>
          ) : null}

          <Button
            disabled={voter.getVotersList.results <= LIMIT || voter.getVotersList.results === 0}
            className="border border-gray-800"
            variant="outline"
            size="sm"
            onClick={() => {
              const page = parseInt(currentPage, 10);
              if (currentPage === page.toString()) {
                return;
              }
              setSearchParams(
                (prev) => {
                  prev.set("page", page.toString());
                  return prev;
                },
                {
                  replace: true,
                }
              );
            }}
          >
            {parseInt(currentPage, 10)}
          </Button>
          <Button
             disabled={voter.getVotersList.results <= LIMIT || voter.getVotersList.results === 0}
            onClick={() => {
              const page = parseInt(currentPage, 10) + 1;
              if (currentPage === page.toString()) {
                return;
              }
              setSearchParams(
                (prev) => {
                  prev.set("page", page.toString());
                  return prev;
                },
                {
                  replace: true,
                }
              );
            }}
            className=""
            variant="outline"
            size="sm"
          >
            {parseInt(currentPage, 10) + 1}
          </Button>
          <Button
            disabled={voter.getVotersList.results <= LIMIT || voter.getVotersList.results === 0}
            onClick={() => handleChangePage("next")}
            className="ml-4"
            variant="secondary"
            size="sm"
          >
            Next
          </Button>
        </div>
      )}

      <Modal open={onOpen === 3} onOpenChange={()=>{
        setOnOpen(0)
      }} />
    </div>
  );
};

export default GenerateList;
