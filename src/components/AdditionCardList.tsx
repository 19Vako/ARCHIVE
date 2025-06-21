/* eslint-disable react-hooks/exhaustive-deps */
import "./styles/showCard.css";
import "./styles/addAddition.css";
import "./styles/addCard.css";

import { useEffect } from "react";
import axios from "axios";
import { useStore } from "../context/Context";
require("dotenv").config({ path: "../../.env" });
const env = process.env;

function AdditionCardList() {
  const {
    setCards,
    setGetCardError,
    cards,
    setShowCard,
    getCardError,
    setAdditions,
    setShowAddition,
    setShowAddAdditionData,
    setShowAddAdditionCardPDF,
    setAddAdditionLog,
    page,
    setPage,
    loading,
    setLoading,
    hasMore,
    setHasMore,
  } = useStore();

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
  const fetchCards = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await axios.post(env.GET_CARDS!, { page: page, limit: 50 });
      const newCards = res.data.cards || [];
      const updatedCards = [...cards, ...newCards];
      setCards(updatedCards);

      setPage((prev: number) => prev + 1);
      if (newCards.length < 50) {
        setHasMore(false);
      }
    } catch (err: any) {
      setGetCardError(
        err?.response?.data?.error || "Помилка при завантаженні карток",
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 300 &&
        !loading &&
        hasMore
      ) {
        fetchCards();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, hasMore]);
  useEffect(() => {
    fetchCards();
  }, []);
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
    <div className="cardList">
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
