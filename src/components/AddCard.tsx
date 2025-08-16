/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable react-hooks/exhaustive-deps */

import "./styles/addCard.css";

import { useEffect } from "react";
import { useStore } from "../context/Context";
import { reverseWord, today } from "../utils/Utils";
import axios from "axios";

import FilterCard from "./FilterCard";
import CardList from "./CardList";
import AddCardForm from "./AddCardForm";
import ApproveModal from "./ApproveModal";

function AddCard() {
  const env = process.env;
  const {
    userName,
    setCards,
    setFormData,
    showFilter,
    setShowFilter,
    setShowAddition,
    showApproveModal,
    setGetCardError,
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

  const GetCards = async () => {
    await axios.post(env.REACT_APP_GET_CARDS!, {page:1})
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


  const cleanInputs = () => {
    setFormData(initialFormData);
  };
  const choiceFilter = () => {
    setShowFilter(true);
    cleanInputs();
    setShowAddition(false);
    setCards([]);
  };

  return (
    <div className="addCardContainer">
      <div className="cardListContainer">
        <div className="cardListTitle">
          <h1>Фільтрувати архів</h1>
          <button onClick={() => choiceFilter()}>
            <img src={require("../icons/filter.png")} alt="" />
          </button>
        </div>
        <CardList />
      </div>

      {!showFilter ? (
        <div className="addCardForm">
          {!showApproveModal ? <AddCardForm /> : <ApproveModal />}
        </div>
      ) : (
        <FilterCard />
      )}
    </div>
  );
}

export default AddCard;
