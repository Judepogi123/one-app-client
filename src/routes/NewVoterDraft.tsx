/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";

//lib
import {  useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
//import z from "zod";
//ui
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import NewVoterBatch from "../components/item/NewVoterBatch";
import Modal from "../components/custom/Modal";
import { toast } from "sonner";
//icon
import { IoIosAddCircleOutline } from "react-icons/io";

//query
import { GET_DRAFT } from "../GraphQL/Queries";
import { DRAFT_MUTATION } from "../GraphQL/Mutation";

//props
//import { DraftSchema } from "../zod/data";
import { DraftedBatchProps } from "../interface/data";
//type BatchType = z.infer<typeof DraftSchema>;

const NewVoterDraft = () => {
  const [selectedDraft, setSelectedDraft] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const { data, loading } = useQuery<{
    drafts: DraftedBatchProps[];
  }>(GET_DRAFT);

  const [removeDraft] = useMutation<{ id: string }>(DRAFT_MUTATION, {
    refetchQueries: [
      {
        query: GET_DRAFT,
      },
    ],
  });

  const handleRemoveDraft = async () => {
    setIsLoading(true);
    try {
      const { data } = await removeDraft({
        variables: {
          id: selectedDraft,
        },
      });
      if (data) {
        setSelectedDraft(null);
        toast("Delete successful!");
        return;
      }
    } catch (error) {
      toast(`Sorry something went wrong: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  console.log(data);
  

  return (
    <div className="w-full p-2 ">
      <div className="w-full p-2 flex justify-between items-center lg:px-24">
        <h1 className="lg:text-lg font-semibold">Drafted</h1>
        <div className="">
          <Button>Select</Button>
        </div>
      </div>
      <div className="w-full p-2 lg:px-24 grid grid-cols-4 gap-2">
        <div
          onClick={() => navigate("/manage/new")}
          className="w-full h-28 border rounded flex flex-col justify-center item-center cursor-pointer"
        >
          <div className="w-auto p-2 text-center">
            <IoIosAddCircleOutline fontSize={40} />
            <h1 className="text-lg font-semibold">New</h1>
          </div>
        </div>
        {loading && !data ? (
          <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </>
        ) : (
          data && data.drafts.filter((item)=> item.drafted).map((item) => (
            <NewVoterBatch
              key={item.id}
              {...item}
              setSelectedDraft={setSelectedDraft}
            />
          ))
        )}
      </div>

      <Modal
        loading={isLoading}
        onFunction={handleRemoveDraft}
        title="Delete this draft?"
        footer={true}
        open={selectedDraft ? true : false}
        onOpenChange={() => {
          if (isLoading) {
            return;
          }
          setSelectedDraft(null);
        }}
      />
    </div>
  );
};

export default NewVoterDraft;
