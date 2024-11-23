/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
//ui
import { Button } from "../components/ui/button";
import Modal from "../components/custom/Modal";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Img from "../components/custom/Img";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "../components/ui/table";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../components/ui/popover";
//graphql
import { useMutation, useQuery } from "@apollo/client";
import {
  GENERATE_TEAM_QRCODE,
  REMOVE_MULTI_QROCODE,
} from "../GraphQL/Mutation";
import { GET_TEAM_INFO } from "../GraphQL/Queries";
import { toast } from "sonner";

//props
import { TeamProps } from "../interface/data";

//icons
import { FaEllipsisVertical } from "react-icons/fa6";
import { exportPDF } from "../utils/generate";
import { GoVerified } from "react-icons/go";
import { handleLevel } from "../utils/helper";
//imp
//import { exportPDF } from "../utils/generate";

const GroupQR = () => {
  const [selectedList, setSelectedList] = useState<string[]>([]);
  const [onOpenModal, setOnOpenModal] = useState(0);
  const { teamId } = useParams();

  const [generatedTeamQRCode, { loading, error }] = useMutation(
    GENERATE_TEAM_QRCODE,
    {
      refetchQueries: [GET_TEAM_INFO],
      variables: {
        teamId: teamId,
      },
    }
  );

  const [removeQRcode, { loading: multiRemoving }] = useMutation(
    REMOVE_MULTI_QROCODE,
    {
      refetchQueries: [GET_TEAM_INFO],
      variables: {
        teamId: teamId,
      },
    }
  );

  const handleMutilRemoveQRcode = async () => {
    if (!selectedList.length) {
      toast("No Voter selected");
      return;
    }
    const response = await removeQRcode({
      variables: {
        id: selectedList,
      },
    });

    if (response.errors) {
      toast("Multi-remove failed");
      return;
    }
    if (response.data) {
      toast("Multi-remove success");
      setSelectedList([]);
    }
  };

  const handleGenerateTeamQRCode = async () => {
    const response = await generatedTeamQRCode({ variables: { id: teamId } });
    if (response.errors) {
      toast("Could not generate team");
      return;
    }
    if (response.data) {
      toast("Successfully generated QR code");
    }
  };
  return (
    <div className="w-full">
      <div className="w-full flex justify-end p-2">
        <Popover>
          <PopoverTrigger>
            <div className="border hover:border-gray-400 rounded p-2">
              <FaEllipsisVertical />
            </div>
          </PopoverTrigger>
          <PopoverContent className="flex flex-col gap-1">
            {/* <Button variant="outline" onClick={() => exportPDF("Jay.pdf")}>
              Export PDF
            </Button> */}
            <Button onClick={handleGenerateTeamQRCode}>
              {loading ? "Loading" : "Generate QR Code"}
            </Button>
            {selectedList.length > 0 && (
              <Button onClick={() => setOnOpenModal(1)} variant="outline">
                {multiRemoving ? "Please wait..." : "Multi-remove"}
              </Button>
            )}
            <Button variant="outline" onClick={() => exportPDF("try.pdf")}>
              Print
            </Button>
          </PopoverContent>
        </Popover>
      </div>

      <VotersList
        selectedList={selectedList}
        setSelectedList={setSelectedList}
        teamId={teamId}
      />
      <Modal
        title="Remove selected Voters' QR code"
        children={
          <>
            <h1 className="">Continue? Cannot undo this action afterwards?</h1>
          </>
        }
        loading={multiRemoving}
        footer={true}
        onFunction={handleMutilRemoveQRcode}
        open={onOpenModal === 1}
        onOpenChange={() => {
          if (multiRemoving) {
            return;
          }
          setOnOpenModal(0);
        }}
      />
    </div>
  );
};

export default GroupQR;

const VotersList = ({
  teamId,
  selectedList,
  setSelectedList,
}: {
  teamId: string | undefined;
  setSelectedList: React.Dispatch<React.SetStateAction<string[]>>;
  selectedList: string[];
}) => {
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const { data, loading } = useQuery<{ team: TeamProps | null }>(
    GET_TEAM_INFO,
    {
      variables: {
        id: teamId,
      },
      skip: !teamId,
    }
  );

  //
  const handleSelectVoter = (id: string) => {
    setSelectedList((prevSelectedList) => {
      if (prevSelectedList.includes(id)) {
        // If voter is already in the list, remove them
        return prevSelectedList.filter((voterId) => voterId !== id);
      } else {
        // If voter is not in the list, add them
        return [...prevSelectedList, id];
      }
    });
  };

  //Check if the voter is selected
  const handleIncluded = (id: string): boolean => selectedList.includes(id);

  useEffect(() => {
    const main = () => {
      if (!data?.team?.voters) {
        return;
      }
      if (selectAll) {
        const voters: string[] = data?.team?.voters.map(
          (voter) => voter.id as string
        );
        setSelectedList(voters);
      } else {
        setSelectedList([]);
      }
    };
    main();
  }, [selectAll]);

  const handleMutilRemoveQR = () => {};

  if (loading) {
    return (
      <div className="w-full h-1/2 grid">
        <h1 className="m-auto">Loading...</h1>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full h-1/2 grid">
        <h1 className="m-auto">Team unfound!</h1>
      </div>
    );
  }

  return (
    <div className="w-full" id="qr-container">
      {/* <Table id="qr-container">
        <TableHeader>
          <TableHead>Voter</TableHead>
          <TableHead>Stamp 1</TableHead>
          <TableHead>Stamp 2</TableHead>
        </TableHeader>
        <TableBody>
          {data.team?.voters.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.firstname}</TableCell>
              <TableCell>
                {item.qrCodes.map((code) => (
                  <TableCell className=" flex-1">
                    <h1>{code.number}</h1>
                    <Img src={code.qrCode} local={undefined} name={""} />
                  </TableCell>
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table> */}
      <div className="w-full px-2 py-3">
        <h1>{data.team?.teamLeader?.voter?.lastname}, {data.team?.teamLeader?.voter?.firstname}</h1>
        <h1 className="text-sm font-mono font-medium italic">
          {data?.team?.barangay.name} {handleLevel(data?.team?.level as number)}
        </h1>
      </div>

      <div
        className="w-full h-auto p-2 flex flex-col gap-[2px]"
      >
        {data.team?.voters.map((voter) => (
          <div
            key={voter.id}
            onClick={() => handleSelectVoter(voter.id)}
            className={`w-full border border-dotted  flex justify-between ${
              handleIncluded(voter.id)
                ? "bg-slate-200 border-green-500"
                : "border-rose-900"
            }`}
          >
            <div className="w-1/3 h-full flex p-2">
              <h1 className="font-medium mr-2">{voter.qrCodeNumber}.</h1>
              <h1>{voter.lastname},</h1>
              <h1>{" "}{voter.firstname}</h1>
            </div>
            <div className="w-2/3 flex ">
              {voter.qrCodes.map((code) => (
                <div
                  key={code.id}
                  className={`w-1/2 flex border border-dashed border-gray-600 rounded border-r-black`}
                >
                  <div className="w-1/4 p-2">
                    <Img
                      className="w-24 h-24"
                      src={code.qrCode}
                      local={undefined}
                      name={"QRcode"}
                    />
                  </div>

                  <div className="w-2/4 h-full grid p-2 py-2">
                    <div className="w-full m-auto text-center">
                      <h1 className="font-medium font-mono text-sm">
                        STAMP {code.stamp}
                      </h1>
                      <h1 className="text-sm">1. Instruction</h1>
                      <h1 className="text-sm">2. Instruction</h1>
                      <h1 className="text-sm">3. Instruction</h1>
                      <h1 className="text-sm">4. .......</h1>
                      {/* <h1 className="text-xs font-medium">{code.scannedDateTime === "N/A" && `Scanned Date: ${"Nov. 22,2024"}`}</h1> */}
                    </div>
                  </div>
                  <div className="w-1/4 p-2  flex justify-center items-center">
                    <div className="w-full h-full grid bg-slate-200 rounded-l-full">
                      <h1 className="text-center text-xl m-auto font-medium font-mono text-gray-800 p-1">
                        {code.number}
                      </h1>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
