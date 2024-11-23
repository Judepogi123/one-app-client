import { useState, useEffect } from "react";

//url
import { localhost } from "../api/axios";
import useCancelToken from "../utils/useCancelToken";
//lib
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import { isCancel } from "axios";
import { io } from "socket.io-client";
import z from "zod";
//ui
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
} from "../components/ui/table";
import { toast } from "sonner";
import Alert from "../components/custom/Alert";
import Modal from "../components/custom/Modal";
//queries
//type
import { ExcelResponse } from "../interface/data";
import { UploadProps } from "../interface/data";
//icon
import { VscOpenPreview } from "react-icons/vsc";
import { CiWarning } from "react-icons/ci";

//props
import { DraftSchema } from "../zod/data";

//utils
type DraftType = z.infer<typeof DraftSchema>;

interface DraftReq {
  draftData: DraftType;
}

const socket = io(localhost);

const Upload = ({ draftData }: DraftReq) => {
  const { draftID } = useParams();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [onError, setOnError] = useState<string | null>(null);
  const [data, setData] = useState<ExcelResponse>({});
  const [draftCounter, setDraftCounter] = useState<number | null>(null);
  const [onViewCounter, setOnViewCounter] = useState<boolean>(false);
  const [prevLoading, setPrevLoading] = useState<boolean>(false);

  // Initialize the cancel token using useCancelToken hook
  const { cancelRequest } = useCancelToken(`${localhost}/draft`);

  console.log(data);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      console.log(event.target.files[0]);
    }
  };

  const handleFileUpload = async (): Promise<void> => {
    if (!selectedFile) return;
    if (!draftData.municipal && !draftData.barangay) {
      toast("Municipal and Barangay ID error!");
      return;
    }
    setPrevLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("barangayId", `${draftData.barangay.id}`);
    formData.append("zipCode", `${draftData.municipal.id}`);
    formData.append("draftID", `${draftID}`);
    try {
      const response = await axios.post<ExcelResponse>(
        "upload/file",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setData(response.data);
    } catch (error) {
      if (isCancel(error)) {
        setOnError("Upload canceled by user.");
      } else {
        setOnError(`${error}`);
      }
    } finally {
      setPrevLoading(false);
    }
  };

  useEffect(() => {
    socket.on("draftedCounter", (count) => {
      setOnViewCounter(true);
      setDraftCounter(count);
      console.log(count);
    });

    if (Object.values(data).flat().length === draftCounter) {
      setOnViewCounter(false);
    }

    return () => {
      socket.off("draftedCounter");
    };
  }, [draftCounter, data]);

  const handleSaveDraft = async () => {
    if (!data) {
      toast("Invalid data!");
      return;
    }

    try {
      const response = await axios.post("upload/draft", {
        data: data,
        zipCode: draftData.municipal.id,
        barangayId: draftData.barangay.id,
        draftID: draftID,
      });
      if (response.status === 200) {
        console.log(response.data);
        return;
      }
      setOnError(`${response.data}`);
    } catch (error) {
      console.log(error);
      setOnError(`${error}`);
    }
  };

  console.log(data);

  return (
    <div className=" w-full h-auto relative">
      <div className="w-full flex justify-between gap-2 p-3 sticky top-12 bg-[#ffffff] z-20">
        <div className="w-auto flex gap-2">
          <Button
            className="w-auto flex gap-2"
            size="sm"
            onClick={handleFileUpload}
          >
            <VscOpenPreview />
            Preview
          </Button>
          <Input
            className=""
            accept="xlsx"
            onChange={handleFileChange}
            type="file"
          />

          <div className="w-auto p-1 px-2 border flex items-center rounded">
            <CiWarning />0
          </div>
        </div>

        <div className=" w-auto flex gap-2">
          <Button size="sm" variant="outline">
            Edit
          </Button>
          <Button size="sm" onClick={handleSaveDraft}>
            Draft
          </Button>
        </div>
      </div>
      {onError && (
        <div className="w-full px-8">
          <Alert
            title="An error occured"
            desc="Sorry something went wrong, please report to the developers. Try to refresh the page."
            variant="destructive"
          />
        </div>
      )}
      {prevLoading ? (
        <div className="w-full p-4">
          <h2 className=" font-semibold text-xl text-center">Please wait...</h2>
        </div>
      ) : (
        <Table className=" w-full px-4">
          <TableHeader className="w-full z-10 bg-white">
            {[
              "Lastname",
              "Firstname",
              "Gender",
              "Birthday",
              "Purok",
              "Dead",
              "PWD",
              "IL",
              "INC",
              "OR",
              "18-30",
            ].map((item, index) => (
              <TableHead key={index} className="sticky top-0 bg-white z-10">
                {item}
              </TableHead>
            ))}
          </TableHeader>
          {Object.keys(data).length > 0 &&
            Object.keys(data).map((sheetName) => (
              <TableBody className=" overflow-y-auto">
                {data[sheetName].map((row: UploadProps, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.lastname}</TableCell>
                    <TableCell>{row.firstname}</TableCell>
                    <TableCell>{row.Gender}</TableCell>
                    <TableCell>{row.Birthday}</TableCell>
                    <TableCell>{row.Address}</TableCell>
                    <TableCell>{row.DL}</TableCell>
                    <TableCell>{row.PWD}</TableCell>
                    <TableCell>{row.IL}</TableCell>
                    <TableCell>{row.INC}</TableCell>
                    <TableCell>{row.OR}</TableCell>
                    <TableCell>{row["18-30"]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ))}
        </Table>
      )}
      <Modal
        title={`Saving as draft`}
        open={onViewCounter}
        onOpenChange={() => {
          setOnViewCounter(false);
        }}
        children={
          <div className="w-full">
            <h1 className="">
              Please wait {draftCounter}/{Object.values(data).flat().length}
            </h1>
            <div className="w-full flex justify-end">
              <Button variant="destructive" onClick={cancelRequest}>
                {" "}
                {/* Cancel button */}
                Cancel
              </Button>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default Upload;
