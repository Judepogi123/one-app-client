//import { useState, useId } from "react";

//props
import {  BarangaySchema } from "../zod/data";

//lib
import { useParams } from "react-router-dom";
import {  useQuery } from "@apollo/client";
import z from "zod";
//mutaion

//queries
import { GET_BARANGAY } from "../GraphQL/Queries";

//ui
// import { Button } from "../components/ui/button";
import AreaHeader from "../layout/AreaHeader";
// import {
//   Select,
//   SelectItem,
//   SelectContent,
//   SelectTrigger,
//   SelectValue,
// } from "../components/ui/select";
// import Purok from "../components/item/Purok";

type BarangayType = z.infer<typeof BarangaySchema>;

const Barangay = () => {
  //const [selected, setSelected] = useSearchParams({ area: "All" });
  const { barangayID } = useParams();

  // const currentArea = selected.get("area");
  // const navigate = useNavigate();

  const { data} = useQuery<{barangay: BarangayType}>(GET_BARANGAY, {
    variables: {
      id: barangayID,
    },
  });

  // const handleChangeArea = (value: string) => {
  //   setSelected(
  //     (prev) => {
  //       prev.set("area", value);
  //       return prev;
  //     },
  //     {
  //       replace: true,
  //     }
  //   );
  // };

  //const handleNavigateNew = (value: string) => {};

  return (
    <div className="w-full h-full">
      <div className="w-full p-2">{data && data.barangay.name}</div>
      <AreaHeader/>

      <div className=" w-full">
        {/* {data?.map((item) => (
          <div></div>
        ))} */}
      </div>
    </div>
  );
};

export default Barangay;
