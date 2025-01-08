const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 5001;

app.use(cors());

// 파일 저장 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads"); // 저장될 경로
  },
  filename: (req, file, cb) => {
    let decodedFilename = file.originalname;

    try {
      decodedFilename = Buffer.from(file.originalname, "latin1").toString(
        "utf-8"
      );
    } catch (error) {
      console.warn("파일 이름 디코딩 실패, 원본 사용:", file.originalname);
    }

    // 파일 이름에 타임스탬프 추가
    const uniqueFilename = `${Date.now()}-${decodedFilename}`;
    cb(null, uniqueFilename);
  },
});
const upload = multer({ storage });

app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // 정적 파일 제공
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PDF 업로드 엔드포인트
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "파일이 업로드되지 않았습니다." });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
