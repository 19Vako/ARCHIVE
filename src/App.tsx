
import { BrowserRouter as Router } from 'react-router-dom'; 
import { Provider } from './context/Context';
import AppRoutes from "./components/AppRoutes";
import "./App.css";

function App() {
  return (
    <div className="AppContainer">
      <Provider>
        <Router>
          <AppRoutes />
        </Router>
      </Provider>
    </div>
  );
}

export default App;
