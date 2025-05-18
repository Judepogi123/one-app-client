import { useState } from "react";

//ui
import { Button } from "../components/ui/button";
import Modal from "../components/custom/Modal";

//layout
import AddNewBarangay from "./AddNewBarangay";
import BarangayList from "../layout/BarangayList";
import VotersList from "../layout/VotersList";
//lib
import { useQuery } from "@apollo/client";
import { useParams, useSearchParams } from "react-router-dom";
import z from "zod";
//interface
import { MunicipalVoterListSchema } from "../zod/data";

import { GET_MUNICIPAL_VOTERS } from "../GraphQL/Queries";

//icon

import { AiOutlineExperiment } from "react-icons/ai";
import { BsBuildingAdd } from "react-icons/bs";
//
type MunicipalVoterList = z.infer<typeof MunicipalVoterListSchema>;

const Area = () => {
  const [onAdd, setOnAdd] = useState<boolean>(false);
  const [selected, setSelected] = useSearchParams({ field: "0" });

  const { municipalID } = useParams();
  const id = parseInt(municipalID || "", 10);
  const currentField = selected.get("field");

  const { loading } = useQuery<MunicipalVoterList>(GET_MUNICIPAL_VOTERS, {
    variables: { id },
  });
  if (loading) return <p>Loading...</p>;
  const handleChangeSelected = (value: number) => {
    setSelected(
      (prev) => {
        prev.set("field", value.toString());
        return prev;
      },
      { replace: true }
    );
  };

  const handleChangeSelectedLayout = () => {
    switch (currentField) {
      case "0":
        return <VotersList />;
      case "1":
        return <BarangayList />;
      default:
        return <VotersList />;
    }
  };

  return (
    <div className=" w-full h-full">
      <div className=" w-full p-4 flex justify-between">
        <div className="">
          <Button
            size="sm"
            onClick={() => handleChangeSelected(0)}
            variant={currentField === "0" ? "default" : "ghost"}
          >
            All
          </Button>
          <Button
            size="sm"
            onClick={() => handleChangeSelected(1)}
            variant={currentField === "1" ? "default" : "ghost"}
          >
            Barangay
          </Button>
        </div>

        <div className="w-auto flex gap-2">
          {currentField === "1" && (
            <Button
              onClick={() => setOnAdd(true)}
              size="sm"
              variant="outline"
              className=" w-auto flex gap-2"
            >
              <BsBuildingAdd fontWeight={600} />
              <h1 className=" font-semibold hidden lg:block">New Barangay</h1>
            </Button>
          )}

          <Button size="sm" variant="outline" className=" w-auto flex gap-2">
            <AiOutlineExperiment fontWeight={600} />
            <h1 className=" font-semibold hidden lg:block">Experiment</h1>
          </Button>
          {/* <Button
            size="sm"
            onClick={() => navigate(`/area/${id}/new/voter`)}
            className=" w-auto flex gap-2"
          >
            <IoMdAdd className="hidden lg:block" />
            <IoPersonAddOutline className="block lg:hidden" />
            <h1 className="hidden lg:block">Add Voters</h1>
          </Button> */}
        </div>
      </div>
      <div className="">{handleChangeSelectedLayout()}</div>
      <Modal
        title="Add new Barangay"
        open={onAdd}
        onOpenChange={() => setOnAdd(false)}
        children={<AddNewBarangay setOnAdd={setOnAdd} />}
      />
    </div>
  );
};

export default Area;
