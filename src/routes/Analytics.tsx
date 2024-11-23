import { useState } from "react";
//lib
import { useQuery } from "@apollo/client";
import { z } from "zod";

//query
import { GET_MUNICIPALS } from "../GraphQL/Queries";

//zod
import { MunicipalsSchema } from "../zod/data";

//ui
import { Button } from "../components/ui/button";
import Modal from "../components/custom/Modal";
import NewMunicipalForm from "../layout/NewMunicipalForm";
import { Skeleton } from "../components/ui/skeleton";
//import Empty from "../components/custom/Empty";
import Error from "../components/custom/Error";
import Municipal from "../components/item/Municipal";
//icon
import { IoMdAdd } from "react-icons/io";

//interface
type MunicipalType = z.infer<typeof MunicipalsSchema>;
const Analytics = () => {
  const [onModal, setOnModal] = useState<boolean>(false);
  const { error, loading, data } = useQuery<MunicipalType>(GET_MUNICIPALS);

  const count: number = (data && data.municipals.length) || 0;

  console.log(data?.municipals);
  
  return (
    <div className=" w-full h-screen">
      <div className="w-full p-4 flex justify-end">
        <Button onClick={() => setOnModal(true)} className="w-auto flex gap-2">
          <IoMdAdd />
          New
        </Button>
      </div>
      <div className="w-full grid grid-cols-1 gap-2 md:grid-cols-3 lg:grid-cols-4 p-2">
        <Municipal key={0} id={count} name="All" barangaysCount={1} />
        {loading ? (
          <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </>
        ) : error ? (
          <Error title="Error" />
        ) : (
          data &&
          data.municipals.map((item) => <Municipal key={item.id} {...item} />)
        )}
      </div>
      <Modal
        title="New Area"
        open={onModal}
        onOpenChange={() => setOnModal(false)}
        children={
          <div className="w-full">
            <NewMunicipalForm />
          </div>
        }
      />
    </div>
  );
};

export default Analytics;
