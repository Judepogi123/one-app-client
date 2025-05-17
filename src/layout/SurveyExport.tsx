import { useState } from "react";
import { useParams } from "react-router-dom";

import axios, { localhost } from "../api/axios";
//ui
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Button } from "../components/ui/button";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionTrigger,
//   AccordionItem,
// } from "../components/ui/accordion";
// import {
//   Table,
//   TableBody,
//   TableHead,
//   TableHeader,
//   TableCell,
//   TableRow,
// } from "../components/ui/table";
import { toast } from "sonner";
//graphql
import { GET_SELECTED_QUERY } from "../GraphQL/Queries";
import { useLazyQuery } from "@apollo/client";
//props
import {
  SurveyInfoProps,
  BarangayProps,
  MunicipalProps,
  QueryProps,
} from "../interface/data";
interface SurveyExportProps {
  setOnExport: React.Dispatch<React.SetStateAction<boolean>>;
  survey: SurveyInfoProps;
  barangayList: BarangayProps[];
  municipals: MunicipalProps[];
  surveyQueriesList: QueryProps[];
}

interface SelectedOptionProps {
  id: string;
  title: string;
  barangays: {
    id: string;
    name: string;
    femaleSize: number;
    maleSize: number;
    optionResponse: number;
  }[];
}

const SurveyExport = ({
  setOnExport,
  municipals,
  surveyQueriesList,
}: SurveyExportProps) => {
  const { surveyID } = useParams();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [selectedMunicipal, setSelectedMunicipal] = useState<string | null>(
    null
  );
  const [selectedQuery, setSelectedQuery] = useState<string | null>(null);
  // const [selectedOpton, setSelectedOption] = useState<{
  //   title: string;
  //   id: string;
  // } | null>(null);

  const [option, { data, loading }] = useLazyQuery<{
    option: SelectedOptionProps;
  }>(GET_SELECTED_QUERY);

  // const handleSelectedOption = (title: string, id: string) => {
  //   setSelectedOption({ title, id });
  // };

  const downloadSurveyOptions = async (): Promise<void> => {
    if (!surveyID) {
      toast.warning("Failed to generate results!");
      return;
    }
    try {
      const response = await axios.post(
        "upload/print-survey-options",
        {
          zipCode: "4905",
          multiple: true,
          surveyId: surveyID,
          queryId: selectedQuery,
        },
        { responseType: "blob" }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${surveyID}-results.xlsx`);
      document.body.appendChild(link);
      link.click();

      // Clean up
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading survey options:", error);
      throw error;
    }
  };

  const handleSelectQuery = (value: string) => {
    setSelectedQuery(value);
  };

  const handleGetoption = async () => {
    if (!selectedMunicipal && !selectedQuery) {
      return;
    }
    try {
      const respone = await option({
        variables: {
          queryId: selectedQuery,
          zipCode: parseInt(selectedMunicipal as string, 10),
          surveyId: surveyID as string,
        },
      });
      if (respone.data) {
        console.log("Data: ", respone.data);

        console.log("Success!");
        handleControlPage();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleControlPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handleExportDoc = async () => {
    if (!data) {
      return;
    }
    try {
      // Send a request to the new XLSX export endpoint
      const response = await axios.post(
        `${localhost}export/xlsx`, // Updated URL
        { option: data.option },
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${data.option.title}.xlsx`;
      link.click();

      if (response.status === 200) {
        toast("Export success!");
        setOnExport(false);
      }
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  // const handleExportPdf = async () => {
  //   try {
  //     const response = await axios.post("/upload/export-pdf");
  //   } catch (error) {}
  // };

  const pages = [
    <div className="w-full h-auto flex flex-col gap-2">
      {/* <Accordion type="single" collapsible>
        {survey.queries.map((item) => (
          <AccordionItem value={item.id}>
            <AccordionTrigger>{item.queries}</AccordionTrigger>
            <AccordionContent className="w-full flex flex-col gap-1">
              {item.options.map((opt) => (
                <div
                  onClick={() => handleSelectedOption(opt.title, opt.id)}
                  key={opt.id}
                  className={`w-full p-2 border cursor-pointer hover:bg-slate-200 ${
                    selectedOpton?.id === opt.id ? "bg-blue-200" : ""
                  }`}
                >
                  {opt.title}
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion> */}
      {surveyQueriesList.map((item) => (
        <div
          className={`w-full p-2 border border-gray-400 rounded cursor-pointer hover:bg-slate-300 ${
            selectedQuery === item.id ? "bg-slate-300" : ""
          }`}
          onClick={() => handleSelectQuery(item.id)}
        >
          <h1>{item.queries}</h1>
        </div>
      ))}
    </div>,
    <div className="w-full h-auto">
      {/* <div className="">{data?.option.title}</div>
      <Table>
        <TableHeader>
          {["Barangay", "Total Gender size", "Responses"].map((item) => (
            <TableHead>{item}</TableHead>
          ))}
        </TableHeader>
        <TableBody>
          {data?.option.barangays.map((item) => (
            <TableRow>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.femaleSize + item.maleSize}</TableCell>
              <TableCell>{item.optionResponse}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table> */}
    </div>,
  ];

  return (
    <div className="w-full h-auto ">
      <div className="w-full p-2">
        <Select
          defaultValue={municipals[0].id.toString()}
          onValueChange={(value) => setSelectedMunicipal(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Municipal" />
          </SelectTrigger>
          <SelectContent>
            {municipals.map((item) => (
              <SelectItem value={item.id.toString()}>{item.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-full h-auto overflow-auto max-h-80">
        {pages[currentPage]}
      </div>
      <div className="w-full flex justify-end gap-2 p-2">
        <Button variant="outline" onClick={() => setOnExport(false)}>
          Cancel
        </Button>
        <Button onClick={downloadSurveyOptions}>Print</Button>
        <Button onClick={handleGetoption} disabled={loading}>
          {loading ? "Please wait..." : "Next"}
        </Button>
        <Button onClick={handleExportDoc}>Export</Button>
      </div>
    </div>
  );
};

export default SurveyExport;
