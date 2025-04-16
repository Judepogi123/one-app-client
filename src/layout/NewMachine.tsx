import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { NEW_MACHINE } from "../GraphQL/Mutation";
import { useForm } from "react-hook-form";
import { NewMachineSchema } from "../zod/data";
import type { z } from "zod";
import BarangaySel from "../components/custom/BarangaySel";
import { toast } from "sonner";
import { GET_ALL_MACHINE } from "../GraphQL/Queries";

type NewMachineType = z.infer<typeof NewMachineSchema>;

interface Props {
  zipCode: number;
  handleChangeArea: (value: string, key: string) => void;
  currentBarangay: string;
  setOnOpen: React.Dispatch<React.SetStateAction<number>>;
}

const NewMachine = ({
  zipCode,
  handleChangeArea,
  currentBarangay,
  setOnOpen,
}: Props) => {
  const [precintCount, setPrecintCounts] = useState<number[]>([1, 2]);

  const form = useForm<NewMachineType>({
    resolver: zodResolver(NewMachineSchema),
    defaultValues: {
      machineNo: "",
      precints: {},
    },
  });
  const { setValue } = form;

  const [newMachine, { loading }] = useMutation(NEW_MACHINE, {
    refetchQueries: [
      {
        query: GET_ALL_MACHINE,
        variables: {
          zipCode,
        },
      },
    ],
  });
  const onSubmit = async (data: NewMachineType) => {
    if (currentBarangay === "none") {
      toast.warning("Select a location for machine", {
        closeButton: false,
      });
      return;
    }
    // Convert precints object to array
    const precinctsArray = data.precints
      ? Object.values(data.precints).filter((p): p is string => Boolean(p))
      : [];
    console.log({ data, precinctsArray });

    if (precinctsArray.length === 0) {
      console.error("At least one precinct is required");
      return;
    }

    try {
      const response = await newMachine({
        variables: {
          zipCode: zipCode,
          machineNo: parseInt(data.machineNo, 10),
          precints: precinctsArray,
          barangaysId: data.locationId,
        },
      });
      setOnOpen(0);
      console.log("Submission successful:", response);
    } catch (error) {
      toast.error("Failed to add new Machine", {
        closeButton: false,
        description: `${error}`,
      });
      console.error("Submission failed:", error);
    }
  };

  useEffect(() => {
    if (currentBarangay !== "none") {
      setValue("locationId", currentBarangay);
    }
  }, [currentBarangay]);

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <BarangaySel
            value={currentBarangay}
            zipCode={zipCode.toString()}
            handleChangeArea={handleChangeArea}
          />

          <FormField
            control={form.control}
            name="machineNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Machine No.</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Type machine No. here"
                    {...field}
                    type="number"
                    min={0}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormDescription>
            Type all the precincts here, correct and precisely.
          </FormDescription>
          {precintCount.map((item) => (
            <FormField
              key={item}
              control={form.control}
              name={`precints.precint${item}`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder={`Precint ${item}`} />
                  </FormControl>
                </FormItem>
              )}
            />
          ))}

          <div className="flex gap-2">
            <Button
              disabled={loading}
              variant="outline"
              type="button"
              onClick={() => {
                setPrecintCounts([...precintCount, precintCount.length + 1]);
              }}
            >
              Add Precinct Slot
            </Button>

            <Button type="submit" disabled={loading}>
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewMachine;
