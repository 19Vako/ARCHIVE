import React, { useEffect } from "react";
import axios from "axios";
import { useStore } from "../context/Context";
import "../components/styles/addCard.css";
import "../screens/styles/manager.css";
import { reverseWord, today } from "../utils/Utils";
const env = process.env;

function ManagerShowCard() {
  const {
    userName,
    setCards,
    setShowCard,
    setShowCardDataLog,
    showCardDataLog,
    formData,
    setFormData,
    showSaveChangesButton,
    setShowSaveChangesButton,
    setShowFilter,
    fileName,
    setFileName,
    file,
    setFile,
    setFilterLog,
    showCardPDF,
    setShowCardPDF,
    setGetCardError,
    setAdditions,
    additions,
    setShowAddition,
    findAuthor,
    filterFormData,
    setFilterFormData,
    setShowAddAddition,
    setLoading,
    setHasMore,
    setPage,
  } = useStore();
  useEffect(() => {
    if (userName) {
      setFormData((prev: any) => ({
        ...prev,
        author: userName,
        createDate: reverseWord(today),
      }));
    }
  }, [userName, setFormData]);
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
    await axios.post(env.REACT_APP_GET_CARDS!)
    .then((data) => {
      setCards(data.data.cards)
    })
    .catch((err) => {
      setGetCardError(err.response.data.error)
    })
  };
  useEffect(() => {
    GetCards()
  }, []);




  const GetAdditions = async (_id: any) => {
    await axios
      .post(env.REACT_APP_GET_ADDITIONCARDS!, { docId: _id })
      .then((data) => {
        setAdditions(data.data.data);
      })
      .catch((err) => {
        console.log(err.response.data.error);
      });
  };
  const choiseListCard = (card: any) => {
    setShowFilter(true);
    setShowCard(true);
    setFormData({ ...card });
    setShowCardPDF((prev: any) => ({ ...prev, fileName: card.docPDF }));
    setShowCardDataLog("");
    setFile("");
    setFileName("");
    setShowSaveChangesButton(false);
    setShowAddition(false);
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
      .post(env.REACT_APP_UPDATE_CARD!, data)
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
      .post(env.REACT_APP_DELETE_CARD!, { docId: formData._id })
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
        {formData._id && (
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
                  <p>{formData.name}</p>
                </div>

                <div className="cardDataTitle">
                  <h1>Автор:</h1>
                  <p>{formData.author}</p>
                </div>

                <div className="cardDataTitle">
                  <h1>Тип договору:</h1>
                  <p>{formData.contractType}</p>
                </div>

                <div className="cardDataTitle">
                  <h1>Тип документу:</h1>
                  <p>{formData.docType}</p>
                </div>

                <div className="cardDataTitle">
                  <h1>Найменування контерагента:</h1>
                  <p>{formData.counterpartyCode}</p>
                </div>

                <div className="cardDataTitle">
                  <h1>Дата створення:</h1>
                  <p>{formData.docCreateDate}</p>
                </div>

                <div className="cardDataTitle">
                  <h1>Дата підписання:</h1>
                  <p>{formData.docSigningDate}</p>
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
                  <p>{formData.organizationName}</p>
                </div>

                <div className="cardDataTitle">
                  <h1>Код ЄДРПОУ організації:</h1>
                  <p>{formData.organisationCode}</p>
                </div>

                <div className="cardDataTitle">
                  <h1>Код ЄДРПОУ контрагента:</h1>
                  <p>{formData.counterpartyCode}</p>
                </div>
              </div>
            </div>
            <button className="saveCangesButton" onClick={() => changeCard()}>
              Зберегти зміни
            </button>
          </>
        )}
      </div>
      <div className="cardDataTitleContent">
        <h1>Короткий зміст:</h1>
        <textarea name="content" value={formData.content} />
      </div>
      <iframe
        className="cardPdfDocContainer"
        title="Doc"
        src={`${showCardPDF.nameHostAndPort}${showCardPDF.fileName}`}
      />
    </>
  );
}

export default ManagerShowCard;
