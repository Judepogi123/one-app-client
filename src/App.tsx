import { useState, ChangeEvent } from "react";
import axios from "./api/axios";

import { Button } from "./components/ui/button";

interface ExcelData {
  [key: string]: any;
}

interface ExcelResponse {
  [sheetName: string]: ExcelData[];
}

//const tableHeader: {title: string}[] = [{title: "Number"},{title: "Age Ranged"},{title: ""}]

const App = () => {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<ExcelResponse>({});

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleFileUpload = async (): Promise<void> => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file); // Ensure the key matches the server

    try {
      const response = await axios.post<ExcelResponse>(
        "upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  // const handleSave = async()=>{
  //   try {
      
  //   } catch (error) {
  //    console.log("Error: ",error);
      
  //   }
  // }

  return (
    <div>
      <h1>Upload Excel File</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload</button>
      <Button>Checked</Button>
      {Object.keys(data).length > 0 && (
        Object.keys(data).map(sheetName => (
          <div key={sheetName}>
            <table>
              <thead>
                <tr>
                  {Object.keys(data[sheetName][0]).map(key => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data[sheetName].map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, i) => (
                      <td key={i}>{value || "Unknown"}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};

export default App;
