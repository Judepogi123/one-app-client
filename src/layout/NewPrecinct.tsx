import React from "react";
//
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client";
//
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
//
import { Form, FormControl, FormField, FormItem } from "../components/ui/form";
import { MachineProps } from "../interface/data";
import { NEW_MACHINE_PRECINCT } from "../GraphQL/Mutation";
import { GET_ALL_MACHINE } from "../GraphQL/Queries";
import { toast } from "sonner";

//
const NewPrecinctSchema = z.object({
  precinctNo: z
    .string()
    .min(4, "Precinct number must be at least 4 characters"),
});
type NewPrecinctType = z.infer<typeof NewPrecinctSchema>;
interface Props {
  item: MachineProps | null;
  setOnOpen: React.Dispatch<React.SetStateAction<number>>;
  zipCode: number;
}
//

const NewPrecinct = ({ item, setOnOpen, zipCode }: Props) => {
  console.log({ item, setOnOpen, zipCode });

  const form = useForm<NewPrecinctType>({
    resolver: zodResolver(NewPrecinctSchema),
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const [newMachinePrecinct, { loading }] = useMutation(NEW_MACHINE_PRECINCT, {
    onCompleted: () => {
      setOnOpen(0);
      toast.success("Added new Precinct successfully!", {
        closeButton: false,
      });
    },
    onError: (errr) => {
      console.log(errr);

      toast.error("Failed to add.", {
        closeButton: false,
      });
    },
    refetchQueries: [
      {
        query: GET_ALL_MACHINE,
        variables: {
          zipCode,
        },
      },
    ],
  });

  const onSubmit = async (data: NewPrecinctType) => {
    console.log("Clicked 1");

    if (!item) {
      toast.warning("Machine data not found!");
      return;
    }
    console.log("Clicked 2");

    await newMachinePrecinct({
      variables: {
        machineId: item.id,
        precinctNo: data.precinctNo,
      },
    });
  };
  return (
    <div className="w-full">
      <Form {...form}>
        <FormField
          name="precinctNo"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Precinct no." {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className=" w-full flex justify-end gap-2 mt-4">
          <Button
            disabled={isSubmitting || loading}
            onClick={() => setOnOpen(0)}
            variant="secondary"
          >
            Cancel
          </Button>
          <Button
            disabled={isSubmitting || loading}
            onClick={handleSubmit(onSubmit)}
          >
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default NewPrecinct;
