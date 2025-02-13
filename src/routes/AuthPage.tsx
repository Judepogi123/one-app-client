import { useState } from "react";
import axios from "../api/axios";
//lib
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { ServerError } from "@apollo/client";
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
import { UserSchema } from "../zod/data";
// import { UserProps } from "../interface/data";
//mutation
// import { LOGIN_ADMIN, LOGIN_USER } from "../GraphQL/Mutation";

//layout
import Modal from "../components/custom/Modal";
import { responseError } from "../utils/helper";
import { Checkbox } from "../components/ui/checkbox";
// import { error } from "console";
type UserType = z.infer<typeof UserSchema>;
// type AuthType = z.infer<typeof AuthUser>;

const AuthPage = () => {
  //const [onOpen, setOnOpen] = useState(0);
  const [errorMessage, setErrorMessage] = useState<
    Error | ServerError | string | string[] | null
  >(null);
  const navigate = useNavigate();
  const signIn = useSignIn();
  const form = useForm<UserType>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      showPassword: false,
    },
  });
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
    watch,
  } = form;
  const showPassword = watch("showPassword") || false;

  // const [userLogin] = useMutation<{ userLogin: UserProps }>(LOGIN_USER, {
  //   onError: (error) => {
  //     if (error.networkError) {
  //       setErrorMessage(error.networkError);
  //       return;
  //     }
  //     if (error.message) {
  //       setErrorMessage(error.message);
  //       return;
  //     }
  //     if (error.graphQLErrors) {
  //       setErrorMessage(error.graphQLErrors.map((error) => error.message));
  //       return;
  //     }
  //   },
  // });

  // const [adminLogin] = useMutation<{ adminLogin: AuthType }>(LOGIN_ADMIN, {
  //   onError: (error) => {
  //     if (error.networkError) {
  //       setErrorMessage(error.networkError);
  //       return;
  //     }
  //     if (error.message) {
  //       setErrorMessage(error.message);
  //       return;
  //     }
  //     if (error.graphQLErrors) {
  //       setErrorMessage(error.graphQLErrors.map((error) => error.message));
  //       return;
  //     }
  //   },
  // });

  const onSubmit = async (value: UserType) => {
    try {
      // const { data } = await adminLogin({
      //   variables: {
      //     user: {
      //       phoneNumber: value.phoneNumber,
      //       password: value.password,
      //     },
      //   },
      // });

      // if (!data) {
      //   setError("root", { message: "Incorrect number or password" });
      //   return;
      // }
      const response = await axios.post(
        "/auth/user",
        {
          username: value.phoneNumber,
          password: value.password,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200 && response.data.error === 0) {
        setError("phoneNumber", {
          message: responseError[response.data.error],
        });
        return;
      }
      if (response.status === 200 && response.data.error === 4) {
        setError("password", {
          message: responseError[response.data.error],
        });
        console.log("error: ", responseError[response.data.error]);

        return;
      }
      if (response.status === 200 && response.data.error === 1) {
        setError("root", {
          message: responseError[response.data.error],
        });
        console.log("error: ", responseError[response.data.error]);
        return;
      }
      if (response.status === 200 && response.data.error === 2) {
        setError("root", {
          message: responseError[response.data.error],
        });
        return;
      }

      if (response.status === 200 && response.data.error === 3) {
        setError("root", {
          message: responseError[response.data.error],
        });
        return;
      }

      if (
        signIn({
          auth: {
            token: response.data.accessToken,
            type: "Bearer",
          },
          userState: {
            username: response.data.username,
            role: response.data.role,
            uid: response.data.uid,
            forMunicipal: response.data.forMunicipal,
          },
        })
      ) {
        navigate("/");
      } else {
        navigate("/auth");
      }
    } catch (error) {
      console.log(error);

      setError("root", { message: error as string });
    }
  };
  return (
    <div className=" w-full h-screen grid">
      <div className="w-full h-full lg:w-2/6 lg:h-3/5 xl:1/4 xl:h-3/5 2xl:w-2/6 2xl:h-3/6 m-auto border border-gray-500 rounded">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full h-full relative"
        >
          <div className="w-full h-16 px-4 flex items-center justify-center">
            {errors.root && (
              <div className="w-auto border border-red-700 p-2 rounded">
                <h1 className="text-red-500 font-medium ">
                  {errors.root.message}!
                </h1>
              </div>
            )}
          </div>
          <div className="w-full h-auto px-8 mt-4">
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
                render={() => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        {...register("password", { required: true })}
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
              <FormField
                name="showPassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="w-full flex items-center gap-1">
                      <FormControl>
                        <Checkbox
                          checked={showPassword}
                          onCheckedChange={field.onChange}
                          {...register("showPassword", { required: true })}
                        />
                      </FormControl>
                      <FormLabel>Show Password</FormLabel>
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
