import { useEffect, useState } from "react";
//lib
import { useQuery } from "@apollo/client";
import {
  //useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useUserData } from "../provider/UserDataProvider";
//query
import {
  //GET_ALL_COLL,
  GET_BARANGAY_STAB,
} from "../GraphQL/Queries";
//ui
import { Button } from "../components/ui/button";
import Modal from "../components/custom/Modal";
import NewCollBatchForm from "../layout/NewCollBatchForm";
// import AreaSelection from "../components/custom/AreaSelection";
import MunicipalSel from "../components/custom/MunicipalSel";

//props
import { CollectionBatch } from "../interface/data";
// import { formatTimestamp } from "../utils/date";

const StabCollection = () => {
  const [onOpen, setOnOpen] = useState(0);
  //const nav = useNavigate();
  const user = useUserData();
  const [params, setParams] = useSearchParams({
    zipCode:
      user.forMunicipal !== 4905 ? "4905" : user.forMunicipal?.toString(),
    barangay: "",
  });

  const currentMunicipal = params.get("zipCode") || "4905";
  const handleChangeArea = (value: string, key: string) => {
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

  const { data, refetch } = useQuery<{ getBarangayStab: CollectionBatch[] }>(
    GET_BARANGAY_STAB,
    {
      variables: {
        zipCode: parseInt(currentMunicipal, 10),
      },
    }
  );
  console.log({ data });

  useEffect(() => {
    refetch({
      zipCode: parseInt(currentMunicipal, 10),
    });
  }, [currentMunicipal]);
  return (
    <div className="w-full ">
      <div className="w-full flex justify-end p-2 border border-l-0 border-r-0">
        <MunicipalSel
          disabled={user.forMunicipal ? true : false}
          className="max-w-96"
          defaultValue={currentMunicipal}
          value={currentMunicipal}
          handleChangeArea={handleChangeArea}
        />
        <Button size="sm" onClick={() => setOnOpen(1)}>
          New
        </Button>
      </div>

      {/* <div className="w-full grid grid-cols-4 gap-2 p-4">
        {data?.getAllCollBatch?.map((item) => (
          <div
            className="col-span-1 border hover:border-gray-400 rounded-sm p-4 cursor-pointer"
            onClick={() => nav(`/manage/collection/${item.id}`)}
          >
            <p className="text-xs">Stab: {item.stab}</p>
            <p className=" text-xs">Title: {item.title || "N/A"}</p>
            <p className=" text-sm">
              Date: {formatTimestamp(item.timestamp as string)}
            </p>
          </div>
        ))}
      </div> */}
      <Modal
        title="Start Collection"
        children={<NewCollBatchForm />}
        open={onOpen === 1}
        onOpenChange={() => setOnOpen(0)}
      />
    </div>
  );
};

export default StabCollection;
