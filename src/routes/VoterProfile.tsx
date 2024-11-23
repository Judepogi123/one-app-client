/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
//lib
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";

//ui
// import { Input } from "../components/ui/input";
// import {
//   Form,
//   FormField,
//   FormControl,
//   FormLabel,
//   FormItem,
// } from "../components/ui/form";
import {
  Tabs,
  TabsContent,
  TabsTrigger,
  TabsList,
} from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import Img from "../components/custom/Img";
//queries
import { GET_VOTERS_PROFILE } from "../GraphQL/Queries";
import { REMOVE_VOTER } from "../GraphQL/Mutation";
//porps
import { VotersProps } from "../interface/data";

//helper
import { handleLevel } from "../utils/helper";
import Modal from "../components/custom/Modal";
import { toast } from "sonner";

//icons
import { IoQrCodeOutline } from "react-icons/io5";

const VoterProfile = () => {
  const { voterID } = useParams();

  const navigate = useNavigate();
  const [onRemove, setOnRemove] = useState(false);
  const [openModal, setOpenModal] = useState<number>(0);

  const { data, loading } = useQuery<{ voter: VotersProps }>(
    GET_VOTERS_PROFILE,
    {
      variables: {
        id: voterID as string,
      },
      fetchPolicy: "no-cache",
    }
  );
  const [removeVoter, { loading: removing }] =
    useMutation(REMOVE_VOTER);

  if (loading) {
    return (
      <div className="w-full h-auto grid">
        <h1 className="m-auto">Loading....</h1>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="">
        <h1 className="">No voter's found for this ID: {voterID}</h1>
      </div>
    );
  }

  const handleRemoveVoter = async () => {
    if (!data) {
      toast("Remove failed.", {
        description: "Required voter ID is missing.",
      });
    }

    const repsonses = await removeVoter({
      variables: {
        id: data.voter.id,
      },
    });
    if (repsonses.errors) {
      toast("Remove failed!");
      return;
    }

    if (repsonses.data) {
      navigate(`/manage/update`);
      return;
    }
  };

  return (
    <div className="w-full h-auto">
      <div className="flex gap-2 justify-end p-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setOpenModal(1);
          }}
        >
          <IoQrCodeOutline fontSize={20} />
        </Button>
        <Button variant="outline" size="sm">
          Update
        </Button>
        <Button
          onClick={() => setOnRemove(true)}
          variant="destructive"
          size="sm"
        >
          Remove
        </Button>
      </div>
      <div className="flex w-full p-2">
        <div className="w-full h-auto">
          <div className="w-full p-2">
            <h1 className="font-medium text-slate-600 text-xl">
              Voter's Basic Information
            </h1>
          </div>
          <div className="w-full flex">
            <h1 className="w-1/6 font-medium text-lg ml-4">Lastname:</h1>
            <h1>{data.voter.lastname}</h1>
          </div>
          <div className="w-full flex">
            <h1 className="w-1/6 font-medium text-lg ml-4">Firstname:</h1>
            <h1>{data.voter.firstname}</h1>
          </div>
          <div className="w-full flex">
            <h1 className="w-1/6 font-medium text-lg ml-4">Gender:</h1>
            <h1>{data.voter.gender || "Unknown"}</h1>
          </div>
          <div className="w-full flex">
            <h1 className="w-1/6 font-medium text-lg ml-4">Birthday:</h1>
            <h1>{data.voter.birthYear || "Unknown"}</h1>
          </div>
          <div className="w-full p-2">
            <h1 className="font-medium text-slate-600 text-xl">Status</h1>
          </div>
          <div className="w-full flex items-center p-2">
            <h1 className="w-1/5 font-medium text-lg ml-4">:</h1>
            <h1 className=" capitalize">{data.voter.saveStatus || "Unkown"}</h1>
          </div>
          <div className="w-full flex items-center p-2">
            <h1 className="w-1/5 font-medium text-lg ml-4">Level:</h1>
            <h1 className=" capitalize">{handleLevel(data.voter.level)}</h1>
          </div>
        </div>

        <div className="w-full h-auto">
          <div className="w-full p-2">
            <h1 className="font-medium text-slate-600 text-xl">
              Voter's Locale
            </h1>
          </div>
          <div className="w-full flex items-center">
            <h1 className="w-1/5 font-medium text-lg ml-4">Purok:</h1>
            <h1>{data.voter.purok?.purokNumber || "Unkown"}</h1>
          </div>
          <div className="w-full flex items-center">
            <h1 className="w-1/5 font-medium text-lg ml-4">Barangay:</h1>
            <h1>{data.voter.barangay.name}</h1>
          </div>
          <div className="w-full flex items-center">
            <h1 className="w-1/5 font-medium text-lg ml-4">Municipality:</h1>
            <h1>{data.voter.municipal.name || "Unknown"}</h1>
          </div>
          <div className="w-full p-2">
            <h1 className="font-medium text-slate-600 text-lg">Others:</h1>
          </div>
          <div className="w-full flex items-center">
            <h1 className="w-1/5 font-medium text-lg ml-4">Hub:</h1>
            <h1>{data.voter.hubId || "Unknown"}</h1>
          </div>
        </div>
      </div>

      <Modal
        title={`Remove ${data.voter.lastname}, ${data.voter.firstname}`}
        children={
          <h1 className="text-red-500 font-medium">
            Are you sure you want to perform this action? This cannot be undo
            afterwards
          </h1>
        }
        footer={true}
        open={onRemove}
        onFunction={handleRemoveVoter}
        onOpenChange={() => {
          if (removing) {
            return;
          }
          setOnRemove(false);
        }}
        loading={removing}
      />
      <Modal
        title="QR codes"
        open={openModal === 1}
        onOpenChange={() => {
          setOpenModal(0);
        }}
        children={
          <Tabs >
            <TabsList defaultValue="1">
              <TabsTrigger value="1">STAMP 1</TabsTrigger>
              <TabsTrigger value="2">STAMP 2</TabsTrigger>
            </TabsList>

          {data.voter.qrCodes.map((item, i)=> (
            <TabsContent value={`${i + 1}`}>
              <Img src={item.qrCode as string} local={undefined} name={""}/>
            </TabsContent>
          ))}
          </Tabs>
        }
      />
    </div>
  );
};

export default VoterProfile;
