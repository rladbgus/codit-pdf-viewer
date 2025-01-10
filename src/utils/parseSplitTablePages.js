import * as pdfjs from "pdfjs-dist";

const parseSplitTablePages = async (pdfUrl) => {
  const pdf = await pdfjs.getDocument(pdfUrl).promise;
  const parsedPages = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const items = textContent.items;
    const viewport = page.getViewport({ scale: 1 });

    const rows = [];
    const rowMap = new Map();

    items.forEach((item) => {
      const x = item.transform[4]; // X 좌표
      const y = item.transform[5]; // Y 좌표
      const text = item.str.trim();

      // Row 번호나 Page 번호와 같은 텍스트 필터링
      if (/^(Row \d+|Page \d+)$/i.test(text)) return;

      const normalizedY = Math.round(y / 10) * 10;

      if (!rowMap.has(normalizedY)) {
        rowMap.set(normalizedY, [[], []]); // [[왼쪽 텍스트], [오른쪽 텍스트]]
      }

      const row = rowMap.get(normalizedY);

      if (x < viewport.width / 2) {
        row[0].push(text); // 왼쪽 텍스트
      } else {
        row[1].push(text); // 오른쪽 텍스트
      }
    });

    rowMap.forEach((value) => {
      rows.push(value.map((col) => col.join(" "))); // 열 데이터 문자열로 합치기
    });

    parsedPages.push(rows);
  }

  return parsedPages;
};

export default parseSplitTablePages;
