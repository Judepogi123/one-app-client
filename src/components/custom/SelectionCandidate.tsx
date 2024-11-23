//ui
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
//grphql
import { useQuery } from "@apollo/client";

//props
import { CandidatesProps } from "../../interface/data";
import { GET_CANDIDATES } from "../../GraphQL/Queries";

//props
interface CandidateProps {
  setSelectedCandidate: React.Dispatch<React.SetStateAction<string>>
  selectedCandidate: string
}

const SelectionCandidate = ({setSelectedCandidate,selectedCandidate}: CandidateProps) => {
  const { data, loading } = useQuery<{ candidates: CandidatesProps[] }>(
    GET_CANDIDATES
  );
  return (
    <div className="flex gap-2 items-center">
      <Label htmlFor="candidate"> Candidate</Label>
      <Select defaultValue="none" value={selectedCandidate} disabled={loading} onValueChange={(value)=> setSelectedCandidate(value)}>
        <SelectTrigger id="candidate">
          <SelectValue placeholder={loading ? "Loading...": "Select"} />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          {data?.candidates?.map((candidate) => (
            <SelectItem value={candidate.id}>
              {candidate.firstname} {candidate.lastname}
              ({candidate.code?.toUpperCase()})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectionCandidate;
