const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 5001;

app.use(cors());

// 업로드 경로 설정
const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("file"), (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "파일 업로드 실패" });
    }

    // 파일 경로 생성
    const fileUrl = `/uploads/${file.filename}`;
    res.status(200).json({ url: fileUrl });
  } catch (error) {
    console.error("파일 업로드 중 에러:", error);
    res.status(500).send("Internal Server Error");
  }
});

// 정적 파일 제공
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 파일 업로드 엔드포인트
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("파일 업로드 실패");
  }
  res.json({ url: `/uploads/${req.file.filename}` });
});

// 서버 시작
app.listen(PORT, () =>
  console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`)
);
