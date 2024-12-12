import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
//ui
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
} from "../components/ui/table";
import UpdateVoterForm from "../layout/UpdateVoterForm";
import BarangaySel from "../components/custom/BarangaySel";
import MunicipalSel from "../components/custom/MunicipalSel";
import Modal from "../components/custom/Modal";
import Validation from "../layout/Validation";
//icons
import { FaRegFileExcel } from "react-icons/fa";
import { CiFileOff } from "react-icons/ci";
import { MdOutlineCloudUpload } from "react-icons/md";
import { TbManualGearbox } from "react-icons/tb";
import { GrValidate } from "react-icons/gr";
import { CiViewList } from "react-icons/ci";

import { Input } from "../components/ui/input";
import axios, { production } from "../api/axios";
import { toast } from "sonner";

//props
import { RejectListProps } from "../interface/data";

const socket = io(production);
const UpdateVoterList = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [onOpenModal, setOnOpenModal] = useState(0);
  const [isLoading, setIsLoading] = useState(0);
  const [data, setData] = useState<{
    results: RejectListProps[];
    percent: number;
    totalAreaVoters: number;
    totalValidatedVoter: number;
  } | null>(null);
  const [updateCounter, setUpdateCounter] = useState<number>(0);
  const [params, setParams] = useSearchParams({
    municipal: "",
    barangay: "none",
  });

  const currentMunicipal = params.get("municipal");
  const currentBarangay = params.get("barangay") || "none";
  const naviagate = useNavigate();

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleFileUpload = async (): Promise<void> => {
    if (!selectedFile) return;
    if (currentMunicipal === "none" || currentBarangay === "none") {
      toast("Select area first!", {
        closeButton: false,
      });
      return;
    }
    setIsLoading(1);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("zipCode", currentMunicipal as string);
    formData.append("barangayId", currentBarangay as string);
    try {
      const response = await axios.post("upload/update-voters", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        setData(response.data);
        const parsedData = JSON.stringify(response.data, null, 2);
        console.log("Data: ", parsedData);
        return;
      }
      setData(null);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(0);
    }
  };

  const handleChangeArea = (value: string, key?: string) => {
    if (!key || !value) return;
    setParams(
      (prev) => {
        prev.set(key, value);
        return prev;
      },
      {
        replace: true,
      }
    );
  };

  useEffect(() => {
    socket.emit("updateVoterCounter", (counter: number) => {
      setOnOpenModal(1);
      setUpdateCounter(counter);
      console.log(counter);
    });
    if (data && Object.values(data).flat().length === updateCounter) {
      setOnOpenModal(0);
    }
    return () => {
      socket.off("updateVoterCounter");
    };
  }, [data]);

  return (
    <div className="w-full h-auto">
      <div className="w-full flex justify-end items-center p-2 gap-2 border border-gray-300">
        <Button
          onClick={() => {
            naviagate(`/manage/update/voter-list/validation-list`);
          }}
          className=" absolute left-0 ml-2"
        >
          <CiViewList fontSize={18} />
        </Button>
        <MunicipalSel
          handleChangeArea={handleChangeArea}
          defaultValue="none"
          value={currentMunicipal as string}
        />
        <BarangaySel
          value={currentBarangay}
          zipCode={currentMunicipal as string}
          handleChangeArea={handleChangeArea}
          className="ml-2 gap-2"
        />
        {currentBarangay !== "none" && (
          <div className="w-auto p-2">
            <Button
              onClick={() => {
                setOnOpenModal(2);
              }}
              variant="outline"
            >
              <GrValidate fontSize={20} />
            </Button>
          </div>
        )}

        <Input
          onChange={handleFileChange}
          className="w-auto flex gap-2 border border-slate-300 hover:border-slate-500 cursor-pointer"
          type="file"
          placeholder="Select file"
        />
        {selectedFile && (
          <>
            <Button
              onClick={() => {
                if (!selectedFile) {
                  return;
                }
                setSelectedFile(null);
              }}
              className="w-auto flex gap-2"
              type="button"
              variant="destructive"
            >
              <FaRegFileExcel />
              Remove file
            </Button>
            <Button
              onClick={() => {
                if (!selectedFile) {
                  return;
                }
                setOnOpenModal(1);
              }}
              className="w-auto flex gap-2"
              type="button"
            >
              <MdOutlineCloudUpload />
              Upload
            </Button>
          </>
        )}
        <Button className="w-auto flex gap-2">
          <TbManualGearbox /> Manual
        </Button>
      </div>
      <div className="w-full p-2 text-center">
        <h1 className="font-mono font-medium text-sm">or</h1>
      </div>
      {!selectedFile && (
        <div className="w-full p-2">
          <UpdateVoterForm />
        </div>
      )}
      {data && (
        <>
          <div className="w-auto p-2 border rounded bg-white shadow">
            <h1 className="text-lg font-medium text-gray-900">
              Report summary
            </h1>
            <div className="w-auto flex items-center gap-2">
              <h1 className="text-sm">Total area voters: </h1>
              <h1 className="text-sm font-medium">{data.totalAreaVoters}</h1>
            </div>
            <div className="text-sm w-auto flex items-center gap-2">
              <h1>Validated voters: </h1>
              <h1 className="font-medium">{data.totalValidatedVoter}</h1>
            </div>
            <div className="text-sm w-auto flex items-center gap-2">
              <h1>Validated voters percentage: </h1>
              <h1 className="font-medium">{data.percent}%</h1>
              <h1 className="">of the total area voters.</h1>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableHead>Lastname</TableHead>
              <TableHead>Firstname</TableHead>
              <TableHead>Result</TableHead>
            </TableHeader>
            <TableBody>
              {data.results.map((item, i) => (
                <TableRow key={i}>
                  <TableCell>{item.lastname}</TableCell>
                  <TableCell>{item.firstname}</TableCell>
                  <TableCell>{item.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}

      <Modal
        footer={true}
        loading={isLoading === 1}
        onFunction={handleFileUpload}
        title="Upload excel file?"
        open={onOpenModal === 1}
        onOpenChange={() => {
          if (isLoading === 1) return;
          setOnOpenModal(0);
        }}
        children={
          isLoading === 1 && (
            <div className="flex flex-col gap-1">
              <div className="flex gap-2">
                <div className="text-center">
                  <CiFileOff className="text-gray-400 w-8 h-8" />
                </div>
                <div className="text-center">
                  <p className="text-gray-600 text-sm">
                    Uploading file... Please wait({updateCounter}/
                    {data?.results.flat().length}).
                  </p>
                </div>
              </div>
              <div className="flex justify-center gap-2">
                <div className="spinner-border text-gray-400" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            </div>
          )
        }
      />

      <Modal
        className="max-w-3xl max-h-96 overflow-auto p-8"
        title="Validation Records"
        children={<Validation barangayId={currentBarangay} />}
        open={onOpenModal === 2}
        onOpenChange={() => {
          setOnOpenModal(0);
        }}
      />
    </div>
  );
};

export default UpdateVoterList;
