import { useEffect, useState, useMemo } from "react";
//lib
import { useQuery } from "@apollo/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUserData } from "../provider/UserDataProvider";
//query
import {
  //GET_ALL_COLL,
  GET_BARANGAY_STAB,
} from "../GraphQL/Queries";
//ui
import { Button } from "../components/ui/button";
import Modal from "../components/custom/Modal";
import NewCollBatchForm from "../layout/NewCollBatchForm";
import EditBarangayStabColl from "../layout/EditBarangayStabColl";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableHeader,
  TableFooter,
} from "../components/ui/table";
import MunicipalSel from "../components/custom/MunicipalSel";
import { BarangayProps } from "../interface/data";

//icons
import { FaPrint } from "react-icons/fa";

const StabCollection = () => {
  const [onOpen, setOnOpen] = useState(0);
  const [selected, setSelected] = useState<BarangayProps | null>(null);
  const user = useUserData();
  const [params, setParams] = useSearchParams({
    zipCode: user.forMunicipal !== 4905 ? user.forMunicipal.toString() : "4905",
    barangay: "",
  });

  const nav = useNavigate();

  const currentMunicipal = params.get("zipCode") || "4905";
  const handleChangeArea = (value: string, key: string) => {
    setParams(
      (prev) => {
        prev.set(key, value);
        return prev;
      },
      {
        replace: true,
      }
    );
  };

  const { data, refetch } = useQuery<{ barangayList: BarangayProps[] }>(
    GET_BARANGAY_STAB,
    {
      variables: {
        zipCode: parseInt(currentMunicipal, 10),
      },
    }
  );

  const handleCalVariance = (curr: number, result: number) => {
    if (curr === result) {
      return "=";
    } else if (curr < result) {
      return "+";
    } else if (curr > result) {
      return "-";
    }
  };

  const totolMachine = useMemo(() => {
    if (!data) return 0;
    return (
      data?.barangayList.reduce((acc, base) => {
        return acc + base.machines.length;
      }, 0) || 0
    );
  }, [data]);

  const totolTeams = useMemo(() => {
    if (!data) return 0;
    return (
      data?.barangayList.reduce((acc, base) => {
        return acc + base.supporters.tl;
      }, 0) || 0
    );
  }, [data]);

  const totalMembers = useMemo(() => {
    if (!data) return 0;
    return (
      data?.barangayList.reduce((acc, base) => {
        return acc + base.supporters.withTeams;
      }, 0) || 0
    );
  }, [data]);

  const totalOverall = useMemo(() => {
    if (!data) return 0;
    return (
      data?.barangayList.reduce((acc, base) => {
        return acc + (base.supporters.withTeams + base.supporters.tl);
      }, 0) || 0
    );
  }, [data]);

  useEffect(() => {
    refetch({
      zipCode: parseInt(currentMunicipal, 10),
    });
  }, [currentMunicipal]);

  console.log(user);

  if (!data) {
    return;
  }

  return (
    <div className="w-full flex flex-col h-[88vh]">
      {" "}
      {/* Added fixed height */}
      <div className="w-full flex justify-end items-center p-2 border border-l-0 border-r-0 gap-2">
        <MunicipalSel
          disabled={
            user.forMunicipal && user.forMunicipal !== 4905 ? true : false
          }
          className="max-w-96"
          defaultValue={
            user.forMunicipal && user.forMunicipal !== 4905
              ? user.forMunicipal.toString()
              : "4905"
          }
          value={currentMunicipal}
          handleChangeArea={handleChangeArea}
        />
        <Button
          className=" flex items-center gap-2"
          size="sm"
          onClick={() => setOnOpen(1)}
        >
          <FaPrint fontSize={12} />
          Print
        </Button>
      </div>
      <div className="flex-1 overflow-auto relative">
        {" "}
        {/* Wrapper for scrollable area */}
        <Table className=" relative">
          <TableHeader className="sticky top-0 bg-background z-10">
            {" "}
            {/* Added bg-background and z-10 */}
            <TableHead>No.</TableHead>
            <TableHead>Barangay</TableHead>
            <TableHead>Machine</TableHead>
            <TableHead>Team (TL only)</TableHead>
            <TableHead>Members</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Stab 1</TableHead>
            <TableHead>Stab 2</TableHead>
            <TableHead>Total SOV</TableHead>
            <TableHead>Variance</TableHead>
          </TableHeader>
          <TableBody>
            {data.barangayList.map((item, i) => (
              <TableRow
                className=" cursor-pointer hover:bg-slate-200"
                key={i}
                onClick={() => {
                  setSelected(item);
                  setOnOpen(2);
                }}
              >
                <TableCell>{i + 1}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.machines.length}</TableCell>
                <TableCell>{item.supporters.tl}</TableCell>
                <TableCell>{item.supporters.withTeams}</TableCell>
                <TableCell>
                  {item.supporters.withTeams + item.supporters.tl}
                </TableCell>
                <TableCell>{item.collectionResult.stabOne}</TableCell>
                <TableCell>{item.collectionResult.stabTwo}</TableCell>
                <TableCell>
                  {item.machines.reduce((acc, base) => acc + base.result, 0) ??
                    0}
                </TableCell>
                <TableCell>
                  {handleCalVariance(
                    item.supporters.withTeams + item.supporters.tl,
                    item.machines.reduce((acc, base) => acc + base.result, 0) ??
                      0
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableCell>----</TableCell>
            <TableCell>----</TableCell>
            <TableCell>{totolMachine}</TableCell>
            <TableCell>{totolTeams}</TableCell>
            <TableCell>{totalMembers}</TableCell>
            <TableCell>{totalOverall}</TableCell>
            <TableCell>----</TableCell>
            <TableCell>----</TableCell>
          </TableFooter>
        </Table>
      </div>
      <Modal
        title="Start Collection"
        children={<NewCollBatchForm />}
        open={onOpen === 1}
        onOpenChange={() => setOnOpen(0)}
      />
      <Modal
        title={selected?.name}
        className="max-w-sm"
        children={
          <div className=" w-full flex flex-col gap-2">
            <Button onClick={() => nav(`/manage/collection/${selected?.id}`)}>
              View Barangay
            </Button>
            <Button
              disabled
              variant="outline"
              className=" border border-gray-400 hover:border-gray-500"
            >
              Print
            </Button>
            <Button
              disabled
              variant="outline"
              className=" border border-gray-400 hover:border-gray-500"
              onClick={() => setOnOpen(3)}
            >
              Edit Commelec Result
            </Button>
          </div>
        }
        open={onOpen === 2}
        onOpenChange={() => {
          setSelected(null);
          setOnOpen(0);
        }}
      />
      <Modal
        title={selected?.name}
        children={
          <EditBarangayStabColl
            setOnOpen={setOnOpen}
            zipCode={parseInt(currentMunicipal, 10)}
            stabTwo={selected?.collectionResult.stabTwo as number}
            barangayId={selected?.id as string}
          />
        }
        open={onOpen === 3}
        onOpenChange={() => setOnOpen(0)}
      />
    </div>
  );
};

export default StabCollection;
