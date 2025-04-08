import { useEffect, useState } from "react";
import { SCAN_LIST } from "../GraphQL/Queries";
//
import { useSearchParams } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
//layout
import ScanAreaSelect from "../layout/ScanAreaSelect";
//ui
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "../components/ui/select";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import Modal from "../components/custom/Modal";
import { CalibratedResult } from "../interface/data";
import { handleLevel } from "../utils/helper";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  //MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "../components/ui/menubar";
import { Checkbox } from "../components/ui/checkbox";

const Scan = () => {
  const [onOpen, setOnOpen] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [dataResult, setDataResult] = useState<CalibratedResult[] | null>(null);
  const [params, setParams] = useSearchParams({
    zipCode: "4905",
    barangay: "",
    screen: "0",
    level: "0",
    respond: "0",
  });

  const nav = useNavigate();

  const currentMunicipal = params.get("zipCode") || "4905";
  const currentBarangay = params.get("barangay") || "all";
  const currentScreen = params.get("screen") || "0";
  //const currentLevel = params.get("level") || "0";
  const currentRespond = params.get("respond") || "0";

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

  const handleCheckState = (id: string) => {
    const copyList = [...selected];
    return copyList.includes(id);
  };

  const handleSelectMultipleVoter = (id: string, checked: boolean) => {
    let updatedList = [...selected];
    if (checked) {
      // Remove the item if it exists
      updatedList = updatedList.filter((item) => item !== id);
    } else {
      // Add the item if it does not exist
      updatedList.push(id);
    }
    setSelected(updatedList);
  };

  const [getScanList, { data, loading }] = useLazyQuery<{
    calibrateTeamArea: CalibratedResult[];
  }>(SCAN_LIST, {
    onCompleted: () => {
      setOnOpen(0);
      handleChangeOption("respond", "1");
    },
    onError: (error) => {
      console.log(error);

      toast.error("Error fetching data", {
        description: error.message,
      });
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
  });

  const handleGetToLocal = (id: string) => {
    const data = localStorage.getItem(id);
    if (data) {
      const parsedData: CalibratedResult[] = JSON.parse(data);
      return parsedData;
    }
    return null;
  };

  const handleScan = async () => {
    if (currentMunicipal === "all") {
      toast.warning("Please select a valid area", {
        closeButton: false,
        description: "Select a spefic area to scan",
      });
      return;
    }
    const response = await getScanList({
      variables: {
        zipCode: parseInt(currentMunicipal, 10),
        barangayId: currentBarangay,
      },
    });
    if (!response.data) {
      toast.error("Error fetching data", {
        description: "Please try again",
      });
      return;
    }
    const { calibrateTeamArea } = response.data;
    if (calibrateTeamArea.length === 0) {
      throw new Error("No data found");
    }
    const existed = handleGetToLocal(currentBarangay);
    if (existed) {
      const existedIds = new Set(existed.map((item) => item.votersId));
      const filtered = calibrateTeamArea.filter(
        (item) => !existedIds.has(item.votersId)
      );
      const merged = [...existed, ...filtered];
      localStorage.setItem(`${currentBarangay}`, JSON.stringify(merged));
      setDataResult(merged);
    } else {
      localStorage.setItem(
        `${currentBarangay}`,
        JSON.stringify(calibrateTeamArea)
      );
      setDataResult(calibrateTeamArea);
    }
  };

  useEffect(() => {
    if (currentRespond === "1") {
      const data = handleGetToLocal(currentBarangay);
      if (data) {
        setDataResult(data);
      }
    } else {
      setDataResult(null);
      handleChangeOption("respond", "0");
    }
  }, [data, currentBarangay, currentMunicipal]);

  const screens = [
    <ScanAreaSelect
      handleChangeOption={handleChangeOption}
      currentMunicipal={currentMunicipal}
      currentBarangay={currentBarangay}
      defaultValue={""}
    />,
    <div className="w-full ">
      <div>
        <p className=" text-lg font-medium">Step 2</p>
        <p>Select level</p>
      </div>
      <Select
        defaultValue="0"
        onValueChange={(e) => handleChangeOption("level", e)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0">Voter</SelectItem>
          <SelectItem value="1">TL</SelectItem>
          <SelectItem value="2">PC</SelectItem>
          <SelectItem value="3">BC</SelectItem>
        </SelectContent>
      </Select>
    </div>,
  ];

  const handleNext = () => {
    if (currentMunicipal === "all") {
      return toast.warning("Please select a valid area", {
        closeButton: false,
        description: "Select a spefic area to scan",
      });
    }
    handleChangeOption("screen", (parseInt(currentScreen, 10) + 1).toString());
  };

  const handleExit = () => {
    handleChangeOption("respond", "0");
    localStorage.removeItem(currentBarangay);
    setDataResult(null);
    setSelected([]);
  };

  // const removeSpecificPath = (pathToRemove: string) => {
  //   // Get current history entries
  //   const currentEntries = window.history.state?.usr?.entries || [];

  //   // Filter out the path we want to remove
  //   const filteredEntries = currentEntries.filter(
  //     (entry: { pathname: string }) => entry.pathname !== pathToRemove
  //   );

  //   // Replace history with filtered entries
  //   window.history.replaceState(
  //     { ...window.history.state, usr: { entries: filteredEntries } },
  //     ""
  //   );
  // };

  return (
    <div className="w-full p-2 flex flex-col gap-2">
      <div>
        <p>
          Start scanning for any visually missplaced data (level; title; etc.),
          visibility absent and others
        </p>
      </div>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Actions</MenubarTrigger>
          <MenubarContent>
            {onOpen === 2 ? (
              <MenubarItem
                onClick={() => {
                  setSelected([]);
                  setOnOpen(0);
                }}
              >
                Cancel Multi Select <MenubarShortcut>⌘C</MenubarShortcut>
              </MenubarItem>
            ) : onOpen === 0 ? (
              <MenubarItem onClick={() => setOnOpen(2)}>
                Multi Select <MenubarShortcut>⌘M</MenubarShortcut>
              </MenubarItem>
            ) : null}
            <MenubarItem disabled={loading} onClick={handleScan}>
              Refresh <MenubarShortcut>⌘R</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={handleExit}>
              Exit <MenubarShortcut>⌘E</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      {currentRespond === "1" && dataResult ? (
        <div className="w-full">
          <Table>
            <TableHeader className="bg-gray-200">
              {onOpen === 2 ? <TableHead>Selected</TableHead> : null}

              <TableHead>No. </TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Fullname</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Barangay</TableHead>
              <TableHead>Issue</TableHead>
              <TableHead>Solution</TableHead>
              <TableHead>Code</TableHead>
            </TableHeader>
            <TableBody>
              {dataResult.map((item, i) => (
                <TableRow
                  key={i}
                  onClick={() => {
                    if (onOpen === 2) {
                      handleSelectMultipleVoter(
                        item.votersId,
                        handleCheckState(item.votersId)
                      );
                      return;
                    }
                    nav(`/teams/${item.teamId}`);
                  }}
                >
                  {onOpen === 2 ? (
                    <TableCell>
                      <Checkbox checked={handleCheckState(item.votersId)} />
                    </TableCell>
                  ) : null}
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{item.voter?.idNumber}</TableCell>
                  <TableCell>
                    {item.voter?.lastname}, {item.voter?.firstname}
                  </TableCell>
                  <TableCell>{handleLevel(item.currentLevel)}</TableCell>
                  <TableCell>{item.voter?.barangay.name}</TableCell>
                  <TableCell>{item.reason}</TableCell>
                  <TableCell>{item.correct}</TableCell>
                  <TableCell>{item.code}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="w-3/4 h-96 border flex flex-col justify-between self-center p-4">
          {screens[parseInt(currentScreen, 10)]}
          <div className="w-full flex justify-end p-2 border border-l-0 border-r-0 gap-2">
            <Button
              variant="outline"
              disabled={parseInt(currentScreen, 10) === 0}
              onClick={() => {
                handleChangeOption(
                  "screen",
                  (parseInt(currentScreen, 10) - 1).toString()
                );
              }}
            >
              Prev
            </Button>

            {parseInt(currentScreen, 10) === screens.length - 1 ? (
              <Button onClick={() => setOnOpen(1)}>Start</Button>
            ) : (
              <Button
                disabled={parseInt(currentScreen, 10) === screens.length - 1}
                onClick={() => {
                  handleNext();
                }}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      )}
      <Modal
        loading={loading}
        className="max-w-xl"
        title="Start scanning"
        open={onOpen === 1}
        onOpenChange={() => {
          if (loading) return;
          setOnOpen(0);
        }}
        footer={true}
        onFunction={handleScan}
      />
    </div>
  );
};

export default Scan;
