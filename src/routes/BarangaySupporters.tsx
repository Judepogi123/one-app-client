import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
//hooks
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import axios from "../api/axios";
//graphql
import { GET_SUPPORTERS } from "../GraphQL/Queries";

//layout
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

const BarangaySupporters = () => {
  const [params] = useSearchParams({ zipCode: "4905" });
  const currenetZipCode = params.get("zipCode") || "4905";
  const { candidateID } = useParams();

  const { data, loading } = useQuery<{
    barangayList: BarangayProps[];
    candidate: CandidatesProps | null;
  }>(GET_SUPPORTERS, {
    variables: {
      zipCode: parseInt(currenetZipCode, 10),
      id: candidateID,
    },
    onCompleted: (data) => {
      if (data.barangayList) {
        console.log(data.barangayList);
      }
    },
  });
  console.log(data);

  const totalVoterAsMembers = useMemo(() => {
    return data?.barangayList.reduce(
      (acc, curr) => acc + curr.supporters.withTeams,
      0
    );
  }, [data]);

  const totalVoterFigureHeads = useMemo(() => {
    return data?.barangayList.reduce(
      (acc, curr) => acc + curr.supporters.figureHeads,
      0
    );
  }, [data]);

  const totalBC = useMemo(() => {
    return data?.barangayList.reduce(
      (acc, curr) => acc + curr.supporters.bc,
      0
    );
  }, [data]);
  const totalPC = useMemo(() => {
    return data?.barangayList.reduce(
      (acc, curr) => acc + curr.supporters.pc,
      0
    );
  }, [data]);
  const totalTL = useMemo(() => {
    return data?.barangayList.reduce(
      (acc, curr) => acc + curr.supporters.tl,
      0
    );
  }, [data]);

  console.log(totalVoterAsMembers);

  const handleDownload = async () => {
    if (!data) {
      return;
    }
    const { barangayList } = data;
    try {
      const response = await axios.post("upload/supporter-report", {
        zipCode: 4905,
        candidate: data?.candidate
          ? `${data.candidate.firstname} ${data.candidate.lastname}`
          : undefined,
        barangayList: JSON.stringify(barangayList),
      }, { 
        responseType: "blob", // This ensures the response is treated as a binary blob
      });
  
      // Create a URL for the blob and trigger a download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "SupporterReport.xlsx"; // Set the file name
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };
  
  return (
    <div className="w-full h-auto">
      <div className="p-2">
        <h1 className="text-lg font-medium">
          {data?.candidate?.firstname} {data?.candidate?.lastname}
        </h1>
        <div className="">
          <h1 className="text-sm">Supporters breakdown</h1>
        </div>
        <Button onClick={handleDownload}>Print</Button>
      </div>
      <Table>
        <TableHeader>
          <TableHead>Barangay</TableHead>
          <TableHead>Figure Heads</TableHead>
          <TableHead>BC</TableHead>
          <TableHead>PC</TableHead>
          <TableHead>TL</TableHead>
          <TableHead>Voter W/ team</TableHead>
          <TableHead>Voter W/o team</TableHead>
          <TableHead>A/10</TableHead>
          <TableHead>E/10</TableHead>
          <TableHead>B/10</TableHead>
          <TableHead>A/5</TableHead>
          <TableHead>E/5</TableHead>
          <TableHead>B/5</TableHead>
          <TableHead>All Voters</TableHead>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : (
            data?.barangayList.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.supporters.figureHeads}</TableCell>
                <TableCell>{item.supporters.bc}</TableCell>
                <TableCell>{item.supporters.pc}</TableCell>
                <TableCell>{item.supporters.tl}</TableCell>
                <TableCell>{item.supporters.withTeams}</TableCell>
                <TableCell>{item.supporters.voterWithoutTeam}</TableCell>
                <TableCell>{item.teamStat.aboveMax}</TableCell>
                <TableCell>{item.teamStat.equalToMax}</TableCell>
                <TableCell>{item.teamStat.belowMax}</TableCell>
                <TableCell>{item.teamStat.aboveMin}</TableCell>
                <TableCell>{item.teamStat.equalToMin}</TableCell>
                <TableCell>{item.teamStat.belowMin}</TableCell>
                <TableCell>{item.barangayVotersCount}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        <TableFooter className="w-full">
          <TableRow className="w-full">
            <TableCell className="text-right">
              Total Barangays: {data?.barangayList.length}
            </TableCell>
            <TableCell className="text-right">
              Total Figure Heads: {totalVoterFigureHeads}
            </TableCell>
            <TableCell className="text-right">Total BC: {totalBC}</TableCell>
            <TableCell className="text-right">Total PC: {totalPC}</TableCell>
            <TableCell className="text-right">Total TL: {totalTL}</TableCell>
            <TableCell className="text-right">
              Total W/ team: {totalVoterAsMembers}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default BarangaySupporters;
