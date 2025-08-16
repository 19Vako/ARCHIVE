import "./styles/filterCard.css";

import React, { useEffect, useState } from "react";
import { useStore } from "../context/Context";
import axios from "axios";
import CardList from "./CardList";
import AdditionCardList from "./AdditionCardList";
import { today, reverseWord, formatDateForInput } from "../utils/Utils";
const env = process.env;

function ManagerFilter() {
  const {
    setLoading,
    setHasMore,
    setPage,
    userName,
    setCards,
    setFormData,
    setShowFilter,
    setGetCardError,
    filterLog,
    setFilterLog,
    findAuthor,
    setFindAuthor,
    createCardError,
    setCreateCardError,
    showCard,
    setShowCard,
    setShowCardDataLog,
    setShowSaveChangesButton,
    filterFormData,
    setFilterFormData,
    showAddAddition,
    setShowAddAddition,
  } = useStore();
  const [modalDataName, setModalDataName] = useState("");
  const [titleFilterModalDataName, setTitleFilterModalDataName] = useState("");
  const [openFilterModal, setOpenFilterModal] = useState(false);

  
  const GetCards = async () => {
    await axios.post(env.REACT_APP_GET_CARDS!)
    .then((data) => {
      setCards(data.data.cards)
    })
    .catch((err) => {
      setGetCardError(err.response.data.error)
    })
  };


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
    addition: [],
    author: userName,
    createDate: reverseWord(today),
  };
  const handleChange = (
    e: React.ChangeEvent< HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement >,
  ) => {
    const { name, value } = e.target;
    if (["docCreateDate", "docSigningDate", "validityPeriod"].includes(name)) {
      const [year, month, day] = value.split("-");
      setFilterFormData({
        ...filterFormData,
        [name]: `${day}-${month}-${year}`,
      });
    } else {
      setFilterFormData({ ...filterFormData, [name]: value });
    }
  };
  const filterCard = async () => {
    await axios
      .post(env.REACT_APP_FIND_CARDS!, {
        docType: filterFormData.docType,
        docNumber: filterFormData.docNumber,
        docCreateDate: filterFormData.docCreateDate,
        docSigningDate: filterFormData.docSigningDate,
        name: filterFormData.name,
        author: findAuthor,
        validityPeriod: filterFormData.validityPeriod,
        organizationName: filterFormData.organizationName,
        organisationCode: filterFormData.organisationCode,
        counterpartyName: filterFormData.counterpartyName,
        counterpartyCode: filterFormData.counterpartyCode,
        contractType: filterFormData.contractType,
      })
      .then((res) => {
        setCards(res.data.data);
        setFilterLog("");
        setCreateCardError(false);
      })
      .catch((err) => {
        setCreateCardError(true);
        setFilterLog(err.response.data.error);
      });
  };
  const cleanInputs = () => {
    setFilterFormData(initialFormData);
    setFormData(initialFormData);
  };
  const openFilterDataModal = (name: string, titleName: string) => {
    setTitleFilterModalDataName(titleName);
    setModalDataName(name);
    openFilterModal ? setOpenFilterModal(false) : setOpenFilterModal(true);
  };
  
  return (
    <>
      {showAddAddition ? (
        <div className="cardAdditionListContainer">
          <div className="filterAdditionTitle">
            <h1>Виберіть картку посилання</h1>
          </div>
          <AdditionCardList />
        </div>
      ) : (
        <div className="cardFilterListContainer">
          <CardList />
        </div>
      )}
      <div className="filterContainer">
        <div className="filterTitle">
          <button
            onClick={() => {
              setShowFilter(false);
              setShowCard(false);
              setShowCardDataLog("");
              setFormData(initialFormData);
              setFilterFormData(initialFormData);
              setShowSaveChangesButton(false);
              setShowFilter(false);
              setShowAddAddition(false);
            }}
          >
            ←
          </button>
          <h1>Фільтри</h1>
          <button
            onClick={() => {
              cleanInputs();
              GetCards();
              setFilterLog("");
            }}
          >
            <img src={require("../icons/rotation.png")} alt="" />
          </button>
        </div>
        <div className="filterCardFormInput">
          {openFilterModal && (
            <div className="FilterDataModal">
              <h1>{titleFilterModalDataName}</h1>
              <textarea
                name={modalDataName}
                value={filterFormData[modalDataName]}
                onChange={handleChange}
              />
              <button onClick={() => setOpenFilterModal(false)}>
                Підтвердити
              </button>
            </div>
          )}
          <div className="inputsContainer">
            <div className="addInput">
              <h1>Тип Договору:</h1>
              <select
                name="docType"
                value={filterFormData.docType}
                onChange={handleChange}
                className={
                  filterFormData.docType ? "input-filled" : "input-empty"
                }
              >
                <option value="">Тип Договору</option>
                <option value="Продаж">Продаж</option>
                <option value="Замовлення">Замовлення</option>
                <option value="Надання послуг">Надання послуг</option>
                <option value="Отримання послуг">Отримання послуг</option>
              </select>
            </div>
            <div className="addInput">
              <h1>Дата створення:</h1>
              <input
                type="date"
                name="docCreateDate"
                value={formatDateForInput(filterFormData.docCreateDate)}
                onChange={handleChange}
                placeholder="дата створення"
                className={
                  filterFormData.docCreateDate ? "input-filled" : "input-empty"
                }
              />
            </div>
            <div className="addInput">
              <h1>Дата підписання:</h1>
              <input
                type="date"
                name="docSigningDate"
                value={formatDateForInput(filterFormData.docSigningDate)}
                onChange={handleChange}
                placeholder="дата підписання"
                className={
                  filterFormData.docSigningDate ? "input-filled" : "input-empty"
                }
              />
            </div>
            <div className="addInput">
              <h1>Срок дії:</h1>
              <input
                type="date"
                name="validityPeriod"
                value={formatDateForInput(filterFormData.validityPeriod)}
                onChange={handleChange}
                placeholder="Срок дії"
                className={
                  filterFormData.validityPeriod ? "input-filled" : "input-empty"
                }
              />
            </div>
          </div>
          <div className="inputsContainer">
            <div className="addInput" style={{ height: "3vw" }}>
              <h1>Найменування:</h1>
              <textarea
                name="name"
                onClick={() => openFilterDataModal("name", "Найменування:")}
                value={filterFormData.name}
                onChange={handleChange}
                style={{ width: "12vw", height: "3vw" }}
                placeholder="Найменування"
                className={filterFormData.name ? "input-filled" : "input-empty"}
              />
            </div>
            <div className="addInput">
              <h1>Найменування організації:</h1>
              <input
                name="organizationName"
                onClick={() =>
                  openFilterDataModal(
                    "organizationName",
                    "Найменування організації:",
                  )
                }
                value={filterFormData.organizationName}
                onChange={handleChange}
                placeholder="Найменування організації"
                className={
                  filterFormData.organizationName
                    ? "input-filled"
                    : "input-empty"
                }
              />
            </div>
            <div className="addInput">
              <h1>Код ЄДРПОУ організації:</h1>
              <input
                name="organisationCode"
                onClick={() =>
                  openFilterDataModal(
                    "organisationCode",
                    "Код ЄДРПОУ організації:",
                  )
                }
                value={filterFormData.organisationCode}
                onChange={handleChange}
                placeholder="Код ЄДРПОУ організації"
                className={
                  filterFormData.organisationCode
                    ? "input-filled"
                    : "input-empty"
                }
              />
            </div>
            <div className="addInput">
              <h1>Код ЄДРПОУ контрагента:</h1>
              <input
                name="counterpartyCode"
                onClick={() =>
                  openFilterDataModal(
                    "counterpartyCode",
                    "Код ЄДРПОУ контрагента:",
                  )
                }
                value={filterFormData.counterpartyCode}
                onChange={handleChange}
                placeholder="Код ЄДРПОУ контрагента"
                className={
                  filterFormData.counterpartyCode
                    ? "input-filled"
                    : "input-empty"
                }
              />
            </div>
          </div>
          <div className="inputsContainer">
            <div className="addInput">
              <h1>Тип Документа:</h1>
              <select
                name="contractType"
                value={filterFormData.contractType}
                onChange={handleChange}
                className={
                  filterFormData.contractType ? "input-filled" : "input-empty"
                }
              >
                <option value="">Тип Документа</option>
                <option value="Договір">Договір</option>
                <option value="Наказ">Наказ</option>
              </select>
            </div>
            <div className="addInput">
              <h1>Автор:</h1>
              <input
                name="author"
                onClick={() => openFilterDataModal("author", "Автор:")}
                value={findAuthor}
                onChange={(e) => setFindAuthor(e.target.value)}
                placeholder="Автор"
                className={findAuthor ? "input-filled" : "input-empty"}
              />
            </div>
            <div className="addInput">
              <h1>Найменування контрагенту:</h1>
              <input
                name="counterpartyName"
                onClick={() =>
                  openFilterDataModal(
                    "counterpartyName",
                    "Найменування контрагенту:",
                  )
                }
                value={filterFormData.counterpartyName}
                onChange={handleChange}
                placeholder="Найменування контрагенту"
                className={
                  filterFormData.counterpartyName
                    ? "input-filled"
                    : "input-empty"
                }
              />
            </div>
          </div>
        </div>
        <div className="filterButtons">
          <button onClick={() => filterCard()}>Фільтрувати</button>
        </div>
        <h1
          style={createCardError ? { color: "red" } : { color: "green" }}
          className="filterErrorTitle"
        >
          {filterLog}
        </h1>
      </div>
    </>
  );
}

export default ManagerFilter;
