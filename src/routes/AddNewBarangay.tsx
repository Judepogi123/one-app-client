import React from "react";

//lib
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { useMutation } from "@apollo/client";
//props

//mutation
import { CREATE_BARANGAY } from "../GraphQL/Mutation";
import { GET_BARANGAYS } from "../GraphQL/Queries";
//ui
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
//interface
import { BarangaySchema } from "../zod/data";

//props
interface AddNewUserProps {
  setOnAdd: React.Dispatch<React.SetStateAction<boolean>>;
}

const barangaySchema = z.object({
  name: z.string().min(3, "At least 3 characters!"),
});

type BarangayType = z.infer<typeof barangaySchema>;

const AddNewBarangay = ({ setOnAdd }: AddNewUserProps) => {
  const form = useForm<BarangayType>({
    resolver: zodResolver(barangaySchema),
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    resetField,
  } = form;

  const { municipalID } = useParams();

  const [createBarangay] = useMutation(CREATE_BARANGAY, {
    refetchQueries: [
      {
        query: GET_BARANGAYS,
        variables: { municipalId: parseInt(municipalID as string, 10) },
      },
    ],
  });

  const onsubmit = async (value: BarangayType) => {
    try {
      const { data, errors } = await createBarangay({
        variables: {
          barangay: {
            municipalId: parseInt(municipalID as string, 10),
            name: value.name,
          },
        },
      });

      if (errors) {
        toast(errors.map((e) => e.message).join(", "));
      } else {
        resetField("name");
        setOnAdd(false);
        toast("Barangay created successfully!");
      }
    } catch (error) {
      toast(`Something went wrong: ${error}`, {
        closeButton: true,
        description: "Try to refresh the page.",
      });
    }
  };

  return (
    <div className="w-full h-full">
      <Form {...form}>
        <form
          className="w-full h-full flex flex-col gap-2"
          onSubmit={handleSubmit(onsubmit)}
        >
          <FormField
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ""}
                    placeholder="Barangay's name"
                    {...register("name", {
                      required: "Barangay's name is required!",
                    })}
                  />
                </FormControl>
                <div className="w-full h-6">
                  {errors.name && (
                    <FormMessage>{errors.name.message}</FormMessage>
                  )}
                </div>
              </FormItem>
            )}
          />
          <div className="w-full flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddNewBarangay;
