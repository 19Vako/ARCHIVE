const mongoose = require("mongoose");
const express = require("express");
require("dotenv").config();
const bcrypt = require("bcrypt");
const upload = require("./upload");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const { ManagerScheme, DocCardScheme, AdminScheme } = require("./schemas");

const env = process.env;
const app = express();

app.use(cors()); 
app.use(express.static("pdf-files"));
app.use('/pdf-files', express.static(path.join(__dirname, 'pdf-files')));
app.use(express.json());


mongoose.connect(env.MONGO_URL, { dbName: "Document-archive"})
   .then(() => {
       console.log("✅ База даних успішно підключена!");
       app.listen(env.PORT, () => {
          console.log(`🚀 Сервер запущений на http://localhost:${env.PORT}`);                                                          
       })
   })
   .catch((err) => {
      console.error("❌ Помилка зєднання з базою даних: ", err);
      process.exit(1);
   });




app.post(env.ADD_ADMIN, async (req, res) => {
    try {
      const { name, password } = req.body;

      if (!name || !password) {
         return res.status(400).json({ error: "❌ Всі поля мають бути заповненими!" });
      }

      const existUser = await AdminScheme.findOne({ name: name });

      if (existUser) {
         return res.status(400).json({ error: "❌ Адмін з таким іменем вже існує!" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await AdminScheme.create({
         name: name,
         password: hashedPassword,
      });

      res.status(201).json({ message: "✅ Адмін успішно створений!" });

    } catch (err) {
        console.error("❌ Помилка при створенні адміністратора: ", err)
        res.status(500).json({ error: "❌ Помилка сервера!" })
    }  
});
app.post(env.ADMIN_LOG_IN, async (req, res) => {
   try {
     const { name, password } = req.body;
     if (!name || !password) {
        return res.status(400).json({ error: "❌ Ім'я та пароль є обов'язковими!" });
     }

     const admin = await AdminScheme.findOne({ name: name });
     if (!admin) {
        return res.status(400).json({ error: "❌ Неправильне ім'я адміністратора або пароль" });
     }

     const isPasswordValid = await bcrypt.compare(password, admin.password);
     if (!isPasswordValid) {
        return res.status(400).json({ error: "❌ Неправильний пароль адміністратора" });
     }

     const { password: _, ...adminData } = admin._doc;
     res.status(200).json({ message: "✅ Вхід успішний!", data: adminData });
   } catch (err) {
     console.error("❌ Помилка входу:", err);
     res.status(500).json({ error: "❌ Помилка сервера" });
   }
});
app.post(env.ADD_MANAGER, async (req, res) => {
   try {
     const { name, password } = req.body;

     if (!name || !password) {
        return res.status(400).json({ error: "❌ Ім'я та пароль є обов'язковими!" });
     }

     const existUser = await ManagerScheme.findOne({ name: name });

     if (existUser) {
        return res.status(400).json({ error: "❌ Менеджер вже існує!" });
     }

     const hashedPassword = await bcrypt.hash(password, 10);
     await ManagerScheme.create({
        name: name,
        password: hashedPassword,
        adminPassword: password,
     });

     res.status(201).json({ message: "✅ Менеджер успішно створений!" });

   } catch (err) {
       console.error("❌ Помилка створення менеджера: ", err);
       res.status(500).json({ error: "❌ Помилка сервера" });
   }  
});
app.post(env.DELETE_MANAGER, async (req, res) => {
   try {
     const { name } = req.body;

     const existManager = await ManagerScheme.findOne({ name:name });
     if (!existManager) {
        return res.status(404).json({ error: "❌ Менеджер не існує!" });
     }

     await ManagerScheme.deleteOne({ name:name });
     res.status(200).json({ message: "✅ Менеджера видалено!" });
     
   } catch (err) {
     console.error("❌ Помилка видалення менеджера: ", err);
     res.status(500).json({ error: "❌ Помилка сервера" });
   }                                                     
});
app.post(env.FIND_MANAGER, async (req, res) => {
   try {
     const { name } = req.body
     const managers = await ManagerScheme.find({ name: { $regex: name, $options: 'i' } })

     if(!managers.length){
      return res.status(404).json({ error: "❌ Менеджер не знайдений!" })
     }

     res.status(200).json({ message: "✅ Менеджер успішно знайдений!", managers:managers })
   } catch (err) {
     console.error("❌ Помилка при пошуку користувача!")
     res.status(500).json({ error: "❌ Помилка сервера!" })
   }
})
app.post(env.FIND_CHANGE_MANAGER, async (req, res) => {
   try {
     const { _id, changedName, changedPassword } = req.body;

     const manager = await ManagerScheme.findOne({ _id:_id });
     if (manager.name === changedName && manager.adminPassword === changedPassword) {
        return res.status(400).json({ error: "❌ Дані менеджера не були змінені!" });
     }

     const hashedPassword = await bcrypt.hash(changedPassword, 10);
     await ManagerScheme.findOneAndUpdate({ _id:_id }, { name:changedName, password:hashedPassword, adminPassword:changedPassword }, { new:true });
     res.status(200).json({ message: "✅ Дані менеджера оновлено!" });

   } catch (err) {
     console.error("❌ Помилка зміни даних менеджера: ", err);
     res.status(500).json({ error: "❌ Помилка сервера" });
   }
});
app.get(env.GET_MANAGERS, async (_, res) => {
  try {
     const managers = await ManagerScheme.find();
     if (!managers) {
        return res.status(200).json({ message: "⚠️ Список менеджерів порожній!" });
     }
     res.status(200).json({ message: "✅ Ви отримали список менеджерів!", managers });
  } catch (err) {
     console.error("❌ Помилка отримання списку менеджерів: ", err);
     res.status(500).json({ error: "❌ Помилка сервера" });
  }
});
app.post(env.MANAGER_LOG_IN, async (req, res) => {
   try {
      const { name, password } = req.body;
      if (!name || !password) {
         return res.status(400).json({ error: "❌ Ім'я та пароль є обов'язковими!" });
      }

      const manager = await ManagerScheme.findOne({ name: name });
      if (!manager) {
         return res.status(400).json({ error: "❌ Неправильне ім'я менеджера або пароль" });
      }

      const isPasswordValid = await bcrypt.compare(password, manager.password);
      if (!isPasswordValid) {
         return res.status(400).json({ error: "❌ Неправильне ім'я менеджера або пароль" });
      }
     
      res.status(200).json({ message: "✅ Вхід успішний!", data: manager.name });
   } catch (err) {
      console.error("❌ Помилка входу:", err);
      res.status(500).json({ error: "❌ Помилка сервера" });
   }
});
app.post(env.ADD_CARD_ADDITION, upload.single("docPDF"), async (req, res) => {
   try {
      const {
           docId,
           docType,
           docNumber,
           docCreateDate,
           docSigningDate,
           name,
           validityPeriod,
           organizationName,
           organisationCode,
           counterpartyName,
           counterpartyCode,
           content,
           contractType,
           addition,
           author,
           createDate,
      } = req.body;

      if (!req.file) {
         return res.status(400).json({ message: "❌ Файл не завантажено" });
      }
      if (!req.file.mimetype.includes("pdf")) {
         return res.status(400).json({ error: "❌ Дозволені лише PDF-файли" });
      }

      if(
           !docType || 
           !docNumber || 
           !docCreateDate || 
           !docSigningDate || 
           !name || 
           !validityPeriod || 
           !organizationName ||
           !organisationCode || 
           !counterpartyName || 
           !counterpartyCode || 
           !content || 
           !contractType || 
           !author || 
           !createDate
         ) { 
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ error: "❌ Заповнені не всі поля!" }) 
           }

      const docCard = await DocCardScheme.create({
           docType: docType,
           docNumber: docNumber,
           docPDF: req.file.filename,
           docCreateDate: docCreateDate,
           docSigningDate: docSigningDate,
           name: name,
           validityPeriod: validityPeriod,
           organizationName: organizationName,
           organisationCode: organisationCode,
           counterpartyName: counterpartyName,
           counterpartyCode: counterpartyCode,
           content: content,
           contractType: contractType,
           addition: addition,
           author: author,
           createDate: createDate,
      });

      if(docId){
         await DocCardScheme.updateOne({_id:docId}, {$push:{addition:docCard._id}}); // передаємо id додатку
         await DocCardScheme.updateOne({_id:docCard._id}, {$push:{addition:docId}}); // передаємо id батьківської картки
         return res.status(201).json({ message: "✅ Додаток успішно створено!" });
      }

      return res.status(201).json({ message: "✅ Картку успішно створено!" });
   } catch (err) {
      console.error("❌ Помилка створення картки: ", err);
      res.status(500).json({ error: "❌ Помилка сервера" });
   }
});
app.post(env.DELETE_CARD, async (req, res) => {
   try {
      const { docId } = req.body;

      const docCard = await DocCardScheme.findById(docId);
      if (!docCard) {
         return res.status(404).json({ error: "❌ Документна картка не знайдена!" });
      }
      
      await DocCardScheme.deleteOne({ _id: docId });
      fs.unlink(path.join(__dirname, 'pdf-files', docCard.docPDF), (err) => {
         if (err) {
            return res.status(400).json({ error: "❌ Помилка видалення файлу: " + err });
         }
      });

      res.status(200).json({ message: "✅ Документну картку успішно видалено!" });
   } catch (err) {
      console.error("❌ Помилка видалення картки: ", err);
      res.status(500).json({ error: "❌ Помилка сервера" });
   }
});
app.post(env.UPDATE_CARD, upload.single("docPDF"), async (req, res) => {
   try {
     const {
       docId,
       docType,
       docNumber,
       docCreateDate,
       docSigningDate,
       name,
       validityPeriod,
       organizationName,
       organisationCode,
       counterpartyName,
       counterpartyCode,
       content,
       contractType,
       author,
       createDate,
     } = req.body;
 
     const cardDoc = await DocCardScheme.findOne({ _id: docId });
     if (!cardDoc) {
       return res.status(400).json({ error: "❌ Картка не знайдена!" });
     }
 
     let updateFields = {};
     const fieldsToCheck = [
       { field: 'docType', value: docType },
       { field: 'docNumber', value: docNumber },
       { field: 'docCreateDate', value: docCreateDate },
       { field: 'docSigningDate', value: docSigningDate },
       { field: 'name', value: name },
       { field: 'validityPeriod', value: validityPeriod },
       { field: 'organizationName', value: organizationName },
       { field: 'organisationCode', value: organisationCode },
       { field: 'counterpartyName', value: counterpartyName },
       { field: 'counterpartyCode', value: counterpartyCode },
       { field: 'content', value: content },
       { field: 'contractType', value: contractType },
       { field: 'author', value: author },
       { field: 'createDate', value: createDate },
     ];
     fieldsToCheck.forEach(({ field, value }) => {
       if (value && value !== cardDoc[field]) {
         updateFields[field] = value;
       }
     });

     if (req.file) {
         fs.unlink(path.join(__dirname, 'pdf-files', cardDoc.docPDF), (err) => {
            if (err) {
               return res.status(400).json({ error: "❌ Помилка видалення файлу: " + err });
            }
         });
         updateFields.docPDF = req.file.filename;
     }
     if (Object.keys(updateFields).length === 0) {
       return res.status(400).json({ message: "❌ Жодне поле не було оновлено!" });
     }
 
     const updatedCard = await DocCardScheme.findOneAndUpdate(
       { _id: docId },
       { $set: updateFields },
       { new: true }
     );
 
     return res.status(200).json({ message: "✅ Картку успішно оновлено!", data: updatedCard });
   } catch (err) {
     console.error("❌ Помилка оновлення картки:", err);
     return res.status(500).json({ error: "❌ Помилка сервера" });
   }
});


