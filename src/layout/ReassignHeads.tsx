import { useState } from "react";

//
import { Button } from "../components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectLabel,
//   SelectValue,
//   SelectTrigger,
// } from "../components/ui/select";
import { toast } from "sonner";
//database
import { CHANGE_MERIT } from "../GraphQL/Mutation";
import { useMutation } from "@apollo/client";
//props
interface Props {
  selectedIDs: string[];
}
const ReassignHeads = ({ selectedIDs }: Props) => {
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [changeMerit] = useMutation(CHANGE_MERIT, {
    onCompleted: () => {
      toast.success("Merit reassigned successfully!", {
        closeButton: false,
      });
      setSelectedLevel(1);
    },
  });

  const handleChangeMerit = async () => {
    if (selectedIDs.length === 0) {
      return toast.warning("Select at least one voter!", {
        closeButton: false,
      });
    }
    await changeMerit({
      variables: {
        id: selectedIDs,
        level: selectedLevel,
      },
    });
  };

  return (
    <div className=" w-full flex flex-col gap-2">
      {["TL", "PC", "BC"].map((item, i) => (
        <Button
          variant={selectedLevel === i + 1 ? "default" : "outline"}
          className=" border border-gray-300"
          onClick={() => setSelectedLevel(i + 1)}
        >
          {item}
        </Button>
      ))}

      <div className="w-full flex justify-end p-2">
        <Button size="sm" onClick={handleChangeMerit}>
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default ReassignHeads;
