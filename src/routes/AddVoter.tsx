import { useEffect } from "react";
//hoooks
import { useForm } from "react-hook-form";
//import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
//ui
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
// import { Checkbox } from "../components/ui/checkbox";
// import AreaSelection from "../components/custom/AreaSelection";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,

} from "../components/ui/form";
import {
  Select,
  SelectItem,

  SelectTrigger,
  SelectValue,
  SelectContent,
} from "../components/ui/select";
import Candidates from "../components/custom/Candidates";

//graphql
import {
  GET_MUNICIPALS,
  GET_BARANGAYS,
  GET_PUROKLIST,
} from "../GraphQL/Queries";
import { useQuery } from "@apollo/client";
import { BarangayProps, MunicipalProps, PurokProps } from "../interface/data";

//zod
import { NewVoterSchema } from "../zod/data";

//props
type VoterSchema = z.infer<typeof NewVoterSchema>;
const AddVoter = () => {
  // const [params, setParams] = useSearchParams({
  //   zipCode: "all",
  //   barangay: "all",
  //   purok: "all",
  //   level: "all",
  //   page: "1",
  //   others: "0",
  //   query: "",
  //   withIssues: "false",
  // });
  const form = useForm<VoterSchema>({ resolver: zodResolver(NewVoterSchema) });
  // const currentMunicipal = params.get("zipCode") || "all";
  // const currentBarangay = params.get("barangay") || "all";
  const { watch, register } = form;

  const theMunicipal = watch("municipalsId", 0);
  const theBarangay = watch("barangaysId");
  useEffect(() => {
    const subscription = watch((value, { name, type }) =>
      console.log(value, name, type)
    );
    return () => subscription.unsubscribe();
  }, [theMunicipal]);

  console.log(theMunicipal);

  // const handleChangeOption = (params: string, value: string) => {
  //   setParams(
  //     (prev) => {
  //       prev.set(params, value);
  //       return prev;
  //     },
  //     {
  //       replace: true,
  //     }
  //   );
  // };

  const { data, loading } = useQuery<{ municipals: MunicipalProps[] }>(
    GET_MUNICIPALS
  );

  const { data: barangays, loading: barangaysLoading } = useQuery<{
    barangayList: BarangayProps[];
  }>(GET_BARANGAYS, {
    skip: !theMunicipal,
    variables: {
      zipCode: parseInt(theMunicipal.toString(), 10),
    },
  });

  const { data: puroks } = useQuery<{
    puroks: PurokProps[];
  }>(GET_PUROKLIST, {
    skip: !theBarangay,
    variables: {
      id: theBarangay,
    },
  });
  console.log(puroks);

  return (
    <div className="w-full h-full">
      <form className="w-full h-full md:w-1/2 p-4">
        <Form {...form}>
          <FormLabel className="mt-4">Basic Information</FormLabel>
          <FormField
            name="idNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID Number</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Voter's ID number"
                    {...register("idNumber")}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Voter's first name"
                    {...register("firstname")}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            name="lastname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Voter's last name"
                    {...register("lastname")}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Level</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Voter's last name"
                    {...register("level")}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="municipalsId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Municipal</FormLabel>
                <FormControl>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    {...register("municipalsId")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Municipal" />
                      <SelectContent>
                        {data &&
                          data.municipals.map((item) => (
                            <SelectItem value={item.id.toString()}>
                              {item.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </SelectTrigger>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="barangaysId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Barangay</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={barangaysLoading}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder="Select barangay"
                        {...register("barangaysId")}
                      />
                      <SelectContent>
                        {barangays &&
                          barangays.barangayList.map((item) => (
                            <SelectItem value={item.id.toString()}>
                              {item.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </SelectTrigger>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="purokName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purok</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Voter's current purok (ex. 'Purok Uno/1')"
                    {...register("purokName")}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            name="purokName"
            render={() => (
              <FormItem>
                <FormLabel>Purok</FormLabel>
                <FormControl>
                  <Candidates select={true} label="Candidate: " className="mb-8" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormLabel className="mt-4">Capabilities and Others</FormLabel>

          <div className="w-2/3 h-auto grid grid-cols-2 gap-2 mt-2 p-2">
            <FormField
              name="pwd"
              render={({ field }) => (
                <FormItem className="flex items-center gap-4 ">
                  <FormLabel>PWD</FormLabel>
                  <FormControl>
                    <RadioGroup
                      defaultValue={"no"}
                      onValueChange={field.onChange}
                      className="flex items-center gap-2"
                    >
                      <div className="flex gap-1 items-center">
                        <RadioGroupItem value="yes">YES</RadioGroupItem>
                        <Label>YES</Label>
                      </div>
                      <div className="flex gap-1 items-center">
                        <RadioGroupItem value="no">Yes</RadioGroupItem>
                        <Label>NO</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="illi"
              render={({ field }) => (
                <FormItem className="flex items-center gap-4">
                  <FormLabel>ILLI</FormLabel>
                  <FormControl>
                    <RadioGroup
                      defaultValue={"no"}
                      onValueChange={field.onChange}
                      className="flex items-center gap-2"
                    >
                      <div className="flex gap-1 items-center">
                        <RadioGroupItem value="yes">YES</RadioGroupItem>
                        <Label>YES</Label>
                      </div>
                      <div className="flex gap-1 items-center">
                        <RadioGroupItem value="no">Yes</RadioGroupItem>
                        <Label>NO</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="inc"
              render={({ field }) => (
                <FormItem className="flex items-center gap-4">
                  <FormLabel>INC</FormLabel>
                  <FormControl>
                    <RadioGroup
                      defaultValue={"no"}
                      onValueChange={field.onChange}
                      className="flex items-center gap-2"
                    >
                      <div className="flex gap-1 items-center">
                        <RadioGroupItem value="yes">YES</RadioGroupItem>
                        <Label>YES</Label>
                      </div>
                      <div className="flex gap-1 items-center">
                        <RadioGroupItem value="no">Yes</RadioGroupItem>
                        <Label>NO</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="youth"
              render={({ field }) => (
                <FormItem className="flex items-center gap-4">
                  <FormLabel>Youth</FormLabel>
                  <FormControl>
                    <RadioGroup
                      defaultValue={"no"}
                      onValueChange={field.onChange}
                      className="flex items-center gap-2"
                    >
                      <div className="flex gap-1 items-center">
                        <RadioGroupItem value="yes">YES</RadioGroupItem>
                        <Label>YES</Label>
                      </div>
                      <div className="flex gap-1 items-center">
                        <RadioGroupItem value="no">Yes</RadioGroupItem>
                        <Label>NO</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="senior"
              render={({ field }) => (
                <FormItem className="flex items-center gap-4">
                  <FormLabel>Senior</FormLabel>
                  <FormControl>
                    <RadioGroup
                      defaultValue={"no"}
                      onValueChange={field.onChange}
                      className="flex items-center gap-2"
                    >
                      <div className="flex gap-1 items-center">
                        <RadioGroupItem value="yes">YES</RadioGroupItem>
                        <Label>YES</Label>
                      </div>
                      <div className="flex gap-1 items-center">
                        <RadioGroupItem value="no">Yes</RadioGroupItem>
                        <Label>NO</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </Form>
      </form>
      <div className="w-full p-2 flex justify-end gap-2">
        <Button variant="outline" className="hover:border-gray-300">
          Clear all fields
        </Button>
        <Button>Save</Button>
      </div>
    </div>
  );
};

export default AddVoter;
