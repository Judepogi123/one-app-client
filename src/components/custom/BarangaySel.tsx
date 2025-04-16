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
//graphql
import { GET_BARANGAYS } from "../../GraphQL/Queries";
import { useQuery } from "@apollo/client";

//props
import { BarangayProps } from "../../interface/data";

interface Props {
  zipCode: string;
  handleChangeArea: (value: string, key: string) => void;
  className?: string | undefined;
  value?: string | "none";
}

const BarangaySel = ({
  zipCode,
  handleChangeArea,
  className,
  value,
}: Props) => {
  const { data, loading, refetch } = useQuery<{
    barangayList: BarangayProps[];
  }>(GET_BARANGAYS, {
    variables: {
      zipCOde: parseInt(zipCode, 10),
    },
    skip: zipCode === "none",
  });

  useEffect(() => {
    if (zipCode === "none") {
      return;
    }
    refetch({
      zipCode: parseInt(zipCode, 10),
    });
  }, [zipCode, refetch]);

  return (
    <div className={twMerge("w-auto flex gap-2 items-center", className ?? "")}>
      <Label>Barangay: </Label>
      <Select
        value={value}
        onValueChange={(value) => handleChangeArea(value, "barangay")}
        disabled={loading}
      >
        <SelectTrigger className="w-auto">
          <SelectValue
            placeholder={loading ? "Loading..." : "Select Barangay"}
          />
        </SelectTrigger>
        <SelectContent className="max-h-80">
          <SelectItem value="none">None</SelectItem>
          {data &&
            data.barangayList.map((barangay) => (
              <SelectItem key={barangay.id} value={barangay.id}>
                {barangay.name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BarangaySel;
