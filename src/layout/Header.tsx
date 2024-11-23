import React, { useState } from "react";
//ui
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";

//lib
import { useLocation, Link, useNavigate } from "react-router-dom";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import z from "zod";
//types
import { HomeLayoutProps } from "../interface/layout";

//icons
import { CiUser } from "react-icons/ci";

//props
import { AuthUser } from "../zod/data";
interface HeaderProps {
  handleChangeMenu: (value: string) => void;
  currentMenu: string | null;
}

const homeMenu: HomeLayoutProps[] = [
  { title: "Home", value: "/" },
  { title: "Data", value: "/data" },
  { title: "Survey", value: "/survey" },
];

type UserType = z.infer<typeof AuthUser>;

const Header = ({ handleChangeMenu, currentMenu }: HeaderProps) => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const signOut = useSignOut();
  const navigate = useNavigate();
  const auth = useAuthUser<{ user: UserType }>();

  console.log(auth);

  return (
    <div className=" w-full h-auto">
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

        <div
          className="p-2 hover:border-slate-700 border"
          onClick={() => {
            signOut();
            navigate("/auth");
          }}
        >
          <CiUser />
        </div>
      </div>
    </div>
  );
};

export default Header;
