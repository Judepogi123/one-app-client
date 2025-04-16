import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useMutation as ruseMutation } from "@tanstack/react-query";
import { EDIT_MACHINE } from "../GraphQL/Mutation";
import { GET_ALL_MACHINE } from "../GraphQL/Queries";
//ui
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
//props
import { MachineProps } from "../interface/data";
import { toast } from "sonner";

interface Props {
  item: MachineProps | null;
  setOnOpen: React.Dispatch<React.SetStateAction<number>>;
}

const EditMachine = ({ item, setOnOpen }: Props) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState(item?.result.toString() ?? "0");

  const [editMachine, { loading }] = useMutation(EDIT_MACHINE, {
    refetchQueries: [
      {
        query: GET_ALL_MACHINE,
        variables: {
          zipCode: item?.municipalsId as number,
        },
      },
    ],
  });

  const handleSelectIds = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCheckId = (id: string) => selected.includes(id);

  const handleSave = async (index: number) => {
    if (!item) {
      toast.warning("Machine not found!", {
        closeButton: false,
      });
      return;
    }
    await editMachine({
      variables: {
        id: item.id,
        precincts: selected,
        newPrecints: selected,
        result: parseInt(result, 10) ?? 0,
        precinctMethod: index,
      },
    });
  };

  const { mutateAsync, isPending } = ruseMutation({
    mutationFn: (index: number) => handleSave(index),
    onSuccess: () => {
      setOnOpen(0);
    },
  });
  return (
    <div className="w-full">
      <div>
        <Input
          type="number"
          min={0}
          placeholder="Type the result here"
          value={result}
          onChange={(e) => setResult(e.target.value)}
        />
      </div>
      <Table>
        <TableHeader>
          <TableHead>Selected</TableHead>
          <TableHead>Precinct</TableHead>
        </TableHeader>
        <TableBody>
          {item?.precincts.map((item) => (
            <TableRow
              className=" hover:bg-slate-200 cursor-pointer"
              onClick={() => handleSelectIds(item.id)}
            >
              <TableCell>
                <Checkbox checked={handleCheckId(item.id)} />
              </TableCell>
              <TableCell>{item.precintNumber}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="w-full flex justify-between gap-3 border border-l-0 border-r-0 border-gray-300 p-2">
        <Button variant="destructive" size="sm" onClick={() => setOnOpen(3)}>
          Delete Machine
        </Button>
        <div className="">
          {selected.length > 0 ? (
            <Button variant="destructive" size="sm">
              Delete selected
            </Button>
          ) : null}
          <Button
            disabled={isPending || loading}
            size="sm"
            onClick={() => mutateAsync(0)}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditMachine;
