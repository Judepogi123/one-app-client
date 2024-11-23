/* eslint-disable @typescript-eslint/no-explicit-any */
import { twMerge } from "tailwind-merge";

//ui
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import Alert from "./Alert";
//graphql
import { useQuery } from "@apollo/client";
import { GET_MUNICIPALS } from "../../GraphQL/Queries";

//props
import { MunicipalProps } from "../../interface/data";

interface Props {
  defaultValue: string;
  value: string;
  onChange?: (...event: any[]) => void;
  handleChangeArea: (value: string, key?: string) => void;
  className?: string;
}

const MunicipalSel = ({
  defaultValue,
  value,
  handleChangeArea,
  className,
}: Props) => {
  const { data, loading, error } = useQuery<{ municipals: MunicipalProps[] }>(
    GET_MUNICIPALS
  );
  if (error) {
    return <Alert title={error.message} />;
  }
  return (
    <div className={twMerge("w-auto flex items-center gap-2", className)}>
      <Label>Muncipal: </Label>
      <Select
        value={value}
        defaultValue={defaultValue}
        onValueChange={(value) => handleChangeArea(value, "municipal")}
      >
        <SelectTrigger disabled={loading}>
          <SelectValue placeholder={loading ? "Loading..." : "Select"} />
        </SelectTrigger>
        <SelectContent>
          {loading ? (
            <SelectItem value="loading" disabled>
              Loading...
            </SelectItem>
          ) : (
            data?.municipals.map((muni) => (
              <SelectItem key={muni.id} value={muni.id.toString()}>
                {muni.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MunicipalSel;