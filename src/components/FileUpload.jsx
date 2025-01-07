import React from "react";
import styled from "styled-components";

const API_BASE_URL = "http://localhost:5001";

const UploadForm = styled.div`
  margin-bottom: 20px;
`;

const Button = styled.label`
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const FileUpload = ({ setPdfUrl }) => {
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("파일 업로드 실패");
      }

      const data = await response.json();
      setPdfUrl(`${API_BASE_URL}${data.url}`);
    } catch (error) {
      console.error("업로드 중 에러 발생:", error.message);
      alert("파일 업로드에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <UploadForm>
      <Button htmlFor="file-upload">PDF 업로드</Button>
      <HiddenInput
        id="file-upload"
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
      />
    </UploadForm>
  );
};

export default FileUpload;
