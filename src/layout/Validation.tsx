// import { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
//graphql
import { BARANGAY_VALIDATION_LIST } from "../GraphQL/Queries";
import { useQuery } from "@apollo/client";

//ui
import { Skeleton } from "../components/ui/skeleton";

//utils
import { formatTimestamp } from "../utils/date";

//props
import { ValidationProps, BarangayProps } from "../interface/data";
interface Props {
  barangayId: string;
}
const Validation = ({ barangayId }: Props) => {
  //const location = useLocation();

  const { data, loading } = useQuery<{
    validationList: ValidationProps[];
    barangay: BarangayProps;
  }>(BARANGAY_VALIDATION_LIST, {
    variables: {
      id: barangayId,
    },
    skip: barangayId === "none",
  });

  return (
    <div className="w-full p-2 ">
      <div className="w-full py-2">
        <h1 className="text-gray-500">
          {data && data.barangay.name} - ({data && data.barangay.barangayVotersCount})
        </h1>
      </div>
      {loading ? (
        <div className="w-full h-auto flex flex-col gap-2">
          <Skeleton className="w-full h-10" />
        </div>
      ) : (
        <div className="w-full h-auto flex flex-col gap-2">
          {data && [...data.validationList].reverse().map((item) => <Items {...item} />)}
        </div>
      )}
    </div>
  );
};

export default Validation;

const Items = ({ ...props }: ValidationProps) => {
  //const [onOpen, setOnOpen] = useState(0);

  return (
    <div className="w-full p-2 border border-gray-500 rounded bg-gray-100">
      <h1 className="text-slate-800 font-medium">
        Voters validated: {props.totalVoters} ({props.percent.toFixed(2)}%)
      </h1>
      <h1 className="">{formatTimestamp(props.timestamp)}</h1>
    </div>
  );
};
