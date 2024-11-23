//import React from "react";

//lib
import {useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import useSignIn from "react-auth-kit/hooks/useSignIn";
//ui
import { Input } from "../components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Button } from "../components/ui/button";
import Alert from "../components/custom/Alert";
//shcema
import { UserSchema, AuthUser } from "../zod/data";

//mutation
import { LOGIN_ADMIN } from "../GraphQL/Mutation";

type UserType = z.infer<typeof UserSchema>;
type AuthType = z.infer<typeof AuthUser>;

const AuthPage = () => {
  const navigate = useNavigate();
  const signIn = useSignIn();
  const form = useForm<UserType>({ resolver: zodResolver(UserSchema) });
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
  } = form;

  const [adminLogin, { error }] = useMutation<{ adminLogin: AuthType }>(
    LOGIN_ADMIN
  );


  const onSubmit = async (value: UserType) => {
    try {
      const { data } = await adminLogin({
        variables: {
          user: {
            phoneNumber: value.phoneNumber,
            password: value.password,
          },
        },
      })

      if(!data){
        setError("root", {message: "Incorrect number or password"})
        return
      }

      if (signIn({
          auth: {
            token: data.adminLogin.accessToken,
            type: "Bearer",
          },
          userState: {
            firstname: data.adminLogin.firstname,
            lastname: data.adminLogin.lastname,
            uid: data.adminLogin.uid,
          },
        })
      ) {
        navigate("/");
      } else {
        navigate("/auth");
      }
    } catch (error) {
      setError("root", {message: "Sorry something went wrong."})
    }
  };
  return (
    <div className=" w-full h-screen grid">
      <div className="w-full h-full lg:w-1/3 lg:h-[70%] m-auto border border-gray-500 rounded">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full h-full relative"
        >
          <div className="w-full h-16 px-4 flex items-center">
            {error && (
              <Alert variant="destructive" title="An Error occured" desc={error.message} />
            )}
          </div>
          <div className="w-full h-auto px-3 mt-8">
            <Form {...form}>
              <FormField
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Your phone number"
                        {...register("phoneNumber", { required: true })}
                      />
                    </FormControl>
                    <div className="w-full h-4">
                      {errors.phoneNumber && (
                        <FormMessage>{errors.phoneNumber.message}</FormMessage>
                      )}
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        placeholder="Your password here"
                      />
                    </FormControl>
                    <div className="w-full h-4">
                      {errors.password && (
                        <FormMessage>{errors.password.message}</FormMessage>
                      )}
                    </div>
                  </FormItem>
                )}
              />
            </Form>
          </div>

          <div className="w-full p-2 py-6 absolute bottom-0">
            <Button
              disabled={isSubmitting}
              className="w-full rounded-full"
              type="submit"
            >
              {isSubmitting ? "Please wait..." : "Continue"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
