//lib
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserData } from "../provider/UserDataProvider";
//database
import { CREATE_NEW_BATCH } from "../GraphQL/Mutation";
import { GET_ALL_COLL } from "../GraphQL/Queries";
//hooks
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
//ui
import { Button } from "../components/ui/button";
//import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Input } from "../components/ui/input";
import {
  Form,
  FormControl,
  //FormDescription,
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

//props
import { NewCollBatchSchema } from "../zod/data";
import { toast } from "sonner";

type NewBatchCollType = z.infer<typeof NewCollBatchSchema>;

const NewCollBatchForm = () => {
  const form = useForm<NewBatchCollType>({
    resolver: zodResolver(NewCollBatchSchema),
    defaultValues: {
      title: "",
      stab: "1",
    },
  });
  const { handleSubmit } = form;
  const user = useUserData();

  const [createNewBatch, { loading }] = useMutation(CREATE_NEW_BATCH, {
    onCompleted: () => {
      toast.success("Success!", {
        closeButton: false,
      });
    },
    onError: () => {
      toast.error("Failed to creat!", {
        closeButton: false,
      });
    },
    refetchQueries: [
      {
        query: GET_ALL_COLL,
        variables: { zipCode: user.forMunicipal ?? 4905 },
      },
    ],
  });

  const onSubmit = async (data: NewBatchCollType) => {
    await createNewBatch({
      variables: {
        title: data.title,
        zipCode: user.forMunicipal ?? 4905,
        stab: data.stab,
      },
    });
  };
  return (
    <div className="w-full">
      <Form {...form}>
        <FormField
          name="title"
          render={({ field: { onBlur, onChange, value } }) => (
            <FormItem>
              <FormLabel>Title (Optional)</FormLabel>
              <FormControl>
                <Input value={value} onChange={onChange} onBlur={onBlur} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          name="stab"
          render={({ field: { onChange, value } }) => (
            <FormItem>
              <FormLabel>Stab Number</FormLabel>
              <FormControl>
                <Select onValueChange={onChange} value={value} defaultValue="1">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Stab number" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        <div className="w-full p-2 flex justify-end">
          <Button onClick={handleSubmit(onSubmit)} disabled={loading}>
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default NewCollBatchForm;
