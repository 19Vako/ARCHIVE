import "./styles/header.css";

import { Link } from "react-router-dom";
import { useStore } from "../context/Context";

function Header() {
  const { setFileName } = useStore();

  return (
    <header className="headerContainer">
      <Link onClick={() => setFileName("")} className="exitButton" to="/">
        <img src={require("../icons/log-out.png")} alt="exit" />
      </Link>
    </header>
  );
}

export default Header;
