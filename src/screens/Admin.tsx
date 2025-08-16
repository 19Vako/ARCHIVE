import { useEffect, useState } from "react";
import "./styles/admin.css";
import Header from "../components/Header";
import AddManager from "../components/AddManager";
import AddCard from "../components/AddCard";
import { useStore } from "../context/Context";
import axios from "axios";
const env = process.env;

function Admin() {
    const {
      setCards,
      setGetCardError,
    } = useStore();
  const [addCardOrUser, setaddCardOrUser] = useState(true);
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
