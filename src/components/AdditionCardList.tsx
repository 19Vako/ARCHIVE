/* eslint-disable react-hooks/exhaustive-deps */
import "./styles/showCard.css";
import "./styles/addAddition.css";
import "./styles/addCard.css";

import { useRef } from "react";
import axios from "axios";
import { useStore } from "../context/Context";
const env = process.env;

function AdditionCardList() {
  const listRef = useRef<HTMLDivElement>(null)
  const {
    cards,
    setShowCard,
    getCardError,
    setAdditions,
    setShowAddition,
    setShowAddAdditionData,
    setShowAddAdditionCardPDF,
    setAddAdditionLog,
  } = useStore();

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
  const choiseListAdditionCard = (card: any) => {
    setShowAddAdditionData({ ...card });
    setShowAddAdditionCardPDF((prev: any) => ({
      ...prev,
      fileName: card.docPDF,
    }));
    GetAdditions(card._id);
    setShowAddition(false);
    setAddAdditionLog("");
  };

  return (
    <div className="cardList" ref={listRef}>
      {Array.isArray(cards) && cards.length > 0 ? (
        cards
          .slice()
          .reverse()
          .map((card: any, index: any) => (
            <div
              key={index}
              onClick={() => {
                choiseListAdditionCard(card);
                setShowCard(true);
              }}
              className="CardBlockFilter"
            >
              <div className="cardBlockDateContainer">
                <h1>Організація: {card.organizationName}</h1>
                <h1>Дата створення: {card.docCreateDate}</h1>
                <h1>Срок дії до: {card.validityPeriod}</h1>
              </div>
            </div>
          ))
      ) : (
        <h1>{getCardError}</h1>
      )}
    </div>
  );
}

export default AdditionCardList;
