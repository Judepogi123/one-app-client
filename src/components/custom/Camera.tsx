import React, { useState } from "react";
import Tesseract from "tesseract.js";

interface TableRow {
  [key: string]: string;
}

const TableTextScanner: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tableData, setTableData] = useState<TableRow[]>([]);

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setSelectedFile(file);
  };

  const recognizeText = async () => {
    if (!selectedFile) {
      return;
    }
    try {
      const {
        data: { text },
      } = await Tesseract.recognize(selectedFile, "eng", {
        logger: (m) => console.log(m),
      });
      parseTable(text);
    } catch (error) {
      console.error("Error recognizing text:", error);
    }
  };

  const parseTable = (text: string) => {
    const rows = text
      .split("\n")
      .map((row) => row.trim())
      .filter((row) => row.length > 0);

    const headers = ["ID", "Voter's name", "S1", "S2", "S3"];
    const data = rows.slice(1).map((row) => {
      const columns = row.split(/\s+/);
      const rowData: TableRow = {};

      headers.forEach((header, index) => {
        rowData[header] = columns[index] || "0";
      });

      return rowData;
    });

    setTableData(data);
  };

  return (
    <div>
      <h1>Table Text Scanner</h1>
      <input type="file" accept="image/*" onChange={handleChangeFile} />
      <button onClick={recognizeText}>Analyze</button>
      {tableData.length > 0 && (
        <div>
          <h2>Recognized Table:</h2>
          <table>
            <thead>
              <tr>
                {Object.keys(tableData[0]).map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, rowIndex) => (
                <tr key={rowIndex} style={{ border: "1px solid black" }}>
                  {Object.values(row).map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TableTextScanner;
