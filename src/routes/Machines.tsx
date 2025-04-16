import { useMutation, useQuery } from "@apollo/client";
import { GET_ALL_MACHINE } from "../GraphQL/Queries";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useUserData } from "../provider/UserDataProvider";
//
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import Modal from "../components/custom/Modal";
import NewMachine from "../layout/NewMachine";
import MunicipalSel from "../components/custom/MunicipalSel";
import { MachineProps } from "../interface/data";
import EditMachine from "../layout/EditMachine";
import { REMOVE_MACHINE } from "../GraphQL/Mutation";
import { toast } from "sonner";
const Machines = () => {
  const user = useUserData();
  const [onOpen, setOnOpen] = useState(0);
  const [selected, setSelected] = useState<MachineProps | null>(null);
  const [params, setParams] = useSearchParams({
    zipCode:
      user.forMunicipal && user.forMunicipal !== 4905
        ? user.forMunicipal?.toString()
        : "4905",
    barangay: "none",
  });

  const currentMunicipal = params.get("zipCode") || "4905";
  const currentBarangay = params.get("barangay") || "none";
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

  const { data, refetch } = useQuery<{ getAllMachines: MachineProps[] }>(
    GET_ALL_MACHINE,
    {
      variables: {
        zipCode: parseInt(currentMunicipal, 10),
      },
      skip: currentMunicipal ? false : true,
    }
  );

  const [removeMachine, { loading: removing }] = useMutation(REMOVE_MACHINE, {
    refetchQueries: [
      {
        query: GET_ALL_MACHINE,
        variables: {
          zipCode: parseInt(currentMunicipal, 10),
        },
      },
    ],
    onCompleted: () => {
      toast.success("Remove success.", {
        closeButton: false,
      });
      setOnOpen(0);
    },
    onError: () => {
      toast.error("Failed to remove.", {
        closeButton: false,
      });
    },
  });

  const handelRemoveMachine = async () => {
    if (!selected) {
      toast.warning("Select a machine first.", {
        closeButton: false,
      });
      return;
    }
    await removeMachine({
      variables: {
        id: selected.id,
      },
    });
  };

  useEffect(() => {
    refetch({
      zipCode: parseInt(currentMunicipal, 10),
    });
  }, [currentMunicipal]);

  return (
    <div className="w-full ">
      <div className=" w-full p-4 flex justify-between">
        <p className="font-medium text-lg">Machines</p>
        <div className="flex gap-3">
          <MunicipalSel
            defaultValue={""}
            value={currentMunicipal}
            handleChangeArea={handleChangeArea}
            disabled={user.forMunicipal ? true : false}
          />
          <Button size="sm" variant="outline" disabled>
            Print
          </Button>
          <Button size="sm" onClick={() => setOnOpen(1)}>
            Add
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableHead>No. </TableHead>
          <TableHead>Barangay</TableHead>
          <TableHead>Precincts</TableHead>
          <TableHead>Total Reg. Voters</TableHead>
          <TableHead>Votes</TableHead>
        </TableHeader>
        <TableBody>
          {data?.getAllMachines.map((item) => (
            <TableRow
              className=" hover:bg-slate-300 cursor-pointer"
              onClick={() => {
                setOnOpen(2);
                setSelected(item);
              }}
            >
              <TableCell>{item.number}</TableCell>
              <TableCell>{item.location.name}</TableCell>
              <TableCell>{item._count.prints}</TableCell>
              <TableCell>{item.regVoters ?? 0}</TableCell>
              <TableCell>{item.result}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal
        className="max-w-xl h-[450px] overflow-auto"
        open={onOpen === 1}
        onOpenChange={() => setOnOpen(0)}
        title="New Machine and Precincts"
        children={
          <NewMachine
            setOnOpen={setOnOpen}
            zipCode={parseInt(currentMunicipal, 10)}
            handleChangeArea={handleChangeArea}
            currentBarangay={currentBarangay}
          />
        }
      />

      <Modal
        className="max-w-3xl max-h- overflow-auto"
        open={onOpen === 2}
        onOpenChange={() => {
          setOnOpen(0);
        }}
        title={`${selected?.location.name} Machine No. ${selected?.number}`}
        children={<EditMachine setOnOpen={setOnOpen} item={selected} />}
      />

      <Modal
        footer={true}
        onFunction={handelRemoveMachine}
        loading={removing}
        className="max-w-md max-h- overflow-auto"
        open={onOpen === 3}
        onOpenChange={() => {
          if (removing) return;
          setSelected(null);
          setOnOpen(0);
        }}
        title={`Remove ${selected?.location.name} Machine No. ${selected?.number}`}
        children={
          <div>
            <p>
              The selected machine will be permanently remove, cannot be undo
              afterwards.
            </p>
          </div>
        }
      />
    </div>
  );
};

export default Machines;
