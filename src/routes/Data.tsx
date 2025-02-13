import {} from "react";

//lib
import { useNavigate } from "react-router-dom";

//type
import { DataLayoutProps } from "../interface/layout";

//icons
//import { MdOutlineAnalytics } from "react-icons/md";
import { RiTeamLine } from "react-icons/ri";
import { CiViewList } from "react-icons/ci";
import { IoCreateOutline } from "react-icons/io5";

const dataListMenu: DataLayoutProps[] = [
  // {
  //   title: "Area",
  //   value: "/area",
  //   icon: MdOutlineAnalytics,
  //   desc: "Sort and Search",
  // },
  {
    title: "Manage",
    value: "/manage",
    icon: IoCreateOutline,
    desc: "",
  },
  {
    title: "Voters",
    value: "/list",
    icon: CiViewList,
    desc: "Generate, custom and Finalize List",
  },
  {
    title: "Team",
    value: "/teams",
    icon: RiTeamLine,
    desc: "View and manage teams",
  },
];

const Data = () => {
  const navigate = useNavigate();
  return (
    <div className=" w-full h-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 py-2 lg:pt-16 px-4 gap-4">
      {dataListMenu.map((item) => (
        <div
          onClick={() => navigate(item.value)}
          className=" w-full h-32 border border-gray-400 hover:border-gray-900 flex justify-center items-center flex-col rounded-md cursor-pointer text-center bg-white"
        >
          <div className=" w-auto p-2">
            {<item.icon className=" text-4xl" />}
          </div>
          <div className="">
            <h1 className=" font-semibold text-xl text-[#0a0908]">
              {item.title}
            </h1>
            <h3 className=" font-light">{item.desc}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Data;
