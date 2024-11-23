import { SELECTED_DRAFT } from "../GraphQL/Queries";
//lib
import { useSearchParams, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import z from "zod";
//layout
import NewVoterForm from "../layout/NewVoterForm";
import Upload from "../layout/Upload";
//ui
import { Button } from "../components/ui/button";

//props
import { DraftSchema } from "../zod/data";

//icon
import { SiMicrosoftexcel } from "react-icons/si";
import { FaRegHandPaper } from "react-icons/fa";
import DraftedVoter from "./DraftedVoter";
import { LiaDraftingCompassSolid } from "react-icons/lia";

type DraftType = z.infer<typeof DraftSchema>;

const AddNewVoter = () => {
  const [params, setSearchParams] = useSearchParams({ method: "manual" });
  const currentMethod = params.get("method");

  const { draftID } = useParams();

  const { data, loading, error } = useQuery<{ draft: DraftType }>(
    SELECTED_DRAFT,
    {
      variables: { id: draftID },
    }
  );
  
  
  const handleChangeMethod = (value: string) => {
    setSearchParams(
      (prev) => {
        prev.set("method", value);
        return prev;
      },
      {
        replace: true,
      }
    );
  };

  if(loading){
    return <div className="w-full p-2">
      <h1 className="">Loading...</h1>
    </div>
  }

  const handleRenderMethod = () => {
    switch (currentMethod) {
      case "manual":
        return <NewVoterForm />;
      case "upload":
        return <Upload draftData={data?.draft as DraftType} />;
      case "drafted":
        return <DraftedVoter draftData={data?.draft as DraftType} />;
      default:
        return <NewVoterForm />;
    }
  };

  if (error && data) {
    return (
      <div className="">
        <h1 className="text-red-600 font-semibold text-xl">
          Failed to load the draft the data!
        </h1>
      </div>
    );
  }
  return (
    <div className="w-full h-full">
      <div className="w-full px-3 ">
        {data && <h1 className="font-semibold text-lg ">{data.draft.municipal.name}-{data.draft.barangay.name}</h1>}
      </div>
      <div className="w-full p-2 flex gap-1 sticky top-0 bg-[#ffffff] z-20">
        <Button
          onClick={() => handleChangeMethod("manual")}
          variant={currentMethod === "manual" ? "default" : "outline"}
          size="sm"
          className="w-auto flex gap-2"
        >
          <FaRegHandPaper />
          Manually
        </Button>
        <Button
          onClick={() => handleChangeMethod("upload")}
          variant={currentMethod === "upload" ? "default" : "outline"}
          size="sm"
          className="w-auto flex gap-2"
        >
          <SiMicrosoftexcel /> File upload
        </Button>

        <Button
          onClick={() => handleChangeMethod("drafted")}
          variant={currentMethod === "drafted" ? "default" : "outline"}
          size="sm"
          className="w-auto flex gap-2"
        >
          <LiaDraftingCompassSolid /> Slug
        </Button>
      </div>
      <div className="w-full">{handleRenderMethod()}</div>
    </div>
  );
};

export default AddNewVoter;
