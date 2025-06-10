import { useQuery } from "@apollo/client";
import { GET_ALL_IDS } from "../../GraphQL/Queries";
//
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { TemplateId } from "../../interface/data";
import { useEffect, useState } from "react";

interface Props {
  zipCode: string;
  setSelectedID: React.Dispatch<React.SetStateAction<TemplateId | undefined>>;
  selectedID: TemplateId | undefined;
  disabled?: boolean;
}

const SelectID = ({ zipCode, setSelectedID, selectedID, disabled }: Props) => {
  const [selected, setSelected] = useState<string>("");
  const { data, loading } = useQuery<{ getAllIDs: TemplateId[] }>(GET_ALL_IDS, {
    variables: {
      zipCode,
    },
    onError: (err) => {
      console.log(err);
    },
  });
  console.log(data);

  useEffect(() => {
    if (selected && data) {
      const item = data.getAllIDs.find((item) => selected === item.id);
      setSelectedID(item);
    }
  }, [selected]);

  return (
    <Select
      disabled={disabled}
      onValueChange={(e) => setSelected(e)}
      value={selectedID?.id}
    >
      <SelectTrigger disabled={loading}>
        <SelectValue
          placeholder={
            data?.getAllIDs.length === 0
              ? "No ID found, please upload"
              : "Select ID"
          }
        />
      </SelectTrigger>
      <SelectContent>
        {data?.getAllIDs.map((item) => (
          <SelectItem value={item.id}>{item.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectID;
