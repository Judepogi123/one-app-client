//import React from "react";

//ui
import { Skeleton } from "../components/ui/skeleton";

//lib
import {  useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { z } from "zod";
//query
import { GET_BARANGAYS } from "../GraphQL/Queries";

//interface
import { BarangaySchema } from "../zod/data";

//layout
import Barangay from "../components/item/Barangay";

//props
// interface BarangayListProps {
  
// }

type BarangayType = z.infer<typeof BarangaySchema>;

const BarangayList = () => {
  const { municipalID } = useParams<string>();
  const zipCode = parseInt(municipalID || "", 10);
  console.log(zipCode);
  
  const { data, loading } = useQuery<{ barangayList: BarangayType[] | [] }>(
    GET_BARANGAYS,
    {
      variables: {
        municipalId: zipCode,
      },
    }
  );

  
  return (
    <div className="w-full px-4 flex flex-col gap-2">
      {loading ? (
        <>
          {" "}
          <Skeleton />{" "}
        </>
      ) : data?.barangayList && data.barangayList.length === 0 ? (
        <h1>Empty....</h1>
      ) : (
        data?.barangayList.map((item, index) => <Barangay key={index} {...item} />)
      )}
    </div>
  );
};

export default BarangayList;
