import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

//grpahql
import { CREATE_NEW_USER } from "../GraphQL/Mutation";
import { useMutation } from "@apollo/client";
//ui
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
  FormDescription,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
//interfaces
import { NewAccountSchema } from "../zod/data";

type NewAccountProps = z.infer<typeof NewAccountSchema>;
const NewAccountForm = () => {
  const form = useForm<NewAccountProps>({
    resolver: zodResolver(NewAccountSchema),
  });

  const [newUser, { loading, error }] = useMutation(CREATE_NEW_USER);
  console.log("Error: ",error);

  const {
    handleSubmit,
    setError,
    register,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = form;
  const showOption = watch("role") === "100";

  useEffect(() => {
    const subscription = watch((value, { name, type }) =>
      console.log(value, name, type)
    );
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = async (data: NewAccountProps) => {
    if (!data) return;
    await newUser({
      variables: {
        user: {
          username: data.username,
          password: data.password,
          role: parseInt(data.role, 10),
          purpose: parseInt(data.purpose as string, 10),
          status: 1,
        },
      },
    });

    if (error) {
      setError("root", { message: error.message });
      return;
    }
    reset({
      username: "",
      password: "",
      role: "",
      purpose: "",
    });
  };
  return (
    <div className="w-full h-auto p-2">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Form {...form}>
          {errors.root && <FormMessage>{errors.root.message}</FormMessage>}
          <FormField
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    defaultValue="2"
                    {...register("role", { required: true })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">One-App Admin</SelectItem>
                      <SelectItem value="2">Portal Admin</SelectItem>
                      <SelectItem value="3">One-App User</SelectItem>
                      <SelectItem value="100">Super Account</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                {errors.username && (
                  <FormMessage>{errors.username.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl {...field}>
                  <Input
                    {...field}
                    {...register("username", { required: true })}
                    placeholder="Type username here"
                  />
                </FormControl>
                {errors.username && (
                  <FormMessage>{errors.username.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl {...field}>
                  <Input
                    {...field}
                    {...register("password", { required: true })}
                    placeholder="Type password here"
                  />
                </FormControl>
                {errors.password && (
                  <FormMessage>{errors.password.message}</FormMessage>
                )}
              </FormItem>
            )}
          />

          <FormField
            name="purpose"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purpose</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    {...register("purpose", { required: true })}
                    placeholder="Type purok number here"
                  />
                </FormControl>
                {errors.purpose && (
                  <FormMessage>{errors.purpose.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
          {showOption && (
            <FormField
              name="adminPassword"
              render={({ field }) => (
                <FormItem className="mt-8">
                  <FormLabel>Admin password</FormLabel>
                  <FormDescription>
                    Admin password is required when creating super account
                  </FormDescription>
                  <FormControl {...field}>
                    <Input
                      type="password"
                      {...field}
                      {...register("adminPassword", { required: true })}
                      placeholder="Type admin password here"
                    />
                  </FormControl>
                  {errors.adminPassword && (
                    <FormMessage>{errors.adminPassword.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
          )}
        </Form>

        <div className="w-full p-2 flex justify-end">
          <Button
            disabled={isSubmitting || loading}
            onClick={handleSubmit(onSubmit)}
          >
            Create
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewAccountForm;
