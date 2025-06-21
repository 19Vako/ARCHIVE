/* eslint-disable react-hooks/rules-of-hooks */
import "./styles/showCard.css";

import React from "react";
import { useStore } from "../context/Context";
import axios from "axios";
import AddAddition from "./AddAddition";
import { reverseWord, today } from "../utils/Utils";
require("dotenv").config({ path: "../../.env" });
const env = process.env;

function ShowCard() {
  const {
    setPage,
    setHasMore,
    setLoading,
    setCards,
    setShowCard,
    showCardDataLog,
    setShowCardDataLog,
    formData,
    setFormData,
    userName,
    setShowSaveChangesButton,
    showSaveChangesButton,
    setShowFilter,
    fileName,
    setFileName,
    file,
    setFile,
    setPdfURL,
    showCardPDF,
    setShowCardPDF,
    setGetCardError,
    additions,
    setAdditions,
    setShowAddition,
    showAddAddition,
    setShowAddAddition,
  } = useStore();
  const initialFormData = {
    _id: "",
    docId: "",
    docType: "",
    docNumber: "",
    docCreateDate: "",
    docSigningDate: "",
    name: "",
    validityPeriod: "",
    organizationName: "",
    organisationCode: "",
    counterpartyName: "",
    counterpartyCode: "",
    content: "",
    contractType: "",
    author: userName,
    createDate: reverseWord(today),
  };
  const initialAddition = {
    _id: "",
    docId: formData._id,
    docType: "",
    docNumber: "",
    docCreateDate: "",
    docSigningDate: "",
    name: "",
    validityPeriod: "",
    organizationName: "",
    organisationCode: "",
    counterpartyName: "",
    counterpartyCode: "",
    content: "",
    contractType: "",
    addition: [],
    author: userName,
    createDate: reverseWord(today),
  };

  const GetCards = async () => {
    setLoading(true);
    setGetCardError(null); // обнуляем возможную старую ошибку

    try {
      const res = await axios.post(env.GET_CARDS!, { page: 1, limit: 50 });
      const newCards = res.data.cards || [];
      setCards(newCards);
      setHasMore(newCards.length === 50);
      setPage(1);
    } catch (err: any) {
      setGetCardError(
        err?.response?.data?.error || "Помилка при завантаженні карток",
      );
    } finally {
      setLoading(false);
    }
  };
  const GetAdditions = async (_id: any) => {
    await axios
      .post(env.GET_ADDITIONCARDS!, { docId: _id })
      .then((data) => {
        setAdditions(data.data.data);
      })
      .catch((err) => {
        console.log(err.response.data.error);
      });
  };
  const handleFileChoose = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files?.[0];
      setFileName(file.name);
      setFile(e.target.files[0]);
      setPdfURL(URL.createObjectURL(e.target.files[0]));
    }
  };
  const choiseListCard = (card: any) => {
    setShowCard(true);
    setFormData({ ...card });
    setShowCardPDF((prev: any) => ({ ...prev, fileName: card.docPDF }));
    setShowCardDataLog("");
    setFile("");
    setFileName("");
    setShowSaveChangesButton(false);
    GetAdditions(card._id);
  };
  const changeCard = async () => {
    const data = new FormData();
    Object.entries(formData as Record<string, any>).forEach(([key, value]) => {
      data.append(key, value);
    });
    data.append("docPDF", file);
    data.append("docId", formData._id);

    await axios
      .post(env.UPDATE_CARD!, data)
      .then((data) => {
        GetCards();
        choiseListCard(data.data.data);
        setShowCardDataLog(data.data.message);
      })
      .catch((err) => {
        setShowCardDataLog(err.response.data.error);
        console.log(err);
      });
  };
  const handleChangeCard = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setShowSaveChangesButton(true);
  };
  const deleteCard = async () => {
    await axios
      .post(env.DELETE_CARD!, { docId: formData._id })
      .then((data) => {
        setShowCardDataLog(data.data.message);
        GetCards();
        setFormData(initialFormData);
      })
      .catch((err) => {
        setShowCardDataLog(err.response.data.error);
      });
  };

  return (
    <>
      {showAddAddition ? (
        <AddAddition />
      ) : (
        <>
          <div className="cardContainerBlock">
            <div className="cardDataButtons">
              <div className="cardDataButtonsContainer">
                <button
                  onClick={() => {
                    setShowCard(false);
                    setShowCardDataLog("");
                    setFormData(initialAddition);
                    setShowSaveChangesButton(false);
                    setShowFilter(false);
                    setShowAddition(true);
                  }}
                >
                  Створити посилання
                </button>
                <button
                  onClick={() => {
                    setShowAddAddition(true);
                    setShowCard(false);
                  }}
                >
                  Додати посилання
                </button>
                <button>Відправити на 1С</button>
                <input
                  id="pdfUpload"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChoose}
                  style={{ display: "none" }}
                />
                <label
                  htmlFor="pdfUpload"
                  onClick={() => setShowSaveChangesButton(true)}
                  className="changeFileButton"
                >
                  Замінити файл
                </label>
                <h1 className="showFileTitle">{fileName}</h1>
                <button className="deleteCard" onClick={() => deleteCard()}>
                  Видалити
                </button>
                <h1>{showCardDataLog}</h1>
              </div>
              <div className="additionList">
                {additions ? (
                  additions
                    .slice()
                    .reverse()
                    .map((card: any, index: any) => (
                      <div
                        key={index}
                        onClick={() => choiseListCard(card)}
                        className="additionBlockContainer"
                      >
                        <h1>Організація: {card.organizationName}</h1>
                        <h1>Дата створення: {card.docCreateDate}</h1>
                        <h1>Срок дії до: {card.validityPeriod}</h1>
                      </div>
                    ))
                ) : (
                  <h1>❌ Список посилань пустий</h1>
                )}
              </div>
            </div>
            <>
              <div
                className="cardDataContainerBox"
                style={
                  showSaveChangesButton
                    ? { height: "31vw" }
                    : { height: "34.3vw" }
                }
              >
                <div className="cardDataContainer">
                  <div className="cardDataTitle">
                    <h1>Найменування:</h1>
                    <textarea
                      name="name"
                      value={formData.name}
                      onChange={handleChangeCard}
                    />
                  </div>
                  <div className="cardDataTitle">
                    <h1>Автор:</h1>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleChangeCard}
                    />
                  </div>
                  <div className="cardDataTitle">
                    <h1>Тип договору:</h1>
                    <select onChange={handleChangeCard}>
                      <option value="">{formData.contractType}</option>
                      <option value="Продаж">Продаж</option>
                      <option value="Замовлення">Замовлення</option>
                      <option value="Надання послуг">Надання послуг</option>
                      <option value="Отримання послуг">Отримання послуг</option>
                    </select>
                  </div>
                  <div className="cardDataTitle">
                    <h1>Тип документу:</h1>
                    <select onChange={handleChangeCard}>
                      <option value="">{formData.docType}</option>
                      <option value="Договір">Договір</option>
                      <option value="Наказ">Наказ</option>
                    </select>
                  </div>
                  <div className="cardDataTitle">
                    <h1>Найменування контерагента:</h1>
                    <input
                      type="text"
                      name="counterpartyCode"
                      value={formData.counterpartyCode}
                      onChange={handleChangeCard}
                    />
                  </div>
                  <div className="cardDataTitle">
                    <h1>Дата створення:</h1>
                    <input
                      type="text"
                      name="docCreateDate"
                      value={formData.docCreateDate}
                      onChange={handleChangeCard}
                    />
                  </div>
                  <div className="cardDataTitle">
                    <h1>Дата підписання:</h1>
                    <input
                      type="text"
                      name="docSigningDate"
                      value={formData.docSigningDate}
                      onChange={handleChangeCard}
                    />
                  </div>
                  <div className="cardDataTitle">
                    <h1>Срок дії до:</h1>
                    <input
                      type="text"
                      name="validityPeriod"
                      value={formData.validityPeriod}
                      onChange={handleChangeCard}
                    />
                  </div>
                  <div className="cardDataTitle">
                    <h1>Найменування організації:</h1>
                    <input
                      type="text"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleChangeCard}
                    />
                  </div>
                  <div className="cardDataTitle">
                    <h1>Код ЄДРПОУ організації:</h1>
                    <input
                      type="text"
                      name="organisationCode"
                      value={formData.organisationCode}
                      onChange={handleChangeCard}
                    />
                  </div>
                  <div className="cardDataTitle">
                    <h1>Код ЄДРПОУ контрагента:</h1>
                    <input
                      type="text"
                      name="counterpartyCode"
                      value={formData.counterpartyCode}
                      onChange={handleChangeCard}
                    />
                  </div>
                </div>
              </div>
              <button
                className="saveCangesButton"
                onClick={() => {
                  changeCard();
                }}
              >
                Зберегти зміни
              </button>
            </>
          </div>
          <div className="cardDataTitleContent">
            <h1>Короткий зміст:</h1>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChangeCard}
            />
          </div>
          <iframe
            className="cardPdfDocContainer"
            title="Doc"
            src={`${showCardPDF.nameHostAndPort}${showCardPDF.fileName}`}
          />
        </>
      )}
    </>
  );
}

export default ShowCard;
