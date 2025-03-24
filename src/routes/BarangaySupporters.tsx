import { useMemo, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
//hooks
import { useParams } from "react-router-dom";
import { useQuery, useLazyQuery } from "@apollo/client";
import { useUserData } from "../provider/UserDataProvider";
import axios from "../api/axios";
//graphql
import { GET_SUPPORTERS, GET_BARANGAY_SUPPORT } from "../GraphQL/Queries";

//layout
import MunicipalSel from "../components/custom/MunicipalSel";
import Modal from "../components/custom/Modal";
//import AreaSelection from "../components/custom/AreaSelection";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
  TableFooter,
} from "../components/ui/table";
//props
import { BarangayProps, CandidatesProps } from "../interface/data";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
const BarangaySupporters = () => {
  const user = useUserData();
  const [onOpen, setOnOpen] = useState(0);
  const [params, setParams] = useSearchParams({
    zipCode: user?.forMunicipal ? user?.forMunicipal.toString() : "4905",
  });
  const [selected, setSelected] = useState<BarangayProps | null>(null);
  const currenetZipCode = params.get("zipCode") || "4905";
  const { candidateID } = useParams();

  const { data, loading, refetch } = useQuery<{
    barangayList: BarangayProps[];
    candidate: CandidatesProps | null;
  }>(GET_SUPPORTERS, {
    variables: {
      zipCode: user?.forMunicipal
        ? user?.forMunicipal
        : parseInt(currenetZipCode, 10),
      id: candidateID,
    },
    skip: !candidateID,
    onCompleted: (data) => {
      if (data.barangayList) {
        console.log(data.barangayList);
      }
    },
  });

  const handleChangeArea = (value: string, key?: string) => {
    if (!key) return false;
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

  const totalVoterAsMembers = useMemo(() => {
    return (
      data?.barangayList?.reduce(
        (acc, curr) => acc + (curr?.supporters?.withTeams || 0),
        0
      ) || 0
    );
  }, [data]);

  const totalVoterFigureHeads = useMemo(() => {
    return (
      data?.barangayList?.reduce(
        (acc, curr) => acc + (curr?.supporters?.figureHeads || 0),
        0
      ) || 0
    );
  }, [data]);

  const totalBC = useMemo(() => {
    return (
      data?.barangayList?.reduce(
        (acc, curr) => acc + (curr?.supporters?.bc || 0),
        0
      ) || 0
    );
  }, [data]);

  const totalPC = useMemo(() => {
    return (
      data?.barangayList?.reduce(
        (acc, curr) => acc + (curr?.supporters?.pc || 0),
        0
      ) || 0
    );
  }, [data]);

  const totalTL = useMemo(() => {
    return (
      data?.barangayList?.reduce(
        (acc, curr) => acc + (curr?.supporters?.tl || 0),
        0
      ) || 0
    );
  }, [data]);

  const totleAboveMin = useMemo(() => {
    return (
      data?.barangayList?.reduce(
        (acc, curr) => acc + (curr?.teamStat.belowMax || 0),
        0
      ) || 0
    );
  }, [data]);

  const totalClean = useMemo(() => {
    return (
      data?.barangayList?.reduce(
        (acc, curr) => acc + (curr?.teamStat.clean || 0),
        0
      ) || 0
    );
  }, [data]);

  const handleDownload = async () => {
    if (!data) {
      return;
    }
    const { barangayList } = data;
    try {
      const response = await axios.post(
        "upload/supporter-report",
        {
          zipCode: 4905,
          candidate: data?.candidate
            ? `${data.candidate.firstname} ${data.candidate.lastname}`
            : undefined,
          barangayList: JSON.stringify(barangayList),
        },
        {
          responseType: "blob", // This ensures the response is treated as a binary blob
        }
      );

      // Create a URL for the blob and trigger a download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${data.candidate?.firstname} ${data.candidate?.lastname}.xlsx`; // Set the file name
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  const downloadExcel = async () => {
    if (!currenetZipCode) {
      toast.error("Please select a zip code", {
        closeButton: false,
      });
      return;
    }
    if (!selected) {
      toast.error("Please select a zip code", {
        closeButton: false,
      });
      return;
    }
    try {
      const response = await axios.get(`upload/team-breakdown`, {
        responseType: "blob",
        params: {
          zipCode: currenetZipCode,
          barangay: selected.id,
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selected.name}-Team_BreakDown.xlsx`; // Suggested filename
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file", error);
    }
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: downloadExcel,
  });

  useEffect(() => {
    refetch({
      zipCode: parseInt(currenetZipCode, 10),
      id: candidateID,
    });
  }, [currenetZipCode]);

  const handleSelected = (value: BarangayProps) => {
    setSelected(value);
    setOnOpen(2);
  };

  const [
    barangaySupporters,
    { loading: barangayLoading, refetch: barangayReftch },
  ] = useLazyQuery<{
    barangay: BarangayProps;
  }>(GET_BARANGAY_SUPPORT, {
    variables: {
      id: candidateID,
    },
    onError: (err) => {
      console.log(err);
    },
  });

  useEffect(() => {
    barangayReftch({});
  }, [user, currenetZipCode]);

  const handleGenData = async () => {
    if (!data?.candidate || !selected) {
      return;
    }
    try {
      const response = await barangaySupporters({
        variables: {
          id: selected.id,
          candidateId: data?.candidate.id,
        },
      });

      if (!response.data) {
        return;
      }
      const { barangay } = response.data;
      console.log(barangay);

      const returned = await axios.post(
        "upload/supporter-report-barangay",
        {
          zipCode: 4905,
          candidate: data?.candidate
            ? `${data.candidate.firstname} ${data.candidate.lastname}`
            : undefined,
          barangay: JSON.stringify(barangay),
        },
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([returned.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selected.name} Team Org Breakdown.xlsx`; // Set the file name
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-auto">
      <div className="w-full p-2 flex justify-between border border-gray-400">
        <MunicipalSel
          className="max-w-60"
          defaultValue={
            user.forMunicipal ? user.forMunicipal.toString() : "4905"
          }
          value={
            user.forMunicipal ? user.forMunicipal.toString() : currenetZipCode
          }
          handleChangeArea={handleChangeArea}
          disabled={user.forMunicipal ? true : false}
        />
        <Button onClick={() => setOnOpen(1)}>Print</Button>
      </div>
      <div className="p-2">
        <h1 className="text-lg font-medium">
          {data?.candidate?.firstname} {data?.candidate?.lastname}
        </h1>
        <div className="">
          <h1 className="text-sm font-thin">Supporters Breakdown</h1>
        </div>
      </div>
      <Table>
        <TableHeader className="w-full sticky top-0">
          <TableHead>Barangay</TableHead>
          <TableHead>Figure Heads</TableHead>
          <TableHead>BC</TableHead>
          <TableHead>PC</TableHead>
          <TableHead>TL</TableHead>
          <TableHead>Clean</TableHead>
          <TableHead>Voter W/ team</TableHead>
          {/* <TableHead>Voter W/o team</TableHead> */}
          <TableHead>10+</TableHead>
          <TableHead>10</TableHead>
          <TableHead>6-9</TableHead>
          <TableHead>5</TableHead>
          <TableHead>1-3</TableHead>
          <TableHead>Delisted Voter</TableHead>
          <TableHead>All Voters</TableHead>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : data?.barangayList?.length ? (
            data.barangayList.map((item) => (
              <TableRow
                key={item.id}
                className="cursor-pointer hover:bg-slate-200"
                onClick={() => handleSelected(item)}
              >
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.supporters?.figureHeads || 0}</TableCell>
                <TableCell>{item.supporters?.bc || 0}</TableCell>
                <TableCell>{item.supporters?.pc || 0}</TableCell>
                <TableCell>{item.supporters?.tl || 0}</TableCell>
                <TableCell>{item.teamStat?.clean || 0}</TableCell>
                <TableCell>{item.supporters?.withTeams || 0}</TableCell>
                {/* <TableCell>{item.supporters?.voterWithoutTeam || 0}</TableCell> */}
                <TableCell>{item.teamStat?.aboveMax || 0}</TableCell>
                <TableCell>{item.teamStat?.equalToMax || 0}</TableCell>
                <TableCell>{item.teamStat?.belowMax || 0}</TableCell>
                <TableCell>{item.teamStat?.equalToMin || 0}</TableCell>
                <TableCell>{item.teamStat?.threeAndBelow || 0}</TableCell>
                <TableCell>{item.barangayDelistedVoter || 0}</TableCell>
                <TableCell>{item.barangayVotersCount || 0}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={14} className="text-center">
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter className="w-full">
          <TableRow className="w-full">
            <TableCell className="text-left">
              {data?.barangayList?.length ?? 0}
            </TableCell>
            <TableCell className="text-left">{totalVoterFigureHeads}</TableCell>
            <TableCell className="text-left">{totalBC}</TableCell>
            <TableCell className="text-left">{totalPC}</TableCell>
            <TableCell className="text-left">{totalTL}</TableCell>
            <TableCell className="text-left">{totalClean}</TableCell>
            <TableCell className="text-left">{totalVoterAsMembers}</TableCell>
            <TableCell className="text-left">{totleAboveMin}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <Modal
        children={
          <div className="p-4 flex flex-col gap-2">
            <h1 className="text-center font-medium">Print</h1>
            <Button size="sm" variant="default" onClick={handleDownload}>
              Overall Breakdown
            </Button>
            <Button size="sm" variant="outline" disabled>
              Barangay Breakdown
            </Button>
          </div>
        }
        open={onOpen === 1}
        onOpenChange={() => {
          setOnOpen(0);
        }}
      />

      <Modal
        title={`Print Supporters`}
        open={onOpen === 2}
        children={
          <div className="flex flex-col gap-1">
            <Button
              className="w-full border border-gray-400"
              variant="outline"
              disabled
              onClick={handleGenData}
            >
              Per BC (Not Available)
            </Button>
            <Button
              className="w-full border border-gray-400"
              variant="outline"
              disabled={barangayLoading}
              onClick={handleGenData}
            >
              Per PC
            </Button>
            <Button
              className="w-full border border-gray-400"
              variant="outline"
              disabled
              onClick={handleGenData}
            >
              Per TL (Not Available)
            </Button>
            <Button
              className="w-full border border-gray-400"
              variant="outline"
              disabled={isPending}
              onClick={() => mutateAsync()}
            >
              Team Break down
            </Button>
          </div>
        }
        onOpenChange={() => {
          setSelected(null);
          setOnOpen(0);
        }}
      />
    </div>
  );
};

export default BarangaySupporters;
