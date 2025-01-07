import React, { useState } from "react";
import FileUploader from "./components/FileUploader";
import PdfViewer from "./components/PdfViewer";
import { ParsedData } from "./types/PdfData";

const App: React.FC = () => {
  const [filePath, setFilePath] = useState<string>("");
  const [parsedData, setParsedData] = useState<ParsedData>([]);

  const handleFileUpload = (path: string) => {
    setFilePath(`http://localhost:5001${path}`);
  };

  const handleParseData = (data: ParsedData) => {
    setParsedData(data);
  };

  return (
    <div>
      <h1>PDF Viewer and Parser</h1>
      <FileUploader onFileUpload={handleFileUpload} />
      {filePath && (
        <PdfViewer filePath={filePath} onParseData={handleParseData} />
      )}
      {parsedData.length > 0 && (
        <div>
          <h2>Parsed Data</h2>
          <pre>{JSON.stringify(parsedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default App;
