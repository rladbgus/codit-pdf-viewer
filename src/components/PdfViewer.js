import React, { useEffect, useRef } from "react";
import * as pdfjs from "pdfjs-dist";
import styled from "styled-components";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

function PdfViewer({ pdfUrl }) {
  const viewerRef = useRef(null);

  useEffect(() => {
    const renderPdf = async () => {
      try {
        // PDF 불러오기
        const pdf = await pdfjs.getDocument("2100113_medical_bill.pdf").promise;
        const viewer = viewerRef.current;

        if (!viewer) {
          return;
        }

        // 기존 내용 초기화
        viewer.innerHTML = "";

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          // 각 페이지 가져오기
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: 1.5 });

          // Canvas 생성 및 렌더링
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          const renderContext = {
            canvasContext: context,
            viewport,
          };

          await page.render(renderContext).promise;

          // 페이지를 container에 추가
          const pageContainer = document.createElement("div");
          pageContainer.style.marginBottom = "16px";
          pageContainer.appendChild(canvas);
          viewer.appendChild(pageContainer);
        }
      } catch (error) {
        console.error("PDF 렌더링 중 오류 발생:", error);
      }
    };

    renderPdf();
  }, [pdfUrl]);

  return <S.Container ref={viewerRef} />;
}

const S = {
  Container: styled.div`
    overflow-y: auto;
    max-height: 100vh;
    padding: 16px;
    background-color: #f5f5f5;
  `,
};
export default PdfViewer;
