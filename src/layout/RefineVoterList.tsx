/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from "react";
import { SetURLSearchParams } from "react-router-dom";
import { MunicipalProps, PurokProps } from "../interface/data";

//graphql
import { useQuery } from "@apollo/client";
import { GET_BARANGAYS, GET_PUROKLIST } from "../GraphQL/Queries";
//ui
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "../components/ui/select";
import { BarangayProps } from "../interface/data";
import { Button } from "../components/ui/button";

interface RefineProps {
  setMunicipal: SetURLSearchParams;
  setBarangay: SetURLSearchParams;
  minicipals: MunicipalProps[];
  currentBarangay: string;
  currentMunicipal: string;
  currentPurok: string;
}

const RefineVoterList = ({
  setBarangay,
  setMunicipal,
  minicipals,
  currentBarangay,
  currentMunicipal,
}: RefineProps) => {
  const { data, loading, refetch, error } = useQuery<{
    barangayList: BarangayProps[];
  }>(GET_BARANGAYS, {
    variables: {
      zipCode:
        currentMunicipal !== "all" ? parseInt(currentMunicipal, 10) : 4905,
    },
    skip: currentMunicipal === "all",
  });

  const { data: purok, loading: purokLoading } = useQuery<{
    getPurokList: PurokProps[];
  }>(GET_PUROKLIST, {
    variables: {
      id: currentBarangay as string,
    },
    skip: currentBarangay === "all",
  });

  console.log(purok);

  useEffect(() => {
    if (currentMunicipal !== "all") {
      refetch({
        zipCode: parseInt(currentMunicipal, 10),
      });
    }
  }, [currentMunicipal, refetch]);

  const handleChangeMun = (value: string) => {
    setMunicipal((prev) => {
      prev.set("area", value);
      return prev;
    });
  };

  const handleChangeBarangay = (value: string) => {
    setMunicipal((prev) => {
      prev.set("barangay", value);
      return prev;
    });
  };

  return (
    <div className="w-full h-auto p-x">
      <div className="">
        <h1 className="font-medium text-gray-700 py-2">Municipals</h1>
        <Select
          defaultValue="all"
          onValueChange={(value) => handleChangeMun(value)}
          value={currentMunicipal}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>

          <SelectContent className=" max-h-96">
            <SelectItem value="all">All</SelectItem>
            {minicipals.map((item) => (
              <SelectItem value={item.id.toString()} key={item.id.toString()}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="">
        <h1 className="font-medium text-gray-700 py-2">Barangay</h1>
        <Select
          disabled={loading}
          defaultValue="all"
          onValueChange={(value) => handleChangeBarangay(value)}
          value={currentBarangay}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>

          <SelectContent className="h-auto max-h-40">
            <SelectItem value="all">All</SelectItem>
            {data &&
              data.barangayList.map((item) => (
                <SelectItem value={item.id.toString()} key={item.id.toString()}>
                  {item.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="">
        <h1 className="font-medium text-gray-700 py-2">Purok</h1>
        <Select
          disabled={purokLoading}
          defaultValue="all"
          onValueChange={(value) => handleChangeBarangay(value)}
          value={currentBarangay}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {purok &&
              purok.getPurokList.map((item) => (
                <SelectItem value={item.id as string} key={item.id as string}>
                  {item.purokNumber}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-full p-2 flex justify-end">
        <Button>Go</Button>
      </div>
    </div>
  );
};

export default RefineVoterList;
