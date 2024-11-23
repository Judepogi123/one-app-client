import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
//ui
import {
  Form,
  FormField,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import MunicipalSel from "../components/custom/MunicipalSel";
import { Button } from "../components/ui/button";
import SearchVoters from "./SearchVoters";
import Modal from "../components/custom/Modal";
//interfaces
import { VoterSchema } from "../zod/data";
import { VotersProps } from "../interface/data";
//icons
import { CiSearch } from "react-icons/ci";
import { handleLevel } from "../utils/helper";

type VoterType = z.infer<typeof VoterSchema>;

const UpdateVoterForm = () => {
  const [onOpenModal, setOnOpenModal] = useState(0);
  const [selectedVoter, setSelectedVoter] = useState<VotersProps | undefined>(
    undefined
  );
  const form = useForm<VoterType>({ resolver: zodResolver(VoterSchema) });
  const {
    handleSubmit,
    register,
    setError,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    if (selectedVoter) {
      setOnOpenModal(0);
    }
  }, [selectedVoter]);

  const onSubmit = async (value: VoterType) => {
    try {
      console.log(value);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-auto">
      {!selectedVoter && (
        <div
          onClick={() => setOnOpenModal(1)}
          className="w-full cursor-text p-2 border border-gray-500 rounded hover:border-gray-700 flex gap-2 items-center"
        >
          <CiSearch className="text-lg font-medium" fontWeight={600} />
          <h1 className="text-slate-600 font-medium text-sm ">Search voter</h1>
        </div>
      )}

      {selectedVoter && (
        <>
          <div className="w-full flex gap-2 items-center p-2">
            <h1 className="font-medium">Selected: </h1>
            <h1 className="text-lg">
              {selectedVoter.lastname}, {selectedVoter.firstname}
            </h1>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Form {...form}>
              <FormField
                name="lastname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lastname</FormLabel>
                    <FormControl defaultValue={selectedVoter.lastname}>
                      <Input
                        defaultValue={selectedVoter.lastname}
                        {...field}
                        {...register("lastname")}
                        placeholder="Lastname"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="firstname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Firstname</FormLabel>
                    <FormControl defaultValue={selectedVoter.firstname}>
                      <Input
                        defaultValue={selectedVoter.firstname}
                        {...field}
                        {...register("firstname")}
                        placeholder="Firstname"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="municipalsId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <MunicipalSel
                        {...register("municipalsId")}
                        onChange={field.onChange}
                        defaultValue={selectedVoter.municipal.id?.toString()}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl defaultValue={selectedVoter.firstname}>
                      <RadioGroup
                        {...field}
                        {...register("status")}
                        defaultValue={selectedVoter.status?.toString()}
                        className="flex gap-2"
                      >
                        <FormItem className="w-auto border flex gap-2">
                          <FormControl>
                            <RadioGroupItem value="0" />
                          </FormControl>
                          <Label>Dead</Label>
                        </FormItem>

                        <FormItem>
                          <FormControl>
                            <RadioGroupItem value="1" />
                          </FormControl>
                          <FormLabel>Active</FormLabel>
                        </FormItem>

                        <FormItem>
                          <FormControl>
                            <RadioGroupItem value="2" />
                          </FormControl>
                          <FormLabel>Unactive</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="pwd"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>People With Disablities (PWD)</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        {...register("pwd")}
                        defaultValue={selectedVoter.pwd as string}
                      >
                        <SelectTrigger className="w-auto">
                          <SelectValue
                            defaultValue={selectedVoter.pwd as string}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="YES">YES</SelectItem>
                          <SelectItem value="NO">NO</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="inc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inglesia ni Cristo(INC)</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        {...register("inc")}
                        defaultValue={selectedVoter.inc as string}
                      >
                        <SelectTrigger className="w-auto">
                          <SelectValue
                            defaultValue={selectedVoter.inc as string}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="YES">YES</SelectItem>
                          <SelectItem value="NO">NO</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="oor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Out of Residence (OR)</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        {...register("oor")}
                        defaultValue={selectedVoter.oor as string}
                      >
                        <SelectTrigger className="w-auto">
                          <SelectValue
                            defaultValue={selectedVoter.oor as string}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="YES">YES</SelectItem>
                          <SelectItem value="NO">NO</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="illi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IllIterate</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        {...register("illi")}
                        defaultValue={selectedVoter.illi as string}
                      >
                        <SelectTrigger className="w-auto">
                          <SelectValue
                            defaultValue={selectedVoter.illi as string}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="YES">YES</SelectItem>
                          <SelectItem value="NO">NO</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="level"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormLabel>Level</FormLabel>
                    <h1 className="hover:underline cursor-pointer">
                      {handleLevel(selectedVoter.level)}
                    </h1>
                  </FormItem>
                )}
              />
            </Form>

            <div className="w-full flex justify-end">
              <Button disabled={isSubmitting} type="submit" size="sm">
                {isSubmitting ? "Please wait..." : "Save"}
              </Button>
            </div>
          </form>
        </>
      )}

      <Modal
        className="max-w-4xl"
        open={onOpenModal === 1}
        onOpenChange={() => setOnOpenModal(0)}
      >
        <SearchVoters setSelectedVoter={setSelectedVoter} />
      </Modal>
    </div>
  );
};

export default UpdateVoterForm;
