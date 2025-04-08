/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";
//ui
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
//import { Input } from "../ui/input";
//graphql
import { useQuery } from "@apollo/client";
import {
  GET_MUNICIPALS,
  GET_BARANGAYS,
  GET_PUROKLIST,
} from "../../GraphQL/Queries";

//props
import {
  MunicipalProps,
  BarangayProps,
  PurokProps,
} from "../../interface/data";

//props
interface AreaProps {
  handleChangeOption: (params: string, value: string) => void;
  currentMunicipal: string;
  currentBarangay: string;
  currentPurok: string;
  className?: string;
  defaultValue: string;
  disabled?: boolean;
  showPurok?: boolean;
}

const AreaSelection = ({
  handleChangeOption,
  currentBarangay,
  currentMunicipal,
  currentPurok,
  className,
  defaultValue,
  disabled,
  showPurok,
}: AreaProps) => {
  const { data, loading } = useQuery<{ municipals: MunicipalProps[] }>(
    GET_MUNICIPALS
  );

  const {
    data: barangayList,
    loading: barangayLoading,
    refetch,
  } = useQuery<{
    barangayList: BarangayProps[];
  }>(GET_BARANGAYS, {
    variables: {
      zipCode:
        currentMunicipal !== "all" ? parseInt(currentMunicipal, 10) : 4905,
    },
    skip: currentMunicipal === "all",
  });

  useEffect(() => {
    refetch({
      zipCode: parseInt(currentMunicipal, 10),
    });
  }, [currentMunicipal, refetch, defaultValue]);

  const {
    data: purokList,
    loading: purokLoading,
    refetch: purokRefetch,
  } = useQuery<{
    getPurokList: PurokProps[];
  }>(GET_PUROKLIST, {
    variables: {
      id: currentBarangay,
    },
    skip: currentBarangay === "all",
  });

  useEffect(() => {
    if (currentBarangay === "all") {
      return;
    }
    purokRefetch({
      id: currentBarangay,
    });
  }, [currentBarangay, purokRefetch]);

  useEffect(() => {
    if (currentBarangay === "all") {
      handleChangeOption("purok", "all");
    }
    if (currentMunicipal === "all") {
      handleChangeOption("barangay", "all");
    }
  }, [currentBarangay, currentMunicipal]);

  if (!data) {
    return;
  }

  return (
    <div className={twMerge(" h-auto p-2 flex items-center gap-2", className)}>
      <Label htmlFor="municipal">Municipal:</Label>
      <Select
        disabled={disabled}
        value={currentMunicipal}
        defaultValue={defaultValue}
        onValueChange={(value) => handleChangeOption("zipCode", value)}
      >
        <SelectTrigger id="municipal" className="w-auto">
          <SelectValue placeholder={loading ? "Loading..." : ""} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {data &&
            data.municipals.map((item, i) => (
              <SelectItem value={item.id.toString()} key={i}>
                {item.name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      <Label htmlFor="barangay">Barangay:</Label>
      <Select
        value={currentBarangay}
        defaultValue="all"
        onValueChange={(value) => handleChangeOption("barangay", value)}
      >
        <SelectTrigger id="barangay" className="w-auto">
          <SelectValue placeholder={barangayLoading ? "Loading..." : ""} />
        </SelectTrigger>
        <SelectContent className="max-h-72">
          <SelectItem value="all">All</SelectItem>
          {barangayList &&
            barangayList.barangayList.map((item, i) => (
              <SelectItem key={item.id} value={item.id}>
                {i + 1}. {item.name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      {showPurok && (
        <>
          {" "}
          <Label htmlFor="purok">Purok:</Label>
          <Select
            value={currentPurok}
            defaultValue="all"
            onValueChange={(value) => handleChangeOption("purok", value)}
          >
            <SelectTrigger id="purok" className="w-auto">
              <SelectValue placeholder={purokLoading ? "Loading..." : ""} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {purokList &&
                purokList.getPurokList.map((item) => (
                  <SelectItem key={item.id} value={item.id as string}>
                    {item.purokNumber}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </>
      )}
    </div>
  );
};

export default AreaSelection;
