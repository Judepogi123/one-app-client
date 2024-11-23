import { useContext, createContext } from "react";
//lib
import z from "zod";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
//zod
import { AuthUser } from "../zod/data";

//props
type AuthType = z.infer<typeof AuthUser>;

const UserDataContext = createContext<AuthType | null>(null);

const UserDataProvider = ({ children }: { children: React.ReactNode }) => {
  const data = useAuthUser<AuthType>();

  // if(!data){
  //   return (
  //     <div className="w-full h-screen grid place-content-center">
  //       <div className="">
  //         <h1>Required data is loading...</h1>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <UserDataContext.Provider value={data}>{children}</UserDataContext.Provider>
  );
};
export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error("The hook must be use onlt inside the provider!");
  }
  return context;
};

export default UserDataProvider;
