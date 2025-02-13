//import React, { useState } from "react";
//ui
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../components/ui/popover";
import { Button } from "../components/ui/button";
//lib
import { useLocation, Link, useNavigate } from "react-router-dom";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import { useUserData } from "../provider/UserDataProvider";
//types
//import { HomeLayoutProps } from "../interface/layout";

//icons
import { CiUser, CiLogout } from "react-icons/ci";
//props
interface HeaderProps {
  handleChangeMenu: (value: string) => void;
  currentMenu: string | null;
}

// const homeMenu: HomeLayoutProps[] = [
//   { title: "Home", value: "/" },
//   { title: "Data", value: "/data" },
//   { title: "Survey", value: "/survey" },
// ];

//type UserType = z.infer<typeof AuthUser>;

const Header = ({}: HeaderProps) => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const signOut = useSignOut();
  const navigate = useNavigate();
  const user = useUserData();
  return (
    <div className=" w-full h-auto hidden lg:block">
      <div className="w-full h-auto flex justify-between p-4">
        <Breadcrumb>
          <BreadcrumbList>
            {pathnames.length > 0 ? (
              <BreadcrumbItem>
                <Link to="/">Home</Link>
                <BreadcrumbSeparator />
              </BreadcrumbItem>
            ) : (
              <BreadcrumbItem>Home</BreadcrumbItem>
            )}

            {pathnames.map((value, index) => {
              const last = index === pathnames.length - 1;
              const to = `/${pathnames.slice(0, index + 1).join("/")}`;

              return last ? (
                <BreadcrumbItem className="capitalize">{value}</BreadcrumbItem>
              ) : (
                <BreadcrumbItem className="capitalize">
                  <Link to={to}>{value}</Link>
                  <BreadcrumbSeparator />
                </BreadcrumbItem>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>

        <Popover>
          <PopoverTrigger>
            <div className="p-2 hover:border-slate-700 border rounded-full">
              <CiUser />
            </div>
          </PopoverTrigger>

          <PopoverContent className="w-full min-w-[200px] flex flex-col gap-2">
            <div className="w-full">
              <h1 className=" text-center font-mono font-medium">
                {user.username}
              </h1>
              <h1 className="text-center text-sm">Admin</h1>
            </div>
            <Button
              className="w-auto flex items-center gap-1"
              variant="secondary"
              onClick={() => {
                signOut();
                navigate("/auth");
              }}
            >
              <CiLogout />
              Sign Out
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default Header;
