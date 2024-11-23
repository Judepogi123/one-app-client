/* eslint-disable @typescript-eslint/no-unused-vars */
//icon
import { MdDeleteOutline } from "react-icons/md";
//lib
import { useNavigate } from "react-router-dom";
//import z from "zod";
//utils
import { formatTimestamp } from "../../utils/date";
//props
import {
  BarangayProps,
  MunicipalProps,
} from "../../interface/data";

interface BatchProps {
  timestamp: string;
  id: string;
  barangay: BarangayProps;
  municipal: MunicipalProps;
  setSelectedDraft: React.Dispatch<React.SetStateAction<string | null>>;
}

const NewVoterBatch = ({
  id,
  barangay,
  municipal,
  timestamp,
  setSelectedDraft,
}: BatchProps) => {
  const navigate = useNavigate();

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedDraft(id);
  };

  return (
    <div
      onClick={() => navigate(`/manage/draft/${id}`)}
      className=" w-full h-28 border p-2 lg:p-3 flex flex-col justify-between cursor-pointer"
    >
      <div>
        <h1 className="font-semibold text-lg">{barangay.name}</h1>
        <h1 className="text-sm font-semibold">{municipal.name}</h1>
      </div>
      <div className="w-full flex justify-between items-center">
        <h1 className="font-normal text-sm">{formatTimestamp(timestamp)}</h1>
        <div
          className="w-auto p-1 border rounded hover:border-gray-600 z-10"
          onClick={(e) => handleDeleteClick(e, id)}
        >
          <MdDeleteOutline />
        </div>
      </div>
    </div>
  );
};

export default NewVoterBatch;
