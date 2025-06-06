/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ADD_MEMBERS } from "../GraphQL/Mutation";
import { GET_TEAM_INFO } from "../GraphQL/Queries";
import { useMutation } from "@apollo/client";
//props
import { VotersProps } from "../interface/data";

//layout
import SearchVoters from "./SearchVoters";
import { toast } from "sonner";
import { Button } from "../components/ui/button";

//props
interface Props {
  level: number;
  head: string;
  setOnOpenModal: React.Dispatch<React.SetStateAction<number>>;
  barangaysId?: string;
}

const AddMembers = ({ level, head, setOnOpenModal, barangaysId }: Props) => {
  const [selectedList, setSelectedList] = useState<VotersProps[]>([]);
  const [selectedVoter, setSelectedVoter] = useState<VotersProps | undefined>(
    undefined
  );

  const { teamId } = useParams();

  const handleRemoveVoters = (id: string) => {
    setSelectedList(selectedList.filter((item) => item.id !== id));
    setSelectedVoter(undefined);
  };

  useEffect(() => {
    setSelectedVoter(undefined);
  }, []);

  useEffect(() => {
    if (!selectedVoter) return;

    const main = async () => {
      const listCopy = [...selectedList];
      const matchedIndex = listCopy.findIndex(
        (item) => item.id === selectedVoter.id
      );

      // Avoid duplicates
      if (matchedIndex === -1) {
        listCopy.push(selectedVoter);
        setSelectedList(listCopy);
      }
    };

    main();
  }, [selectedVoter, selectedList]);

  const [addMember, { loading, error }] = useMutation(ADD_MEMBERS, {
    refetchQueries: [GET_TEAM_INFO],
    variables: { id: teamId },
  });

  useEffect(() => {
    if (loading) {
      setOnOpenModal(4);
      return;
    }
  }, [loading]);

  const handleAddTema = async () => {
    if (!teamId) return;
    if (selectedList.length === 0) {
      toast("Select at least one voter as member");
      return;
    }

    const teamIdList = selectedList.map((item) => {
      return {
        id: item.id,
        firstname: item.firstname,
        lastname: item.lastname,
        status: item.status ?? 0,
        level: item.level,
        barangaysId: item.barangaysId || "",
        municipalsId: item.municipalsId || 0,
        purokId: item.purok?.id as string,
      };
    });
    const response = await addMember({
      variables: {
        headId: head,
        teamIdList,
        level: level - 1,
        teamId,
      },
    });
    if (error) {
      toast.error("Failed to add team", {
        description: error.message,
        className: "text-red-500 font-semibold",
        closeButton: false,
      });
      return;
    }
    if (response.data) {
      toast.success("Success", {
        closeButton: false,
      });
      return;
    }
  };

  return (
    <div className="w-full h-auto overflow-auto">
      <div className="w-full">
        <SearchVoters
          selectedVoter={selectedVoter}
          setSelectedVoter={setSelectedVoter}
          level={0}
          barangaysId={barangaysId}
        />
      </div>
      <div className="w-full h-auto flex flex-col">
        {selectedList &&
          selectedList.map((voter) => (
            <div key={voter.id} onClick={() => handleRemoveVoters(voter.id)}>
              <h1 className="font-medium hover:underline cursor-pointer">
                {voter.firstname} {voter.lastname}
              </h1>
            </div>
          ))}
      </div>
      <div className="">
        <Button onClick={handleAddTema} disabled={loading} size="sm">
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default AddMembers;
