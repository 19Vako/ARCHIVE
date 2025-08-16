/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import axios from "axios";
import { useStore } from "../context/Context";
import Header from "../components/Header";
import AddAddition from "../components/AddAddition";
import "../components/styles/addCard.css";
import "./styles/manager.css";
import CardList from "../components/CardList";
import AddCardForm from "../components/AddCardForm";
import ApproveModal from "../components/ApproveModal";
import { reverseWord, today } from "../utils/Utils";
import ManagerFilter from "../components/ManagerFilter";
import ManagerShowCard from "../components/ManagerShowCard";
const env = process.env;

function Manager() {
  const {
    userName,
    setCards,
    showCard,
    setShowCard,
    formData,
    setFormData,
    showFilter,
    setShowFilter,
    setGetCardError,
    setShowAddition,
    setFilterFormData,
    showAddAddition,
    showApproveModal,
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

  const cleanInputs = () => {
    setFilterFormData(initialFormData);
    setFormData(initialFormData);
  };
  const choiceFilter = () => {
    setShowFilter(true);
    setShowCard(false);
    cleanInputs();
    setShowAddition(false);
  };

  return (
    <>
      <Header />
      <div className="manaderContainer">
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
            <>
              <ManagerFilter />

              <div className="cardBlockContainer">
                {formData._id && (
                  <div className="cardContainer">
                    {showCard ? (
                      <>
                        {showAddAddition ? (
                          <AddAddition />
                        ) : (
                          <ManagerShowCard />
                        )}
                      </>
                    ) : null}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Manager;
