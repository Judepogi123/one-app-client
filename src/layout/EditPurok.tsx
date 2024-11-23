import { useState } from "react";
//ui
import { Button } from "../components/ui/button";
import Alert from "../components/custom/Alert";
import { Skeleton } from "../components/ui/skeleton";
import { Input } from "../components/ui/input";
//lib
import { useQuery, useMutation } from "@apollo/client";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../components/ui/popover";
//queries
import { GET_DRAFTPUROK } from "../GraphQL/Queries";
import { CHANGE_PUROK_NAME, MERGE_PUROK } from "../GraphQL/Mutation";
//icon
import { FaPeopleGroup } from "react-icons/fa6";
import { CiEdit } from "react-icons/ci";
import { MdOutlinePlaylistRemove } from "react-icons/md";
//props
import { DraftedPurok } from "../interface/data";
import { toast } from "sonner";

const EditPurok = () => {
  const [selectedID, setSelectedID] = useState<string[]>([]);
  const [purokName, setPurokName] = useState<string>("");
  const { data, error, loading } = useQuery<{ puroks: DraftedPurok[] }>(
    GET_DRAFTPUROK
  );

  const [mergePurok, { loading: mergeLoading }] = useMutation(MERGE_PUROK, {
    refetchQueries: [GET_DRAFTPUROK],
  });

  const handleMerge = async () => {
    if (!purokName) return;
    try {
      const repsonse = await mergePurok({
        variables: {
          purok: {
            id: selectedID,
            newName: purokName,
          },
        },
      });
      if (repsonse.data) {
        toast("Merge successfully!");
        setPurokName("");
      }
    } catch (error) {
      toast(`Sorry something went wrong: ${error}`);
    }
  };

  if (error) {
    return <Alert title="Unexpedted error occured while fetching the data." />;
  }

  return (
    <div className="w-full">
      <div className="w-full flex justify-between p-2 sticky top-0 bg-white">
        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            disabled={selectedID.length === 0}
            onClick={() => setSelectedID([])}
            size="sm"
          >
            <MdOutlinePlaylistRemove />
          </Button>
          <h1 className=""> {selectedID.length}</h1>
        </div>

        <div className="">
          <Popover>
            <PopoverTrigger>
              <Button>Merge</Button>
            </PopoverTrigger>

            <PopoverContent className="flex flex-col gap-2">
              <h1 className="text-lg font-semibold">
                Merge the selected purok
              </h1>
              <Input onChange={(e) => setPurokName(e.target.value)} />
              <h1 className="text-sm font-medium">
                Changing the purok name/number cannot be undo afterwards.
              </h1>
              <Button disabled={mergeLoading} onClick={handleMerge}>
                {mergeLoading ? "Loading..." : "Save"}
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="w-full h-auto flex flex-col gap-2">
        {loading ? (
          <>
            <Skeleton className="w-full h-32 rounded" />{" "}
            <Skeleton className="w-full h-32 rounded" />{" "}
            <Skeleton className="w-full h-32 rounded" />
          </>
        ) : (
          data &&
          data.puroks.map((item) => (
            <DraftedPurokItem
              key={item.id}
              {...item}
              data={data.puroks}
              setSelectedID={setSelectedID}
              selectedID={selectedID}
            />
          ))
        )}
      </div>
    </div>
  );
};

const DraftedPurokItem = ({
  selectedID,
  setSelectedID,
  data,
  ...props
}: {
  id: string;
  barangaysId: string;
  municipalsId: string;
  purokNumber: string;
  purokDraftedVotersCount: number;
  draftID: string;
  data: DraftedPurok[];
  selectedID: string[];
  setSelectedID: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  //const [isChecked, setIsChecked] = useState<boolean>(false);
  const [purokName, setPurokName] = useState<string>("");

  console.log(selectedID);

  const handleSaveID = () => {
    console.log("Click");

    const matchedIndex = selectedID.findIndex((item) => item === props.id);
    const listCopy = [...selectedID];

    if (matchedIndex !== -1) {
      listCopy[matchedIndex] = "";
    } else {
      // Add item to the list
      listCopy.push(props.id);
    }

    setSelectedID(listCopy.filter((item) => item));
  };

  const handleCheckID = () => {
    const matchedIndex = selectedID.findIndex((item) => item === props.id);

    if (matchedIndex !== -1) {
      return true;
    }
    return false;
  };

  const [changePurokName, { loading }] = useMutation(CHANGE_PUROK_NAME, {
    refetchQueries: [GET_DRAFTPUROK],
  });

  const handleCHangeName = async () => {
    if (!purokName) return;
    try {
      const response = await changePurokName({
        variables: {
          purok: {
            id: props.id,
            value: purokName,
          },
        },
      });
      if (response.data) {
        toast("Change success!");
        setPurokName("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      onClick={handleSaveID}
      className={`w-full p-2 border rounded cursor-pointer ${
        handleCheckID() ? `bg-slate-300 border-slate-900` : ""
      }`}
    >
      <h1 className="font-semibold text-slate-800">{props.purokNumber}</h1>
      <div className="flex gap-2 items-center">
        <FaPeopleGroup />
        <h1 className="">{props.purokDraftedVotersCount}</h1>
      </div>

      <div className="w-full p-2 flex items-center justify-end gap-2">
        <Popover>
          <PopoverTrigger>
            <div className="p-1 border rounded cursor-pointer hover:border-gray-700">
              <CiEdit />
            </div>
          </PopoverTrigger>

          <PopoverContent className="w-full flex flex-col gap-2">
            <Input
              placeholder={props.purokNumber}
              value={purokName}
              onChange={(e) => setPurokName(e.target.value)}
            />
            <Button onClick={handleCHangeName} disabled={loading}>
              {loading ? "Please wait..." : "Save"}
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default EditPurok;
