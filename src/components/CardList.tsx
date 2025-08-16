import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useStore } from "../context/Context";
const env = process.env;


export default function CardList() {
  const {
    setCards,
    cards,
    setFormData,
    setShowFilter,
    setShowCard,
    setShowCardPDF,
    setShowCardDataLog,
    setFile,
    setFileName,
    setShowSaveChangesButton,
    setAdditions,
    setShowAddition,
    setGetCardError
  } = useStore();

  const listRef = useRef<HTMLDivElement>(null)
  const [scrollCycles, setScrollCycles] = useState(1);

  const GetCards = async (page = 1, limit = 10) => {
    await axios.post(env.REACT_APP_GET_CARDS!, {page:page, limit:limit})
    .then((data) => {
      setCards(prev => [...prev, ...data.data.cards])
    })
    .catch((err) => {
      setGetCardError(err.response.data.error)
    })
  };

  useEffect(() => {
    GetCards();
  }, []);

  useEffect(() => {
    const vwThreshold = window.innerWidth * 0.40501;

    const listScroll = async (e: Event) => {
      const target = e.target as HTMLDivElement;
      const scrollTop = target.scrollTop;
      
      if(scrollTop >= vwThreshold * (scrollCycles + 1)) {
        GetCards(scrollCycles + 1)
        setScrollCycles((prev) => prev + 1);
      }
    } 

    const el = listRef.current
    if (!el) return;
   
    el.addEventListener('scroll', listScroll)

    return () => {
      if(el) el.removeEventListener('scroll', listScroll)
    }

  }, []);


  const chooseCard = (card: any) => {
    setShowCard(true);
    setShowFilter(true);
    setShowAddition(false);
    setFormData({ ...card });
    setShowCardPDF((prev: any) => ({ ...prev, fileName: card.docPDF }));
    setShowCardDataLog("");
    setFile("");
    setFileName("");
    setShowSaveChangesButton(false);

    axios
      .post(env.REACT_APP_GET_ADDITIONCARDS!, { docId: card._id })
      .then((d) => setAdditions(d.data.data))
      .catch((e) => console.error(e.response?.data?.error));
  };


  return (
    <div className="cardList" ref={listRef}>
        {cards.map((card) => (
          <div
            key={card._id}
            onClick={() => chooseCard(card)}
            className="CardBlockFilter"
          >
            <div className="cardBlockDateContainer">
              <h1>Організація: {card.organizationName}</h1>
              <h1>Дата створення: {card.docCreateDate}</h1>
              <h1>Срок дії до: {card.validityPeriod}</h1>
            </div>
          </div>
        ))}
    </div>
  );
}
