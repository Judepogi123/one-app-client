import { useSearchParams } from "react-router-dom";
import { useUserData } from "../provider/UserDataProvider";
//ui
import {
  Table,
  TableBody,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
} from "../components/ui/table";
import MunicipalSel from "../components/custom/MunicipalSel";
import { formatTimestamp } from "../utils/date";

//graphql
import { GET_ALL_VALIDATION } from "../GraphQL/Queries";
import { useQuery } from "@apollo/client";
import { BarangayProps } from "../interface/data";

const BarangayValidationList = () => {
  const user = useUserData();
  const [params, setParams] = useSearchParams({
    municipal: user?.forMunicipal ? user?.forMunicipal?.toString() : "none",
  });
  const currentZipCode = params.get("municipal") || "none";

  const { data, loading } = useQuery<{ barangayList: BarangayProps[] }>(
    GET_ALL_VALIDATION,
    {
      variables: {
        zipCode: parseInt(currentZipCode, 10),
      },
      skip: currentZipCode === "none",
    }
  );

  const handleChangeArea = (value: string, key?: string) => {
    if (!value || !key) return;
    setParams(
      (prev) => {
        prev.set(key, value);
        return prev;
      },
      { replace: true }
    );
  };

  return (
    <div className="w-full h-auto">
      <div className="w-full flex justify-end p-2 border border-gray-600">
        <MunicipalSel
          disabled={user?.forMunicipal ? true : false}
          value={currentZipCode}
          defaultValue=""
          handleChangeArea={handleChangeArea}
          className="flex gap-2"
        />
      </div>
      {loading ? (
        <div className="w-full h-1/2 grid ">
          <h1 className="m-auto text-lg font-medium text-gray-800">
            Loading...
          </h1>
        </div>
      ) : data?.barangayList?.length === 0 ? (
        <div>No data found.</div>
      ) : (
        <Table>
          <TableHeader>
            <TableHead>Barnagay</TableHead>
            <TableHead>Total Voters</TableHead>
            <TableHead>Validated Voters</TableHead>
            <TableHead>Validated Voters(Percentage)</TableHead>
            <TableHead>Lastest Validation Date</TableHead>
          </TableHeader>
          <TableBody>
            {data?.barangayList?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.barangayVotersCount}</TableCell>
                <TableCell>
                  {item.validationList.at(0)?.totalVoters ?? 0}
                </TableCell>
                <TableCell>
                  {item.validationList?.at(0)?.percent.toFixed(2) ?? "--.--"}%
                </TableCell>
                <TableCell>
                  {item.validationList?.at(-1)?.timestamp
                    ? formatTimestamp(
                        item.validationList.at(0)?.timestamp as string
                      )
                    : "--/--"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default BarangayValidationList;
