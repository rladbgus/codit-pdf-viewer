import React from "react";
import styled from "styled-components";

const API_BASE_URL = "http://localhost:5001";

const FileUpload = ({ setPdfUrl }) => {
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    if (file.type !== "application/pdf") {
      alert("PDF 파일만 업로드 가능합니다.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setPdfUrl(data.url);
    } catch (error) {
      console.error("업로드 중 에러 발생:", error.message);
      alert("파일 업로드에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <S.Wrapper>
      <S.Button htmlFor="file-upload">PDF 업로드</S.Button>
      <S.HiddenInput
        id="file-upload"
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
      />
    </S.Wrapper>
  );
};

const S = {
  Wrapper: styled.div`
    margin-bottom: 20px;
  `,
  Button: styled.label`
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
  `,
  HiddenInput: styled.input`
    display: none;
  `,
};

export default FileUpload;
