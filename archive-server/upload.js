const multer = require("multer");
const path = require("path");

// 📌 Настройка хранилища
const storage = multer.diskStorage({
  destination: "pdf-files/",  // Папка для сохранения
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Генерация уникального имени
  },
});

// 📌 Фильтр: разрешаем только PDF
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Только PDF-файлы разрешены!"), false);
  }
};

// 📌 Экспорт настроенного multer
const upload = multer({ storage, fileFilter });

module.exports = upload;
