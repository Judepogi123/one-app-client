import { useState, useEffect } from "react";

//schema
import {
  BarangaySchema,
  MunicipalSchema,
  NewVoterBatchSchema,
} from "../zod/data";

//lib
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
//ui
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "../components/ui/form";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import Alert from "../components/custom/Alert";
//mutation
import { GET_MUNICIPALS, GET_BARANGAYS } from "../GraphQL/Queries";
import { CREAT_NEWVOTERBATCH } from "../GraphQL/Mutation";

const formSchema = z.object({
  municipal: z.string(),
  barangay: z.string(),
});

type FormType = z.infer<typeof formSchema>;
type MunicipalType = z.infer<typeof MunicipalSchema>;
type BarangayType = z.infer<typeof BarangaySchema>;
type BatchType = z.infer<typeof NewVoterBatchSchema>;

const NewBatchVoter = () => {
  const [selectedMunicipal, setSelectedMunicipal] = useState<string>("");
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = form;

  const navigate = useNavigate();

  const [createNewBatchDraft] = useMutation<{ createNewBatchDraft: BatchType }>(
    CREAT_NEWVOTERBATCH
  );

  const onSubmit = async (value: FormType) => {
    try {
      const { data } = await createNewBatchDraft({
        variables: {
          barangay: {
            municipalId: parseInt(value.municipal as string, 10),
            barangayId: value.barangay,
          },
        },
      });
      if (data) {
        navigate(`/manage/draft/${data.createNewBatchDraft.id}`);
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const {
    data: munData,
    loading: munLoading,
    error: munError,
  } = useQuery<{ municipals: MunicipalType[] }>(GET_MUNICIPALS);

  const {
    data: bardata,
    loading: barLoading,
    error: barError,
    refetch: refetchBarangays,
  } = useQuery<{ barangayList: BarangayType[] }>(GET_BARANGAYS, {
    variables: {
      zipCode: parseInt(selectedMunicipal as string, 10),
    },
    skip: !selectedMunicipal,
  });
  
  useEffect(() => {
    if (selectedMunicipal) {
      refetchBarangays({
        zipCode: parseInt(selectedMunicipal as string, 10),
      });
    }
  }, [selectedMunicipal]);

  if(munError){
    return (
      <div className="w-full">
        <Alert title={`${munError.message}`} variant="destructive"/>
      </div>
    )
  }

  if(barError){
    return (
      <div className="w-full">
        <Alert title={`${barError.message}`} variant="destructive"/>
      </div>
    )
  }

  return (
    <div className="w-full h-auto">
      <div className="w-full p-2">
        <h1 className="font-semibold text-xl">Draft new list</h1>
      </div>
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full h-auto flex flex-col gap-2"
        >
          <div className="w-full lg:w-1/3 p-2 lg:mt-12 lg:ml-8">
            <FormField
              name="municipal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Municipal</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedMunicipal(value);
                      }}
                      defaultValue={field.value}
                      disabled={munLoading}
                      {...register("municipal", {
                        required: "Please select municipal!",
                      })}
                    >
                      <SelectTrigger className="w-full border border-gray-400">
                        <SelectValue
                          placeholder={munLoading ? "Loading..." : "Select"}
                        />
                      </SelectTrigger>
                      {munData ? (
                        <SelectContent>
                          {munData.municipals.map((item) => (
                            <SelectItem value={item.id.toString()}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      ) : (
                        <FormMessage>NO municipal found!</FormMessage>
                      )}
                    </Select>
                  </FormControl>
                  <div className=" w-full h-6">
                    {errors.municipal && (
                      <FormMessage>{errors.municipal.message}</FormMessage>
                    )}
                  </div>
                </FormItem>
              )}
            />

            <FormField
              name="barangay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Barangay</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={barLoading}
                      {...register("barangay", {
                        required: "Please select barangay!",
                      })}
                    >
                      <SelectTrigger className="w-full border border-gray-400 max-h-60">
                        <SelectValue
                          placeholder={barLoading ? "Loading..." : "Select"}
                        />
                      </SelectTrigger>
                      {bardata ? (
                        <SelectContent className=" max-h-60">
                          {bardata.barangayList.map((item) => (
                            <SelectItem value={item.id.toString()}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      ) : (
                        <FormMessage>NO barangay found!</FormMessage>
                      )}
                    </Select>
                  </FormControl>
                  <div className=" w-full h-6">
                    {errors.barangay && (
                      <FormMessage>{errors.barangay.message}</FormMessage>
                    )}
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className=" w-full p-2 lg:p-4 flex justify-end absolute bottom-0">
            <Button type="submit">{isSubmitting ? "Please wait..." : "Continue"}</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewBatchVoter;
