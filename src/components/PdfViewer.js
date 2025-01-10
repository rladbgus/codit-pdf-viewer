import React, { useEffect, useRef, useState } from "react";
import * as pdfjs from "pdfjs-dist";
import styled from "styled-components";
import parseSplitTablePages from "../utils/parseSplitTablePages";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

function PdfViewer({ pdfUrl }) {
  const viewerRef = useRef(null);
  const [parsedPages, setParsedPages] = useState([]);

  // 파싱 로직
  useEffect(() => {
    if (pdfUrl) {
      parseSplitTablePages(pdfUrl)
        .then((result) => {
          setParsedPages(result);
          console.log("최종 결과:", result);
        })
        .catch((error) => {
          console.error("페이지 파싱 중 오류:", error);
        });
    }
  }, [pdfUrl]);

  // PDF 랜더링 로직
  useEffect(() => {
    const renderPdf = async () => {
      try {
        const pdf = await pdfjs.getDocument(pdfUrl).promise;
        const viewer = viewerRef.current;

        if (!viewer) return;

        viewer.innerHTML = "";

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: 1 });

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          const renderContext = {
            canvasContext: context,
            viewport,
          };

          await page.render(renderContext).promise;

          const pageContainer = document.createElement("div");
          pageContainer.style.marginBottom = "16px";
          pageContainer.appendChild(canvas);
          viewer.appendChild(pageContainer);
        }
      } catch (error) {
        console.error("PDF 렌더링 중 오류 발생:", error);
      }
    };

    if (pdfUrl) renderPdf();
  }, [pdfUrl]);

  // TXT 파일 다운로드 핸들러
  const handleDownloadTxt = () => {
    if (parsedPages.length === 0) {
      alert("파싱된 데이터가 없습니다.");
      return;
    }

    // 데이터를 텍스트 형식으로 변환
    const textContent = parsedPages
      .map((page, index) => {
        // 각 페이지의 내용을 처리
        const pageContent = page
          .map((row, rowIndex) => {
            // 이중 배열 그대로 출력
            return `Row ${rowIndex + 1}: ${JSON.stringify(row)}`;
          })
          .join("\n");

        return `Page ${index + 1}\n${pageContent}\n\n`;
      })
      .join("");

    // Blob 생성
    const blob = new Blob([textContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "parsedPages.txt";
    link.click();
  };

  return (
    <S.Container>
      <S.Button onClick={handleDownloadTxt}>Download Parsed File</S.Button>
      <div ref={viewerRef} />
    </S.Container>
  );
}

const S = {
  Container: styled.div`
    overflow-y: auto;
    max-height: 100vh;
    padding: 16px;
    background-color: #f5f5f5;
  `,
  Button: styled.button`
    margin: 16px 0;
    padding: 8px 16px;
    background-color: #007bff;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #0056b3;
    }
  `,
};

export default PdfViewer;
