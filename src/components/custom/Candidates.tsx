//ui
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { twMerge } from "tailwind-merge";
//grphql
import { useQuery } from "@apollo/client";

//props
import { CandidatesProps } from "../../interface/data";
import { GET_CANDIDATES } from "../../GraphQL/Queries";

//props
interface Props {
  className?: string;
  label?: string | "Candidate";
  select: boolean;
}

const Candidates = ({ className, label, select }: Props) => {
  const { data, loading } = useQuery<{ candidates: CandidatesProps[] }>(
    GET_CANDIDATES
  );
  return (
    <div className={twMerge("flex gap-2 items-center", className)}>
      {!select && <Label htmlFor="candidate"> {label}</Label>}
      <Select defaultValue="all" disabled={loading}>
        <SelectTrigger id="candidate">
          <SelectValue placeholder={select && "Select Candidate"} />
        </SelectTrigger>

        <SelectContent>
          {!select && <SelectItem value="all">All</SelectItem>}
          {data?.candidates?.map((candidate) => (
            <SelectItem value={candidate.id}>
              {candidate.firstname} {candidate.lastname}(
              {candidate.code?.toUpperCase()})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default Candidates;
