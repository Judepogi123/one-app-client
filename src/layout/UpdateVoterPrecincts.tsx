import { useSearchParams } from "react-router-dom";
import { useUserData } from "../provider/UserDataProvider";
import { UpdateVoterPrecincts } from "../zod/data";
import axios from "../api/axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import AreaSelection from "../components/custom/AreaSelection";
import { useEffect } from "react";

type UpdateVoterPrecinctType = z.infer<typeof UpdateVoterPrecincts>;

const UpdateVoterPrecinct = () => {
  const user = useUserData();
  const [params, setParams] = useSearchParams({
    barangay: "none",
    zipCode: user.forMunicipal ? user.forMunicipal.toString() : "4905",
  });
  const form = useForm<UpdateVoterPrecinctType>({
    resolver: zodResolver(UpdateVoterPrecincts),
    defaultValues: {
      barangay: "",
    },
  });

  const {
    setValue,
    formState: { isSubmitting },
  } = form;

  const currentMunicipal = params.get("zipCode") || "4905";
  const currentBarangay = params.get("barangay") || "none";
  const handleChangeArea = (param: string, value: string) => {
    setParams(
      (prev) => {
        prev.set(param, value);
        return prev;
      },
      {
        replace: true,
      }
    );
  };

  useEffect(() => {
    setValue("barangay", currentBarangay);
  }, [currentBarangay]);

  const onSubmit = async (data: UpdateVoterPrecinctType) => {
    console.log("Form data:", data);

    try {
      const formData = new FormData();
      formData.append("file", data.file);
      formData.append("barangayId", data.barangay as string);
      await axios.post("upload/update-voter-precincts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full max-w-md p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* File Input */}
          <FormField
            control={form.control}
            name="file"
            render={({ field: { onChange, value, ...rest } }) => (
              <FormItem>
                <FormLabel>Excel File</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    {...rest}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      onChange(file);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Barangay Input */}
          <FormField
            control={form.control}
            name="barangay"
            render={() => (
              <FormItem>
                <FormLabel>Area</FormLabel>
                <FormControl>
                  <AreaSelection
                    handleChangeOption={handleChangeArea}
                    currentMunicipal={currentMunicipal}
                    currentBarangay={currentBarangay}
                    currentPurok={""}
                    defaultValue={""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting}>
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default UpdateVoterPrecinct;
