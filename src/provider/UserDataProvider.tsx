import { useContext, createContext, useEffect, useState } from "react";
//lib
import z from "zod";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
//import useSignOut from "react-auth-kit/hooks/useSignOut";
import { AuthUser } from "../zod/data";

//props
type AuthType = z.infer<typeof AuthUser>;

const UserDataContext = createContext<AuthType | null>(null);

const UserDataProvider = ({ children }: { children: React.ReactNode }) => {
  const authUser = useAuthUser<AuthType>(); // Get user data
  const authHeader = useAuthHeader(); // Get auth header
  //const signOut = useSignOut();
  const [user, setUser] = useState<AuthType | null>(authUser);

  // Detect login/logout and update user state
  useEffect(() => {
    if (!authHeader) {
      setUser(null); // Clear user on logout
    } else {
      setUser(authUser); // Update user on login
    }
  }, [authHeader, authUser]);

  // Update document title when user changes
  useEffect(() => {
    if (user) {
      document.title =
        user.forMunicipal && user.forMunicipal === 4903
          ? "JP-Portal"
          : "JML-Portal";
    }
  }, [user]);

  return (
    <UserDataContext.Provider value={user}>{children}</UserDataContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error("The hook must be used only inside the provider!");
  }
  return context;
};

export default UserDataProvider;
