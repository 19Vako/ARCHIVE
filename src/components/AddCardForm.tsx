import "../screens/styles/manager.css";
import "./styles/addCard.css";
import React, { useState, useEffect } from "react";
import { useStore } from "../context/Context";
import { reverseWord, today, formatDateForInput } from "../utils/Utils";

function AddCardForm() {
  const {
    userName,
    formData,
    setFormData,
    fileName,
    setFileName,
    setFile,
    setPdfURL,
    setShowApproveModal,
    showAddition,
  } = useStore();
  useEffect(() => {
    if (userName) {
      setFormData((prev: any) => ({
        ...prev,
        author: userName,
        createDate: reverseWord(today),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName, setFormData]);
  const [fileLog, setFileLog] = useState(false);
  const [modalDataName, setModalDataName] = useState("");
  const [titleModalDataName, setTitleModalDataName] = useState("");
  const [openDataModal, setOpenDataModal] = useState(false);


  const handleFileChoose = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files?.[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setPdfURL(reader.result as string);
      };
      setFileName(file.name);
      setFile(e.target.files[0]);
    }
  };
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    if (["docCreateDate", "docSigningDate", "validityPeriod"].includes(name)) {
      const [year, month, day] = value.split("-");
      setFormData({ ...formData, [name]: `${day}-${month}-${year}` });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const openAddDataModal = (name: string, titleName: string) => {
    setTitleModalDataName(titleName);
    setModalDataName(name);
    openDataModal ? setOpenDataModal(false) : setOpenDataModal(true);
  };
  const openApproveModal = () => {
    if (fileName) {
      setShowApproveModal(true);
      setFileLog(false);
    } else {
      setFileLog(true);
    }
  };

  return (
    <>
      {showAddition ? (
        <h1>Створити додаток</h1>
      ) : (
        <h1>Додати картку документу</h1>
      )}
      <div className="addCardFormInput">
        {openDataModal && (
          <div className="AddDataModal">
            <h1>{titleModalDataName}</h1>
            <textarea
              name={modalDataName}
              value={formData[modalDataName]}
              onChange={handleChange}
            />
            <button onClick={() => setOpenDataModal(false)}>Підтвердити</button>
          </div>
        )}
        <div className="inputsContainer">
          <div className="addInput">
            <h1>Тип Документа:</h1>
            <select
              name="contractType"
              value={formData.contractType}
              onChange={handleChange}
              className={formData.contractType ? "input-filled" : "input-empty"}
            >
              <option value="">Тип Документа</option>
              <option value="Договір">Договір</option>
              <option value="Наказ">Наказ</option>
            </select>
          </div>
          <div className="addInput">
            <h1>Дата створення:</h1>
            <input
              type="date"
              name="docCreateDate"
              value={formatDateForInput(formData.docCreateDate)}
              onChange={handleChange}
              placeholder="дата створення"
              className={
                formData.docCreateDate ? "input-filled" : "input-empty"
              }
            />
          </div>
          <div className="addInput">
            <h1>Дата підписання:</h1>
            <input
              type="date"
              name="docSigningDate"
              value={formatDateForInput(formData.docSigningDate)}
              onChange={handleChange}
              placeholder="дата підписання"
              className={
                formData.docSigningDate ? "input-filled" : "input-empty"
              }
            />
          </div>
          <div className="addInput">
            <h1>Срок дії:</h1>
            <input
              type="date"
              name="validityPeriod"
              value={formatDateForInput(formData.validityPeriod)}
              onChange={handleChange}
              placeholder="Срок дії"
              className={
                formData.validityPeriod ? "input-filled" : "input-empty"
              }
            />
          </div>
        </div>

        <div className="inputsContainer">
          <div className="addInput" style={{ height: "3vw" }}>
            <h1>Найменування:</h1>
            <textarea
              name="name"
              onClick={() => openAddDataModal("name", "Найменування:")}
              value={formData.name}
              onChange={handleChange}
              style={{ width: "12vw", height: "3vw" }}
              placeholder="Найменування"
              className={formData.name ? "input-filled" : "input-empty"}
            />
          </div>
          <div className="addInput">
            <h1>Найменування організації:</h1>
            <input
              name="organizationName"
              onClick={() =>
                openAddDataModal(
                  "organizationName",
                  "Найменування організації:",
                )
              }
              value={formData.organizationName}
              onChange={handleChange}
              placeholder="Найменування організації"
              className={
                formData.organizationName ? "input-filled" : "input-empty"
              }
            />
          </div>
          <div className="addInput">
            <h1>Код ЄДРПОУ організації:</h1>
            <input
              name="organisationCode"
              onClick={() =>
                openAddDataModal("organisationCode", "Код ЄДРПОУ організації:")
              }
              value={formData.organisationCode}
              onChange={handleChange}
              placeholder="Код ЄДРПОУ організації"
              className={
                formData.organisationCode ? "input-filled" : "input-empty"
              }
            />
          </div>
          <div className="addInput">
            <h1>Код ЄДРПОУ контрагента:</h1>
            <input
              name="counterpartyCode"
              onClick={() =>
                openAddDataModal("counterpartyCode", "Код ЄДРПОУ контрагента:")
              }
              value={formData.counterpartyCode}
              onChange={handleChange}
              placeholder="Код ЄДРПОУ контрагента"
              className={
                formData.counterpartyCode ? "input-filled" : "input-empty"
              }
            />
          </div>
        </div>

        <div className="inputsContainer">
          <div className="addInput">
            <h1>Тип Договору:</h1>
            <select
              name="docType"
              value={formData.docType}
              onChange={handleChange}
              className={formData.docType ? "input-filled" : "input-empty"}
            >
              <option value="">Тип Договору</option>
              <option value="Продаж">Продаж</option>
              <option value="Замовлення">Замовлення</option>
              <option value="Надання послуг">Надання послуг</option>
              <option value="Отримання послуг">Отримання послуг</option>
            </select>
          </div>
          <div className="addInput">
            <h1>Особистий номер:</h1>
            <input
              name="docNumber"
              onClick={() => openAddDataModal("docNumber", "Особистий номер:")}
              value={formData.docNumber}
              onChange={handleChange}
              placeholder="Особистий номер документу"
              className={formData.docNumber ? "input-filled" : "input-empty"}
            />
          </div>
          <div className="addInput">
            <h1>Найменування контрагенту:</h1>
            <input
              name="counterpartyName"
              onClick={() =>
                openAddDataModal(
                  "counterpartyName",
                  "Найменування контрагенту:",
                )
              }
              value={formData.counterpartyName}
              onChange={handleChange}
              placeholder="Найменування контрагенту"
              className={
                formData.counterpartyName ? "input-filled" : "input-empty"
              }
            />
          </div>
        </div>
      </div>
      <div className="choosePDFContainer">
        <input
          id="pdfUpload"
          type="file"
          accept="application/pdf"
          onChange={handleFileChoose}
          style={{ display: "none" }}
        />
        <label htmlFor="pdfUpload" className="custom-file-label">
          Виберіть файл
        </label>
        <span>{fileName}</span>
      </div>
      <div className="contentContainer">
        <h1>Короткий зміст:</h1>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Введіть текст..."
          className={formData.content ? "input-filled" : "input-empty"}
        />
      </div>
      {fileLog && (
        <h1 style={{ color: "red", fontSize: "1vw", margin: 0, marginTop: 0 }}>
          ❌ Файл не вибраний!
        </h1>
      )}
      <div className="addButtons">
        <button onClick={() => openApproveModal()}>Додати</button>
      </div>
    </>
  );
}

export default AddCardForm;
