import { useState } from "react";
import { useUserData } from "../provider/UserDataProvider";
//layout
import NewVoterBatchForm from "../layout/NewVoterBatchForm";
//ui
import Modal from "../components/custom/Modal";

//lib
import { useNavigate } from "react-router-dom";

//interface
import { DataLayoutProps } from "../interface/layout";

//icon
import { MdOutlineAnalytics } from "react-icons/md";
import { LiaDraftingCompassSolid } from "react-icons/lia";
import { MdOutlineChangeCircle } from "react-icons/md";
import { RiSurveyLine } from "react-icons/ri";
import { FaPeopleGroup } from "react-icons/fa6";
import { MdOpenInNew } from "react-icons/md";
import { MdOutlineManageAccounts } from "react-icons/md";
import { BsCollection } from "react-icons/bs";
//import { GiRadarSweep } from "react-icons/gi";
import { GiVendingMachine } from "react-icons/gi";
import { HiOutlineIdentification } from "react-icons/hi2";
// import { MdOutlineBugReport } from "react-icons/md";
const optionList: DataLayoutProps[] = [
  {
    title: "New",
    value: "/manage/new",
    icon: MdOpenInNew,
    desc: "Start new darft",
  },
  {
    title: "Draft",
    value: "/manage/draft",
    icon: LiaDraftingCompassSolid,
    desc: "Sort and Search",
  },
  {
    title: "Update",
    value: "/manage/update",
    icon: MdOutlineChangeCircle,
    desc: "",
  },

  {
    title: "Area",
    value: "/area",
    icon: MdOutlineAnalytics,
    desc: "Population and Barangay",
  },
  {
    title: "Validation",
    value: "/manage/validation",
    icon: MdOutlineAnalytics,
    desc: "",
  },
  {
    title: "Nominee",
    value: "/manage/candidates",
    icon: FaPeopleGroup,
    desc: "Supporters and Candidates",
  },
  {
    title: "Survey",
    value: "/survey",
    icon: RiSurveyLine,
    desc: "Init. and Reports",
  },
  {
    title: "Accounts",
    value: "/manage/accounts",
    icon: MdOutlineManageAccounts,
    desc: "Manage accounts",
  },
  {
    title: "Election Report",
    value: "/manage/collection",
    icon: BsCollection,
    desc: "Track and Account Members",
  },
  {
    title: "Machines",
    value: "/manage/machine",
    icon: GiVendingMachine,
    desc: "",
  },
  {
    title: "Generate ID",
    value: "/manage/generate-id",
    icon: HiOutlineIdentification,
    desc: "",
  },
  // {
  //   title: "Attendance",
  //   value: "/manage/accounts",
  //   icon: MdOutlineManageAccounts,
  //   desc: "Manage accounts",
  // },
  // {
  //   title: "Report",
  //   value: "/manage/accounts",
  //   icon: MdOutlineBugReport,
  //   desc: "System reports and feedback",
  // },
];

const Create = () => {
  const [onAdd, setOnAdd] = useState<boolean>(false);
  const navigate = useNavigate();
  const user = useUserData();
  return (
    <div className="w-full h-auto">
      <div className="w-full h-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 py-2 lg:pt-16 px-4 gap-4">
        {optionList
          .filter((item) => {
            if (user?.forMunicipal && user.forMunicipal) {
              return item.title !== "Survey";
            }
            return item;
          })
          .map((item, i) => (
            <div
              key={i}
              onClick={() => navigate(item.value)}
              className=" w-full h-32 border border-gray-300 bg-white flex justify-center items-center flex-col rounded-md cursor-pointer text-center hover:border-slate-900"
            >
              <div className=" w-auto p-2">
                {<item.icon className=" text-4xl" />}
              </div>
              <div className="">
                <h1 className=" font-semibold text-xl text-[#0a0908]">
                  {item.title}
                </h1>
                <h3 className=" font-medium text-gray-700">{item.desc}</h3>
              </div>
            </div>
          ))}
      </div>
      <Modal
        className=" w-[1000px]"
        open={onAdd}
        onOpenChange={() => setOnAdd(false)}
        children={<NewVoterBatchForm />}
      />
    </div>
  );
};

export default Create;
