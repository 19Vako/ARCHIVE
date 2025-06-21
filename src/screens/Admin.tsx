import { useEffect, useState } from "react";
import "./styles/admin.css";
import Header from "../components/Header";
import AddManager from "../components/AddManager";
import AddCard from "../components/AddCard";
import { useStore } from "../context/Context";
import axios from "axios";
require("dotenv").config({ path: "../../.env" });
const env = process.env;

function Admin() {
  const [addCardOrUser, setaddCardOrUser] = useState(true);
  const { setCards, setGetCardError, setLoading, setHasMore, setPage } =
    useStore();
  const GetCards = async () => {
    setLoading(true);
    setGetCardError(null);

    try {
      const res = await axios.post(env.GET_CARDS!, { page: 1, limit: 50 });
      const newCards = res.data.cards || [];
      setCards(newCards); // просто ставим новые карточки
      setHasMore(newCards.length === 50); // true если ровно 50 карточек
      setPage(1);
    } catch (err: any) {
      setGetCardError(
        err?.response?.data?.error || "Помилка при завантаженні карток",
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    GetCards();
  }, []);

  return (
    <div className="adminContainer">
      <Header />
      <nav className="choiseOption">
        <button
          style={
            addCardOrUser
              ? { background: "#004884" }
              : { background: "#EAEAEA", color: "black" }
          }
          className="addManager"
          onClick={() => setaddCardOrUser(true)}
        >
          Додати менеджера
          <img
            src={
              addCardOrUser
                ? require("../icons/userIcon.png")
                : require("../icons/addUserBlack.png")
            }
            alt=""
          />
        </button>
        <button
          style={
            !addCardOrUser
              ? { background: "#004884" }
              : { background: "#EAEAEA", color: "black" }
          }
          className="addCard"
          onClick={() => setaddCardOrUser(false)}
        >
          <img
            src={
              !addCardOrUser
                ? require("../icons/inbox-icon.png")
                : require("../icons/inboxBlack.png")
            }
            alt=""
          />
          Додати картку
        </button>
      </nav>

      <main className="mainContainer">
        {addCardOrUser ? <AddManager /> : <AddCard />}
      </main>
    </div>
  );
}

export default Admin;
