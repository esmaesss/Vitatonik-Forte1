import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors());
app.use(express.json({ limit: "20kb" }));

app.post("/api/contact", (req, res) => {
  const { name = "", email = "", phone = "", message = "" } = req.body || {};
  if (name.trim().length < 2 || !/^\S+@\S+\.\S+$/.test(email) || message.trim().length < 5) {
    return res.status(400).json({ ok: false, error: "Ad, geçerli e-posta ve mesaj zorunludur." });
  }
  console.log("Yeni mesaj:", { name, email, phone, message });
  res.json({ ok: true });
});

app.use(express.static(path.join(__dirname, "../dist")));
app.get("*", (req, res) => res.sendFile(path.join(__dirname, "../dist/index.html")));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("Sunucu çalışıyor: " + PORT));