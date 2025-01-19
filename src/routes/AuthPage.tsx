import { useState } from "react";

//lib
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { ServerError, useMutation } from "@apollo/client";
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
//import Alert from "../components/custom/Alert";
//shcema
import { UserSchema, AuthUser } from "../zod/data";

//mutation
import { LOGIN_ADMIN } from "../GraphQL/Mutation";

//layout
import Modal from "../components/custom/Modal";

type UserType = z.infer<typeof UserSchema>;
type AuthType = z.infer<typeof AuthUser>;

const AuthPage = () => {
  //const [onOpen, setOnOpen] = useState(0);
  const [errorMessage, setErrorMessage] = useState<
    Error | ServerError | string | string[] | null
  >(null);
  const navigate = useNavigate();
  const signIn = useSignIn();
  const form = useForm<UserType>({ resolver: zodResolver(UserSchema) });
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
  } = form;

  const [adminLogin] = useMutation<{ adminLogin: AuthType }>(
    LOGIN_ADMIN,
    {
      onError: (error) => {
        if (error.networkError) {
          setErrorMessage(error.networkError);
          return;
        }
        if (error.message) {
          setErrorMessage(error.message);
          return;
        }
        if (error.graphQLErrors) {
          setErrorMessage(error.graphQLErrors.map((error) => error.message));
          return;
        }
      },
    }
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
      });

      if (!data) {
        setError("root", { message: "Incorrect number or password" });
        return;
      }

      if (
        signIn({
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
      setError("root", { message: "Sorry something went wrong." });
    }
  };
  return (
    <div className=" w-full h-screen grid">
      <div className="w-full h-full lg:w-2/6 lg:h-3/5 xl:1/4 xl:h-3/5 2xl:w-2/6 2xl:h-3/6 m-auto border border-gray-500 rounded">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full h-full relative"
        >
          <div className="w-full h-16 px-4 flex items-center">
          </div>
          <div className="w-full h-auto px-8 mt-8">
            <Form {...form}>
              <FormField
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username or Phone number</FormLabel>
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

          <div className="w-full px-8 py-6 absolute bottom-0">
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
      <Modal
        title="Internal server error"
        children={
          errorMessage && (
            <div className="w-full">
              <h1>Sorry something went wrong</h1>
              <p>{errorMessage?.toString()}</p>
              <div className="w-full flex justify-center">
                <Button
                  variant="destructive"
                  onClick={() => {
                    setErrorMessage(null);
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          )
        }
        open={errorMessage ? true : false}
        onOpenChange={() => {
          setErrorMessage(null);
        }}
      />
    </div>
  );
};

export default AuthPage;
