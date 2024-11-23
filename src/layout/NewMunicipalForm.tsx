
//lib
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client";
//ui
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
//mutation
import { CREATE_MUNICIPAL } from "../GraphQL/Mutation";
import { GET_MUNICIPALS } from "../GraphQL/Queries";

const formSchema = z.object({
  municipalName: z
    .string()
    .min(3, "The municipal name must have at least 3 characters."),
  municipalCode: z.string(),
});

type FormType = z.infer<typeof formSchema>;

const NewMunicipalForm = () => {
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = form;

  const [createMunicipal] = useMutation(CREATE_MUNICIPAL, {
    refetchQueries: [{ query: GET_MUNICIPALS }],
  });

  const onSubmit = async (value: FormType) => {
    try {
      const { data } = await createMunicipal({
        variables: {
          municipal: {
            name: value.municipalName,
            id: parseInt(value.municipalCode, 10),
          },
        },
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full h-auto">
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full h-auto flex flex-col gap-2"
        >
          <FormField
            name="municipalName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="Name" />
                </FormControl>
                <div className=" w-full h-6">
                  {errors.municipalName && (
                    <FormMessage>{errors.municipalName.message}</FormMessage>
                  )}
                </div>
              </FormItem>
            )}
          />

          <FormField
            name="municipalCode"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Code"
                    {...(register("municipalCode"),
                    { require: "This field is required!" })}
                  />
                </FormControl>
                <div className=" w-full h-6">
                  {errors.municipalCode && (
                    <FormMessage>{errors.municipalCode.message}</FormMessage>
                  )}
                </div>
              </FormItem>
            )}
          />
          <Button type="submit">Save</Button>
        </form>
      </Form>
    </div>
  );
};

export default NewMunicipalForm;
