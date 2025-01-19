//ui
import {
  Form,
  FormControl,
  FormItem,
  FormField,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
//lib
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client";
import z from "zod";

//mutation
import { CREATE_QUERY } from "../GraphQL/Mutation";
import { GET_SELECTED_DRAFT_SURVEY } from "../GraphQL/Queries";
//provider
//import { useUserData } from "../provider/UserDataProvider";
import { toast } from "sonner";

//props
const formSchema = z.object({
  queries: z.string().min(3, "Must have at least 3 characters"),
  type: z.string(),
  onTop: z.boolean(),
  style: z
    .number()
    .min(1, { message: "Minimum value is 1" })
    .max(2, { message: "Maximum value is 2" }),
  withCustomOption: z.boolean(),
});

type FormType = z.infer<typeof formSchema>;

//props
interface NewQueryFormProps {
  surveyId: string;
}

const NewQueryForm = ({ surveyId }: NewQueryFormProps) => {
  const form = useForm<FormType>({ resolver: zodResolver(formSchema) });
  const {
    handleSubmit,
    register,
    resetField,
    formState: { errors, isSubmitting },
  } = form;

  const [createQuery] = useMutation(CREATE_QUERY, {
    refetchQueries: [GET_SELECTED_DRAFT_SURVEY],
    variables: { id: surveyId },
  });

  const onSubmit = async (value: FormType) => {
    try {
      const response = await createQuery({
        variables: {
          query: {
            surveyId: surveyId,
            queries: value.queries,
            type: value.type,
            onTop: value.onTop,
            style: value.style,
            withCustomOption: value.withCustomOption,
          },
        },
      });
      if (response.data) {
        resetField("queries");
        toast("New query created successfully.", {
          closeButton: false,
        });
        return;
      }
      toast("Failed to create new query");
    } catch (error) {
      toast("Something went wrong");
    }
  };
  return (
    <div className="w-full h-auto">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField
            name="queries"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Query</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Type query here" />
                </FormControl>
                {errors.queries && (
                  <FormMessage>{errors.queries.message}</FormMessage>
                )}
              </FormItem>
            )}
          />

          <FormField
            name="onTop"
            render={({ field }) => (
              <FormItem className="mt-3 flex gap-2 items-center">
                <FormControl defaultChecked={true}>
                  <Checkbox
                    defaultChecked={true}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>On Top</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            name="withCustomOption"
            render={({ field }) => (
              <FormItem className="mt-3 flex gap-2 items-center">
                <FormControl defaultChecked={true}>
                  <Checkbox
                    defaultChecked={true}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>With Customizable Option</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            name="type"
            render={({ field }) => (
              <FormItem className=" mt-4">
                <FormLabel>Type</FormLabel>
                <FormControl defaultValue={"Single"}>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    defaultValue="Single"
                    {...register("type", { required: true })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Multiple">Multiple</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                {errors.type && (
                  <FormMessage>{errors.type.message}</FormMessage>
                )}
              </FormItem>
            )}
          />

          <FormField
            name="style"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Style</FormLabel>
                <FormControl>
                  <Input
                    defaultValue={1}
                    {...field}
                    type="number"
                    placeholder="Enter style number"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                {errors.style && (
                  <FormMessage>{errors.style.message}</FormMessage>
                )}
              </FormItem>
            )}
          />

          <div className="w-full pt-4">
            <Button type="submit" className=" rounded-full w-full">
              {isSubmitting ? "Please wait" : "Add"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewQueryForm;
