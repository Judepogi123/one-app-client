import React from "react";

//lib
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams,useNavigate } from "react-router-dom";
import z from "zod";

//ui
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
//props

//interface
import { VoterSchema } from "../zod/data";

type VoterType = z.infer<typeof VoterSchema>;

const NewVoterForm = () => {
  const form = useForm<VoterType>({
    resolver: zodResolver(VoterSchema),
  });
  const { handleSubmit } = form;
  const navigate = useNavigate()

  const { municipalID } = useParams();

  const onSubmit = (value: VoterType) => {};
  return (
    <div className=" w-full h-auto px-8">
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full lg:w-1/2 h-full flex flex-col gap-2"
        >
          <FormField
            name="lastname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lastname</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Voter's lastname" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Firstname</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Voter's firstname" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="purok"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purok</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Voter's purok" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            name="precint"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precint</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Voter's precint" />
                </FormControl>
              </FormItem>
            )}
          />

          <div className=" flex gap-2 p-4 absolute bottom-0 right-0 border">
            <Button variant="ghost" onClick={()=> history.back()}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewVoterForm;
