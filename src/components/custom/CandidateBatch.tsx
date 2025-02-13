//layout
import {
  Select,
  SelectContent,
  //SelectGroup,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "../ui/select";
import { twMerge } from "tailwind-merge";

//props
interface Props {
  className: string;
}
const CandidateBatch = ({ className }: Props) => {
  return (
    <Select>
      <SelectTrigger className={twMerge(className, "")}>
        <SelectValue placeholder="Select batch" />
      </SelectTrigger>
      <SelectContent className="w-full">
        <SelectItem value="batch1">Batch 1</SelectItem>
        <SelectItem value="batch2">Batch 2</SelectItem>

        {/* Add more batches here */}
      </SelectContent>
    </Select>
  );
};

export default CandidateBatch;
