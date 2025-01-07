import React, { useState } from "react";
import styled from "styled-components";
import PdfViewer from "./components/PdfViewer";
import FileUpload from "./components/FileUpload";

const App = () => {
  const [pdfUrl, setPdfUrl] = useState("");

  return (
    <S.Container>
      <FileUpload setPdfUrl={setPdfUrl} />
      <PdfViewer pdfUrl={pdfUrl} />
    </S.Container>
  );
};

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  `,
};
export default App;
