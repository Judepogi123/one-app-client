//import { useState } from "react";

//lib
import { useSearchParams, Outlet, useNavigate} from "react-router-dom";

//layout
import Header from "../layout/Header";
import { Toaster } from "../components/ui/sonner";
//types
const Home = () => {
  const [selectedMenu, setSelectedMenu] = useSearchParams({ menu: "/data" });
  const currentMenu = selectedMenu.get("menu") || "/data";

  const navigate = useNavigate()

  const handleChangeMenu = (value: string) => {
    setSelectedMenu({ menu: value }, { replace: true });
    navigate(value)
  };

  return (
    <div className=" w-full h-full">
      <Header handleChangeMenu={handleChangeMenu} currentMenu={currentMenu} />
      <div className="w-full h-full">
        <Outlet />
      </div>
      <Toaster position="top-right" className="" closeButton={true} />
    </div>
  );
};

export default Home;
