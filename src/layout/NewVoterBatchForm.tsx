
//lib
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

//ui
import { Form, FormControl, FormField, FormItem } from "../components/ui/form";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
//schema
import { BarangaySchema } from "../zod/data";

//types
// type MunicipalType = z.infer<typeof MunicipalSchema>;
// type BarangayType = z.infer<typeof BarangaySchema>;

const formSchema = z.object({
  municipals: z.string().nonempty("Municipal is required"),
  barangays: z.array(BarangaySchema),
});

type FormType = z.infer<typeof formSchema>;

const NewVoterBatchForm = () => {
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      municipals: "", // Initialize with an empty string
      barangays: [],
    },
  });

  const { handleSubmit } = form;

  const onSubmit = async (value: FormType) => {
    console.log(value.municipals);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormField
          name="municipals"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Municipal" />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default NewVoterBatchForm;
